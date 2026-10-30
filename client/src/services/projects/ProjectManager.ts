import { Project, ScorePage} from '../../domain';
import StorageType from "../storage/StorageType.ts";
import type {StorageService} from "../storage/StorageService.ts";
import {FileSystemEntryNames} from "../storage/fileSystem/storageHelpers.ts";
import {browserStorage} from '../dataAccess';
import {authService} from '../index';
import {MusicorpusMetadata} from "../../domain/metadata/MusicorpusMetadata.ts";
import {type IConvertPdfPagesService, ConvertPdfPagesService} from "../pdf/import/ConvertPdfPagesService.ts";
import type {ConvertedPdfPage} from '../pdf/import/ConvertPdfPagesService.ts';
import {SubdivisionsMapper} from './SubdivisionsMapper.ts';
import type {Instrument} from '../../domain/Instrument.ts';
import {StaffImageService, type IStaffImageService} from '../images/StaffImageService.ts';
import {StoredScorePage} from "./StoredScorePage.ts";

export interface StaffImage {
    blob: Blob;
    instrument: Instrument;
}

export interface IProjectManager {
    useBrowserStorage(): void;
    useLocalStorage(fileSystemStorage: StorageService): void;
    getCurrentStorageType(): StorageType;

    createProject(name: string, pdf: File, onProgress: (count: number, total: number) => void): Promise<Project>;
    loadProjects(): Promise<Project[]>;
    deleteProject(projectId: string): Promise<void>;
    saveProject(project: Project, pages: ScorePage[]): Promise<void>;

    loadPages(project: Project): Promise<ScorePage[]>;
    loadStaffImages(project: Project, instruments: readonly Instrument[]): AsyncIterable<StaffImage>;
}



export class ProjectManager implements IProjectManager {
    private type: StorageType = StorageType.Browser;
    private storage: StorageService = browserStorage;
    private pagesConverter: IConvertPdfPagesService = new ConvertPdfPagesService();
    private staffImageService: IStaffImageService = new StaffImageService();

    useBrowserStorage(): void {
        this.type = StorageType.Browser;
        this.storage = browserStorage;
    }

    useLocalStorage(localFileSystemStorage: StorageService): void {
        this.type = StorageType.LocalFileSystem;
        this.storage = localFileSystemStorage;
    }

    getCurrentStorageType(): StorageType {
        return this.type;
    }

    private async savePage(page: ScorePage, create: boolean = false): Promise<void> {
        const storedPage = StoredScorePage.fromPage(page);
        const changedStaves = [...page.staves].filter(staff => create || staff.isChanged);
        const bounds = changedStaves.map(staff => ({order: staff.order, ...staff.bounds}));
        // New edits during these writes must stay dirty for the next save.
        page.isChanged = false;
        for (const staff of changedStaves) staff.isChanged = false;
        try {
            await this.storage.savePage(storedPage, create);
            for await (const image of this.staffImageService.crop(storedPage.blob, bounds)) {
                await this.storage.saveStaffImage(page.projectId, page.number, image);
            }
        } catch (error) {
            page.isChanged = true;
            for (const staff of changedStaves) staff.isChanged = true;
            throw error;
        }
    }

    private async createProjectPages(projectId: string, pages: AsyncIterable<ConvertedPdfPage>): Promise<number> {
        let pageNumber: number = 0
        for await (const converted of pages) {
            const page = new ScorePage(
                projectId,
                pageNumber + 1,
                converted.width,
                converted.height,
                converted.blob
            );

            await this.savePage(page, true);
            pageNumber++;
        }
        return pageNumber;
    }

    async createProject(projectName: string, pdf: File, onProgress: (count: number, total: number) => void): Promise<Project> {
        const account = authService.currentAccount;
        if (!account?.userId.trim()) throw new Error('Select an account to create a project.');
        const userId = account.userId;
        const projectId = FileSystemEntryNames.getProjectId(userId, projectName);
        await this.storage.createProjectDir(projectId);

        await this.storage.saveMusicorpus(projectId, MusicorpusMetadata.createNew(userId, projectName))

        const pageCount = await this.createProjectPages(
            projectId,
            await this.pagesConverter.convert(pdf, onProgress)
        );

        const project = new Project(
            projectId,
            projectName,
            projectId,
            pageCount
        );
        await this.storage.saveProject(project);
        return project;
    }

    async loadProjects(): Promise<Project[]> {
        return this.storage.loadProjects();
    }

    async saveProject(project: Project, pages: ScorePage[]): Promise<void> {
        if (pages.some(page => page.projectId !== project.id)) {
            throw new Error('Cannot save pages belonging to another project.');
        }
        await this.storage.saveProject(project);
        for (const page of pages) {
            if (!page.isChanged) continue;
            await this.savePage(page);
        }
    }

    async deleteProject(projectId: string): Promise<void> {
        await this.storage.deleteProject(projectId);
    }

    async *loadStaffImages(project: Project, instruments: readonly Instrument[]): AsyncIterableIterator<StaffImage> {
        const selectedInstruments = new Map(instruments.map(instrument => [instrument.id, instrument]));
        const pages = await this.storage.loadPages(project.id);
        for (const page of pages.sort((a, b) => a.number - b.number)) {
            const staves = Object.entries(page.metadata.instruments).sort(([a], [b]) => Number(a) - Number(b));
            for (const [order, instrumentId] of staves) {
                const instrument = selectedInstruments.get(instrumentId);
                if (instrument) yield {
                    blob: await this.storage.loadStaffImage(project.id, page.number, Number(order)),
                    instrument,
                };
            }
        }
    }

    async loadPages(project: Project): Promise<ScorePage[]> {
        const storedPages = await this.storage.loadPages(project.id);
        const instrumentsById = new Map(project.instruments.map(instrument => [instrument.id, instrument]));
        return storedPages.map(stored => {
            const page = stored.asPage()
            const instruments: Record<string, Instrument> = {};
            for (const [order, instrumentId] of Object.entries(stored.metadata.instruments)) {
                const instrument = instrumentsById.get(instrumentId);
                if (!instrument) throw new Error(`Unknown instrument ${instrumentId} on page ${stored.number}.`);
                instruments[order] = instrument;
            }
            SubdivisionsMapper.initializePage(page, stored.subdivisions, instruments);
            page.markSaved();
            return page;
        });
    }
}
