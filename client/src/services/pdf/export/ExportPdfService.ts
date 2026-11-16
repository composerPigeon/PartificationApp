import {PDFDocument, PageSizes, StandardFonts} from 'pdf-lib';
import type {PDFFont, PDFPage, PDFImage} from 'pdf-lib';
import type {Project, Instrument, ExportContext} from '../../../domain';
import type {StaffImage, IProjectManager} from '../../projects/ProjectManager.ts';
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

interface StaffLayout {
    left: number;
    width: number;
    showShortcuts: boolean;
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
        const layout = this.createStaffLayout(context, instruments, exportContext.isShortcutsVisible);
        const periods = await this.loadInstrumentPeriods(context, project, instruments, layout);
        const spacingLimit = this.calculateSpacingLimit(context, periods);
        for (let index = 0; index < periods.length; index++) {
            this.drawPeriod(context, periods[index], layout, exportContext, index > 0);
        }
        return spacingLimit;
    }

    private createStaffLayout(context: PdfRenderContext, instruments: readonly Instrument[], showShortcuts: boolean): StaffLayout {
        const shortcutWidth = showShortcuts
            ? Math.max(...instruments.map(instrument => context.labelFont.widthOfTextAtSize(instrument.shortcut, SHORTCUT_SIZE)))
            : 0;
        const left = PAGE_MARGIN + (showShortcuts ? shortcutWidth + SHORTCUT_GAP : 0);
        const width = context.pageWidth - PAGE_MARGIN - left;
        if (width <= 0) throw new Error('Instrument shortcuts are too long to fit on the page.');
        return {left, width, showShortcuts};
    }

    private async loadInstrumentPeriods(context: PdfRenderContext, project: Project,
                                        instruments: readonly Instrument[], layout: StaffLayout): Promise<PreparedStaff[][]> {
        const periods: PreparedStaff[][] = [];
        let previousPeriod: number | undefined;
        for await (const staff of this.projectManager.loadStaffImages(project, instruments)) {
            if (staff.periodIndex !== previousPeriod || !periods.length) periods.push([]);
            periods[periods.length - 1].push(await this.prepareStaff(context, staff, layout));
            previousPeriod = staff.periodIndex;
        }
        if (!periods.length) throw new Error('No saved staves were found for the selected instruments.');
        return periods;
    }

    private async prepareStaff(context: PdfRenderContext, staff: StaffImage, layout: StaffLayout): Promise<PreparedStaff> {
        const image = await context.document.embedPng(await staff.blob.arrayBuffer());
        const scale = Math.min(layout.width / image.width, context.contentHeight / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const rowHeight = Math.max(height, layout.showShortcuts ? SHORTCUT_SIZE : 0);
        return {image, instrument: staff.instrument, width, height, rowHeight};
    }

    private calculateSpacingLimit(context: PdfRenderContext, periods: PreparedStaff[][]): number {
        const staves = periods.flat();
        const firstAvailable = Math.max(context.top - PAGE_MARGIN, staves[0].rowHeight);
        let maximum = 0;
        for (let index = 1; index < staves.length; index++) {
            const available = index === 1 && staves[0].rowHeight <= context.top - PAGE_MARGIN
                ? firstAvailable : context.contentHeight;
            // Equality still fits; the next whole point forces a page break.
            maximum = Math.max(maximum, Math.floor(available - staves[index - 1].rowHeight - staves[index].rowHeight) + 1);
        }
        return maximum;
    }

    private drawPeriod(context: PdfRenderContext, staves: PreparedStaff[], layout: StaffLayout,
                       exportContext: ExportContext, hasPreviousPeriod: boolean): void {
        const naturalHeight = this.measurePeriod(staves, exportContext.withinSystemSpacing);
        const scale = Math.min(1, context.contentHeight / naturalHeight);
        const gap = hasPreviousPeriod ? exportContext.betweenSystemSpacing : 0;
        this.reservePeriodSpace(context, naturalHeight * scale, gap);
        for (let index = 0; index < staves.length; index++) {
            if (index > 0) context.top -= exportContext.withinSystemSpacing * scale;
            this.drawStaff(context, staves[index], layout, scale);
        }
    }

    private measurePeriod(staves: PreparedStaff[], spacing: number): number {
        return staves.reduce((height, staff) => height + staff.rowHeight, 0) + (staves.length - 1) * spacing;
    }

    private reservePeriodSpace(context: PdfRenderContext, height: number, gap: number): void {
        if (context.top - gap - height < PAGE_MARGIN) {
            context.page = context.document.addPage(PageSizes.A4);
            context.top = context.pageHeight - PAGE_MARGIN;
        } else {
            context.top -= gap;
        }
    }

    private drawStaff(context: PdfRenderContext, staff: PreparedStaff, layout: StaffLayout, scale: number): void {
        const width = staff.width * scale;
        const height = staff.height * scale;
        if (layout.showShortcuts) this.drawShortcut(context, staff.instrument, height, scale);
        context.page.drawImage(staff.image, {
            x: layout.left + (layout.width - width) / 2, y: context.top - height, width, height,
        });
        context.top -= staff.rowHeight * scale;
    }

    private drawShortcut(context: PdfRenderContext, instrument: Instrument, staffHeight: number, scale: number): void {
        const fontSize = SHORTCUT_SIZE * scale;
        const textHeight = context.labelFont.heightAtSize(fontSize, {descender: false});
        context.page.drawText(instrument.shortcut, {
            font: context.labelFont, size: fontSize,
            x: PAGE_MARGIN, y: context.top - staffHeight / 2 - textHeight / 2,
        });
    }

    private async serializeDocument(document: PDFDocument): Promise<Blob> {
        const bytes = await document.save();
        return new Blob([new Uint8Array(bytes)], {type: 'application/pdf'});
    }
}
