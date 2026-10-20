import { Project, ScorePage} from '../../domain';
import StorageType from "./StorageType.ts";
import type {StorageService} from "./StorageService.ts";
import {FileSystemEntryNames} from "../fileSystem/storageHelpers.ts";
import {browserStorage} from "../dataAccess";
import {MusicorpusMetadata} from "../../domain/metadata/MusicorpusMetadata.ts";
import {type IConvertPdfPagesService, ConvertPdfPagesService} from "../pdf/ConvertPdfPagesService.ts";
import type {ConvertedPdfPage} from '../pdf/ConvertPdfPagesService.ts';
import {ScorePageMetadata} from '../../domain/metadata/ScorePageMetadata.ts';
import {SubdivisionsMetadata} from '../../domain/metadata/SubdivisionsMetadata.ts';
import {SubdivisionsMapper} from './SubdivisionsMapper.ts';
import type {Instrument} from '../../domain/Instrument.ts';
import {StaffImageService, type IStaffImageService} from '../images/StaffImageService.ts';

export interface IProjectManager {
    useBrowserStorage(browserStorage: StorageService): void;
    useLocalStorage(fileSystemStorage: StorageService): void;
    getCurrentStorageType(): StorageType;

    createProject(name: string, pdf: File, onProgress: (count: number, total: number) => void): Promise<Project>;
    loadProjects(): Promise<Project[]>;
    deleteProject(projectId: string): Promise<void>;
    saveProject(project: Project, pages: ScorePage[]): Promise<void>;

    loadPages(project: Project): Promise<ScorePage[]>;
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
        const version = page.version;
        const storedPage = {
            projectId: page.projectId,
            number: page.number,
            blob: page.blob,
            metadata: ScorePageMetadata.create(page),
            subdivisions: SubdivisionsMetadata.create(page),
        };
        const bounds = Object.values(storedPage.subdivisions.staves).map(({bbox: [x, y, width, height]}) => ({x, y, width, height}));
        await this.storage.savePage(storedPage, create);
        await this.storage.saveStaffImages(page.projectId, page.number, this.staffImageService.crop(storedPage.blob, bounds));
        page.markSaved(version);
    }

    private async createProjectPages(projectId: string, pages: AsyncIterable<ConvertedPdfPage>): Promise<number> {
        let pageNumber: number = 0
        for await (const converted of pages) {
            let page = new ScorePage(
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
        let projectId = FileSystemEntryNames.getProjectId(projectName);
        await this.storage.createProjectDir(projectId);

        await this.storage.saveMusicorpus(projectId, MusicorpusMetadata.createNew(projectName))

        let pageCount = await this.createProjectPages(
            projectId,
            await this.pagesConverter.convert(pdf, onProgress)
        );

        let project = new Project(
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

    async loadPages(project: Project): Promise<ScorePage[]> {
        const storedPages = await this.storage.loadPages(project.id);
        const instrumentsById = new Map(project.instruments.map(instrument => [instrument.id, instrument]));
        return storedPages.map(stored => {
            const page = new ScorePage(project.id, stored.number, stored.metadata.width, stored.metadata.height, stored.blob);
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
