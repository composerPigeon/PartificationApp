import {Project, type ProjectPage} from '../../domain';
import StorageType from "../dataAccess/StorageType.ts";
import type {StorageService} from "../dataAccess/StorageService.ts";
import {FileSystemEntryNames} from "../dataAccess/storageHelpers.ts";
import {browserStorage} from "../dataAccess";
import {MusicorpusMetadata} from "../../domain/MusicorpusMetadata.ts";

export interface IProjectManager {
    useBrowserStorage(browserStorage: StorageService): void;
    useLocalStorage(fileSystemStorage: StorageService): void;
    getCurrentStorageType(): StorageType;

    createProject(name: string, pages: AsyncIterable<Blob>): Promise<Project>;
    loadProjects(): Promise<Project[]>;

    loadPages(projectId: string): Promise<ProjectPage[]>;
}



export class ProjectManager implements IProjectManager {
    private type: StorageType = StorageType.Browser;
    private storage: StorageService = browserStorage;

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

    private async createMusicorpus(projectId: string, projectName: string) {
        let musicorpusMetadata = MusicorpusMetadata.createNew(projectName)
        await this.storage.saveMusicorpus(projectId, musicorpusMetadata);
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

    async createProject(projectName: string, pages: AsyncIterable<Blob>, ): Promise<Project> {
        let projectId = FileSystemEntryNames.getProjectId(projectName);
        await this.storage.createProjectDir(projectId);

        await this.createMusicorpus(projectId, projectName);

        let pageCount = await this.createProjectPages(projectId, pages);

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
