import {PDFDocument, PageSizes, StandardFonts} from 'pdf-lib';
import type {PDFFont, PDFPage, PDFImage} from 'pdf-lib';
import type {Project, Instrument, ExportContext} from '../../../domain';
import type {IProjectManager} from '../../projects/ProjectManager.ts';
import appIconUrl from '../../../../public/icons/app-icon.svg?url';

const PAGE_MARGIN = 40;
const TITLE_SIZE = 28;
const TITLE_LINE_HEIGHT = 36;
const TITLE_SPACING = 24;
const SUBTITLE_SIZE = 14;
const SUBTITLE_LINE_HEIGHT = 20;
const SHORTCUT_SIZE = 10;
const SHORTCUT_GAP = 10;
const APP_ICON_SIZE = 24;
const APP_ICON_MARGIN = 16;

interface PdfRenderContext {
    document: PDFDocument;
    font: PDFFont;
    labelFont: PDFFont;
    page: PDFPage;
    top: number;
    pageWidth: number;
    pageHeight: number;
    contentWidth: number;
    contentHeight: number;
}

interface PreparedStaff {
    image: PDFImage;
    instrument: Instrument;
    width: number;
    height: number;
    rowHeight: number;
}

function titleLines(title: string, font: PDFFont, width: number, size = TITLE_SIZE): string[] {
    const lines: string[] = [];
    let line = '';
    for (const character of title.replace(/\s+/g, ' ').trim()) {
        if (line && font.widthOfTextAtSize(line + character, size) > width) {
            lines.push(line.trim());
            line = '';
        }
        line += character;
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
}

export interface IExportPdfService {
    createPdf(project: Project, exportContext: ExportContext, onSpacingLimit?: (maximum: number) => void): Promise<Blob>;
}

export class ExportPdfService implements IExportPdfService {
    private readonly projectManager: IProjectManager;

    constructor(projectManager: IProjectManager) {
        this.projectManager = projectManager;
    }

    async createPdf(project: Project, exportContext: ExportContext, onSpacingLimit?: (maximum: number) => void): Promise<Blob> {
        const instruments = project.resolveInstruments(exportContext);

        const documentContext = await this.createDocument(project);
        await this.drawAppIcon(documentContext);
        this.drawHeading(documentContext, project, instruments);
        const spacingLimit = await this.drawStaves(documentContext, project, instruments, exportContext);
        onSpacingLimit?.(spacingLimit);
        return this.serializeDocument(documentContext.document);
    }

    private async drawAppIcon(context: PdfRenderContext): Promise<void> {
        const image = new Image();
        image.src = appIconUrl;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const graphics = canvas.getContext('2d');
        if (!graphics) throw new Error('Unable to render the app icon for PDF export.');
        graphics.drawImage(image, 0, 0, canvas.width, canvas.height);
        const icon = await context.document.embedPng(canvas.toDataURL('image/png'));
        context.page.drawImage(icon, {
            x: APP_ICON_MARGIN, y: context.pageHeight - APP_ICON_MARGIN - APP_ICON_SIZE,
            width: APP_ICON_SIZE, height: APP_ICON_SIZE,
        });
    }

    private async createDocument(project: Project): Promise<PdfRenderContext> {
        const document = await PDFDocument.create();
        document.setTitle(project.title);
        document.setAuthor(project.author);
        document.setSubject(project.subtitle);
        const font = await document.embedFont(StandardFonts.TimesRomanBoldItalic);
        const labelFont = await document.embedFont(StandardFonts.Helvetica);
        const [pageWidth, pageHeight] = PageSizes.A4;
        const contentWidth = pageWidth - PAGE_MARGIN * 2;
        const contentHeight = pageHeight - PAGE_MARGIN * 2;
        return {
            document, font, labelFont, pageWidth, pageHeight, contentWidth, contentHeight,
            page: document.addPage(PageSizes.A4), top: pageHeight - PAGE_MARGIN,
        };
    }

    private drawHeading(context: PdfRenderContext, project: Project, instruments: readonly Instrument[]): void {
        this.drawHeadingText(context, project.title, context.font, TITLE_SIZE, TITLE_LINE_HEIGHT);
        this.drawHeadingText(context, project.subtitle, context.labelFont, SUBTITLE_SIZE, SUBTITLE_LINE_HEIGHT);
        const columnWidth = (context.contentWidth - TITLE_SPACING) / 2;
        const instrumentLines = instruments.length === 1
            ? titleLines(instruments[0].title, context.labelFont, columnWidth, SUBTITLE_SIZE)
            : [];
        const authorLines = [project.author, project.authorDate].flatMap(text =>
            titleLines(text, context.labelFont, columnWidth, SUBTITLE_SIZE));
        for (let index = 0; index < Math.max(instrumentLines.length, authorLines.length); index++) {
            if (context.top - SUBTITLE_LINE_HEIGHT < PAGE_MARGIN) {
                context.page = context.document.addPage(PageSizes.A4);
                context.top = context.pageHeight - PAGE_MARGIN;
            }
            const y = context.top - SUBTITLE_SIZE;
            if (instrumentLines[index]) {
                context.page.drawText(instrumentLines[index], {
                    font: context.labelFont, size: SUBTITLE_SIZE, x: PAGE_MARGIN, y,
                });
            }
            if (authorLines[index]) {
                const line = authorLines[index];
                context.page.drawText(line, {
                    font: context.labelFont, size: SUBTITLE_SIZE,
                    x: context.pageWidth - PAGE_MARGIN - context.labelFont.widthOfTextAtSize(line, SUBTITLE_SIZE), y,
                });
            }
            context.top -= SUBTITLE_LINE_HEIGHT;
        }
        context.top -= TITLE_SPACING;
    }

    private drawHeadingText(context: PdfRenderContext, text: string, font: PDFFont, size: number,
                            lineHeight: number): void {
        for (const line of titleLines(text, font, context.contentWidth, size)) {
            if (context.top - lineHeight < PAGE_MARGIN) {
                context.page = context.document.addPage(PageSizes.A4);
                context.top = context.pageHeight - PAGE_MARGIN;
            }
            const width = font.widthOfTextAtSize(line, size);
            context.page.drawText(line, {
                font, size,
                x: (context.pageWidth - width) / 2,
                y: context.top - size,
            });
            context.top -= lineHeight;
        }
    }

    private async drawStaves(context: PdfRenderContext, project: Project, instruments: readonly Instrument[],
                             exportContext: ExportContext): Promise<number> {
        const {labelFont, pageWidth} = context;
        const showShortcuts = instruments.length > 1;
        const shortcutWidth = showShortcuts
            ? Math.max(...instruments.map(instrument => labelFont.widthOfTextAtSize(instrument.shortcut, SHORTCUT_SIZE)))
            : 0;
        const staffLeft = PAGE_MARGIN + (showShortcuts ? shortcutWidth + SHORTCUT_GAP : 0);
        const staffWidth = pageWidth - PAGE_MARGIN - staffLeft;
        if (staffWidth <= 0) throw new Error('Instrument shortcuts are too long to fit on the page.');
        let count = 0;
        let previousHeight = 0;
        let previousAvailableHeight = context.contentHeight;
        let spacingLimit = 0;
        let group: PreparedStaff[] = [];
        const periodInstrumentIds = new Set<string>();
        for await (const {blob, instrument} of this.projectManager.loadStaffImages(project, instruments)) {
            // A repeated instrument starts the next root-system period.
            if (periodInstrumentIds.has(instrument.id)) {
                this.drawRootSystem(context, group, staffLeft, staffWidth, showShortcuts, exportContext, count > group.length);
                group = [];
                periodInstrumentIds.clear();
            }
            periodInstrumentIds.add(instrument.id);
            const image = await context.document.embedPng(await blob.arrayBuffer());
            const scale = Math.min(staffWidth / image.width, context.contentHeight / image.height);
            const width = image.width * scale;
            const height = image.height * scale;
            const rowHeight = Math.max(height, showShortcuts ? SHORTCUT_SIZE : 0);
            if (count > 0) {
                // Equality still fits, so the limit is the next whole point.
                spacingLimit = Math.max(spacingLimit, Math.floor(previousAvailableHeight - previousHeight - rowHeight) + 1);
            }
            previousHeight = rowHeight;
            previousAvailableHeight = count === 0
                ? (rowHeight > context.top - PAGE_MARGIN ? context.contentHeight : context.top - PAGE_MARGIN)
                : context.contentHeight;
            group.push({image, instrument, width, height, rowHeight});
            count++;
        }
        if (!count) throw new Error('No saved staves were found for the selected instruments.');
        this.drawRootSystem(context, group, staffLeft, staffWidth, showShortcuts, exportContext, count > group.length);
        return spacingLimit;
    }

    private drawRootSystem(context: PdfRenderContext, staves: PreparedStaff[], staffLeft: number,
                           staffWidth: number, showShortcut: boolean, exportContext: ExportContext,
                           hasPreviousSystem: boolean): void {
        const naturalHeight = staves.reduce((height, staff) => height + staff.rowHeight, 0)
            + (staves.length - 1) * exportContext.withinSystemSpacing;
        const scale = Math.min(1, context.contentHeight / naturalHeight);
        const height = naturalHeight * scale;
        const gap = hasPreviousSystem ? exportContext.betweenSystemSpacing : 0;
        if (context.top - gap - height < PAGE_MARGIN) {
            context.page = context.document.addPage(PageSizes.A4);
            context.top = context.pageHeight - PAGE_MARGIN;
        } else {
            context.top -= gap;
        }
        for (let index = 0; index < staves.length; index++) {
            const staff = staves[index];
            if (index > 0) context.top -= exportContext.withinSystemSpacing * scale;
            const width = staff.width * scale;
            const height = staff.height * scale;
            if (showShortcut) {
                const fontSize = SHORTCUT_SIZE * scale;
                const textHeight = context.labelFont.heightAtSize(fontSize, {descender: false});
                context.page.drawText(staff.instrument.shortcut, {
                    font: context.labelFont, size: fontSize,
                    x: PAGE_MARGIN, y: context.top - height / 2 - textHeight / 2,
                });
            }
            context.page.drawImage(staff.image, {
                x: staffLeft + (staffWidth - width) / 2, y: context.top - height, width, height,
            });
            context.top -= staff.rowHeight * scale;
        }
    }

    private async serializeDocument(document: PDFDocument): Promise<Blob> {
        const bytes = await document.save();
        return new Blob([new Uint8Array(bytes)], {type: 'application/pdf'});
    }
}
