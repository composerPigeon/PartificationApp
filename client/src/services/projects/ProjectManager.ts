import {Project, type ProjectPage} from '../../domain';
import StorageType from "./StorageType.ts";
import type {StorageService} from "./StorageService.ts";
import {FileSystemEntryNames} from "../fileSystem/storageHelpers.ts";
import {browserStorage} from "../dataAccess";
import {MusicorpusMetadata} from "../../domain/MusicorpusMetadata.ts";
import {type IConvertPdfPagesService, ConvertPdfPagesService} from "../pdf/ConvertPdfPagesService.ts";

export interface IProjectManager {
    useBrowserStorage(browserStorage: StorageService): void;
    useLocalStorage(fileSystemStorage: StorageService): void;
    getCurrentStorageType(): StorageType;

    createProject(name: string, pdf: File, onProgress: (count: number, total: number) => void): Promise<Project>;
    loadProjects(): Promise<Project[]>;

    loadPages(projectId: string): Promise<ProjectPage[]>;
}



export class ProjectManager implements IProjectManager {
    private type: StorageType = StorageType.Browser;
    private storage: StorageService = browserStorage;
    private pagesConverter: IConvertPdfPagesService = new ConvertPdfPagesService();

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

    private async createProjectPages(projectId: string, pages: AsyncIterable<Blob>): Promise<number> {
        let pageNumber: number = 0
        for await (const pageBlob of pages) {
            let page: ProjectPage = {
                projectId,
                number: pageNumber + 1,
                blob: pageBlob
            }

            await this.storage.savePage(page)
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

    async loadPages(projectId: string): Promise<ProjectPage[]> {
        return await this.storage.loadPages(projectId);
    }
}
