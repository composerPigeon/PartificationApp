import type {Project, ProjectPage} from '../../domain';
import StorageType from "../dataAccess/StorageType.ts";
import type {StorageService} from "../dataAccess/StorageService.ts";
import {getProjectId} from "../dataAccess/storageHelpers.ts";
import {browserStorage} from "../dataAccess";

export interface DirectoryState {
    name: string;
    granted: boolean;
}
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

    async createProject(projectName: string, pages: AsyncIterable<Blob>): Promise<Project> {
        let projectId = getProjectId(projectName);
        await this.storage.createProjectDir(projectId);

        let pageNumber: number = 1
        for await (const pageBlob of pages) {
            let page: ProjectPage = {
                projectId,
                number: pageNumber,
                blob: pageBlob
            }

            await this.storage.savePage(page)
            pageNumber++;
        }

        let project: Project =  {
            id: projectId,
            name: projectName,
            pageCount: pageNumber
        }
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
