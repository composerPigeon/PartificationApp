import {PDFDocument, PageSizes, StandardFonts} from 'pdf-lib';
import type {PDFFont, PDFPage} from 'pdf-lib';
import type {Project} from '../../../domain';
import type {Instrument} from '../../../domain/Instrument.ts';
import type {IProjectManager} from '../../projects/ProjectManager.ts';

const PAGE_MARGIN = 40;
const STAFF_SPACING = 18;
const TITLE_SIZE = 20;
const TITLE_LINE_HEIGHT = 26;
const TITLE_SPACING = 24;
const SUBTITLE_SIZE = 14;
const SUBTITLE_LINE_HEIGHT = 20;
const SHORTCUT_SIZE = 10;
const SHORTCUT_GAP = 10;

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

    private async createDocument(project: Project): Promise<ExportContext> {
        const document = await PDFDocument.create();
        document.setTitle(project.projectName);
        const font = await document.embedFont(StandardFonts.HelveticaBold);
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
        const {document, font, labelFont, pageWidth, pageHeight, contentWidth} = context;
        let {page, top} = context;
        for (const line of titleLines(project.projectName, font, contentWidth)) {
            if (top - TITLE_LINE_HEIGHT < PAGE_MARGIN) {
                page = document.addPage(PageSizes.A4);
                top = pageHeight - PAGE_MARGIN;
            }
            page.drawText(line, {font, size: TITLE_SIZE,
                x: (pageWidth - font.widthOfTextAtSize(line, TITLE_SIZE)) / 2, y: top - TITLE_SIZE});
            top -= TITLE_LINE_HEIGHT;
        }
        if (instruments.length === 1) {
            for (const line of titleLines(instruments[0].title, labelFont, contentWidth, SUBTITLE_SIZE)) {
                if (top - SUBTITLE_LINE_HEIGHT < PAGE_MARGIN) {
                    page = document.addPage(PageSizes.A4);
                    top = pageHeight - PAGE_MARGIN;
                }
                page.drawText(line, {font: labelFont, size: SUBTITLE_SIZE,
                    x: (pageWidth - labelFont.widthOfTextAtSize(line, SUBTITLE_SIZE)) / 2,
                    y: top - SUBTITLE_SIZE});
                top -= SUBTITLE_LINE_HEIGHT;
            }
        }
        top -= TITLE_SPACING;
        context.page = page;
        context.top = top;
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
