import {PDFDocument, PageSizes, StandardFonts} from 'pdf-lib';
import type {PDFFont, PDFPage} from 'pdf-lib';
import type {Project, Instrument} from '../../../domain';
import type {IProjectManager} from '../../projects/ProjectManager.ts';
import appIconUrl from '../../../../public/icons/app-icon.svg?url';

const PAGE_MARGIN = 40;
const STAFF_SPACING = 18;
const TITLE_SIZE = 28;
const TITLE_LINE_HEIGHT = 36;
const TITLE_SPACING = 24;
const SUBTITLE_SIZE = 14;
const SUBTITLE_LINE_HEIGHT = 20;
const SHORTCUT_SIZE = 10;
const SHORTCUT_GAP = 10;
const APP_ICON_SIZE = 24;
const APP_ICON_MARGIN = 16;

interface ExportContext {
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
    createPdf(project: Project, instruments: readonly Instrument[]): Promise<Blob>;
}

export class ExportPdfService implements IExportPdfService {
    private readonly projectManager: IProjectManager;

    constructor(projectManager: IProjectManager) {
        this.projectManager = projectManager;
    }

    async createPdf(project: Project, instruments: readonly Instrument[]): Promise<Blob> {
        this.validateInstruments(project, instruments);
        const context = await this.createDocument(project);
        await this.drawAppIcon(context);
        this.drawHeading(context, project, instruments);
        await this.drawStaves(context, project, instruments);
        return this.serializeDocument(context.document);
    }

    private validateInstruments(project: Project, instruments: readonly Instrument[]): void {
        if (!instruments.length) throw new Error('Select at least one instrument to preview.');
        const projectIds = new Set(project.instruments.map(instrument => instrument.id));
        if (instruments.some(instrument => !projectIds.has(instrument.id))) {
            throw new Error('Selected instruments must belong to the current project.');
        }
    }

    private async drawAppIcon(context: ExportContext): Promise<void> {
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
        context.top -= APP_ICON_SIZE + 12;
    }

    private async createDocument(project: Project): Promise<ExportContext> {
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

    private drawHeading(context: ExportContext, project: Project, instruments: readonly Instrument[]): void {
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

    private drawHeadingText(context: ExportContext, text: string, font: PDFFont, size: number,
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

    private async drawStaves(context: ExportContext, project: Project, instruments: readonly Instrument[]): Promise<void> {
        const {labelFont, pageWidth} = context;
        const showShortcuts = instruments.length > 1;
        const shortcutWidth = showShortcuts
            ? Math.max(...instruments.map(instrument => labelFont.widthOfTextAtSize(instrument.shortcut, SHORTCUT_SIZE)))
            : 0;
        const staffLeft = PAGE_MARGIN + (showShortcuts ? shortcutWidth + SHORTCUT_GAP : 0);
        const staffWidth = pageWidth - PAGE_MARGIN - staffLeft;
        if (staffWidth <= 0) throw new Error('Instrument shortcuts are too long to fit on the page.');
        let count = 0;
        for await (const {blob, instrument} of this.projectManager.loadStaffImages(project, instruments)) {
            await this.drawStaff(context, blob, instrument, staffLeft, staffWidth, showShortcuts);
            count++;
        }
        if (!count) throw new Error('No saved staves were found for the selected instruments.');
    }

    private async drawStaff(context: ExportContext, blob: Blob, instrument: Instrument,
                            staffLeft: number, staffWidth: number, showShortcut: boolean): Promise<void> {
        const {document, labelFont, pageHeight, contentHeight} = context;
        let {page, top} = context;
        const image = await document.embedPng(await blob.arrayBuffer());
        const scale = Math.min(staffWidth / image.width, contentHeight / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const rowHeight = Math.max(height, showShortcut ? SHORTCUT_SIZE : 0);
        if (top - rowHeight < PAGE_MARGIN) {
            page = document.addPage(PageSizes.A4);
            top = pageHeight - PAGE_MARGIN;
        }
        if (showShortcut) {
            const textHeight = labelFont.heightAtSize(SHORTCUT_SIZE, {descender: false});
            page.drawText(instrument.shortcut, {font: labelFont, size: SHORTCUT_SIZE,
                x: PAGE_MARGIN, y: top - height / 2 - textHeight / 2});
        }
        page.drawImage(image, {x: staffLeft + (staffWidth - width) / 2, y: top - height, width, height});
        context.page = page;
        context.top = top - rowHeight - STAFF_SPACING;
    }

    private async serializeDocument(document: PDFDocument): Promise<Blob> {
        const bytes = await document.save();
        return new Blob([new Uint8Array(bytes)], {type: 'application/pdf'});
    }
}
