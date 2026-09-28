import type {StorageService} from "./StorageService.ts";
import {Project, type ProjectPage} from "../../domain";
import {FileSystemEntryNames} from "./storageHelpers.ts";
import type {MusicorpusMetadata} from "../../domain/MusicorpusMetadata.ts";
import {deserialize, serialize} from "ts-jackson";

type WritableDirectory = FileSystemDirectoryHandle & {
    queryPermission(options: {mode: 'readwrite'}): Promise<PermissionState>;
    requestPermission(options: {mode: 'readwrite'}): Promise<PermissionState>;
    values(): AsyncIterableIterator<FileSystemHandle>;
};

export class FileSystemStorageService implements StorageService {
    private readonly rootDir: FileSystemDirectoryHandle;

    constructor(rootDir: FileSystemDirectoryHandle) {
        this.rootDir = rootDir;
    }

    private async writeFileAsBlob(directory: FileSystemDirectoryHandle, fileName: string, blob: Blob): Promise<void> {
        const file = await directory.getFileHandle(fileName, {create: true});
        const writer = await file.createWritable();
        try {
            await writer.write(blob);
            await writer.close();
        } catch (error) {
            await writer.abort().catch(() => undefined);
            throw error;
        }
    }

    private async writeJsonFile<TData>(directory: FileSystemDirectoryHandle, name: string, data: TData): Promise<void> {
        const file = await directory.getFileHandle(name, {create: true});
        const writer = await file.createWritable();
        try {
            let stringData = JSON.stringify(serialize(data), null, 2);
            await writer.write(stringData);
            await writer.close();
        } catch (error) {
            await writer.abort().catch(() => undefined);
            throw error;
        }
    }

    private async readFileAsBlob(directory: FileSystemDirectoryHandle, fileName: string): Promise<Blob> {
        try {
            let fileHandler = await directory.getFileHandle(fileName);
            return await fileHandler.getFile();
        }
        catch (error) {
            throw new Error(`Unable to read file ${fileName} in folder ${directory.name}.`, {cause: error})
        }
    }

    private async readJsonFileAs<TOut>(directory: FileSystemDirectoryHandle, fileName: string, serializableClass: new() => TOut): Promise<TOut> {
        let result: TOut;
        try {
            let fileHandler = await directory.getFileHandle(fileName);
            let fileContent = await (await fileHandler.getFile()).text()
            result = deserialize(JSON.parse(fileContent), serializableClass);
        }
        catch (error) {
            throw new Error(`Unable to read file ${fileName} in folder ${directory.name}.`, {cause: error})
        }
        return result;
    }

    async createProjectDir(projectId: string): Promise<void> {
        await this.rootDir.getDirectoryHandle(projectId, {create: true});
    }

    async saveProject(project: Project): Promise<void> {
        const projectDir = await this.rootDir.getDirectoryHandle(project.id);

        try {
            await this.writeJsonFile(
                projectDir,
                FileSystemEntryNames.projectFile,
                project
            );
        } catch (error) {
            try {
                await this.rootDir.removeEntry(project.id, {recursive: true});
            } catch {
                throw new Error(`Unable to save project; incomplete files remain in folder ${project.id}.`, {cause: error});
            }
            throw error;
        }
    }

    async saveMusicorpus(projectId: string, musicorpus: MusicorpusMetadata) {
        const projectDir = await this.rootDir.getDirectoryHandle(projectId);

        try {
            await this.writeJsonFile(
                projectDir,
                FileSystemEntryNames.musicorpusFile,
                musicorpus
            );
        } catch (error) {
            throw new Error("Unable to save musicorpusFile");
        }
    }

    async savePage(page: ProjectPage): Promise<void> {
        let projectDir = await this.rootDir.getDirectoryHandle(page.projectId);
        let pageDirName = FileSystemEntryNames.getPageDirName(page.projectId, page.number);
        let pageDir = await projectDir.getDirectoryHandle(pageDirName, {create: true});
        await this.writeFileAsBlob(pageDir, FileSystemEntryNames.imageFile, page.blob);
    }

    async loadProjects(): Promise<Project[]> {
        const root = this.rootDir as WritableDirectory;
        const projects: Project[] = [];

        for await (const [name, entry] of this.rootDir) {
            if (entry.kind !== 'directory')
                continue;
            const projectDir = await root.getDirectoryHandle(name);
            try {
                let project = await this.readJsonFileAs(projectDir, FileSystemEntryNames.projectFile, Project);
                projects.push(project);
            } catch (error) {
                if (error instanceof DOMException && error.name === 'NotFoundError') continue;
                throw error;
            }
        }

        return projects.sort(
            (a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'})
        );
    }

    async loadPages(projectId: string): Promise<ProjectPage[]> {
        let projectDir = await this.rootDir.getDirectoryHandle(projectId);
        const pages: ProjectPage[] = [];

        let pageNumber = 1;
        for await (const [name, entry] of projectDir) {
            if (entry.kind !== 'directory')
                continue;

            const pageDir = await projectDir.getDirectoryHandle(name);
            const blob = await this.readFileAsBlob(pageDir, FileSystemEntryNames.imageFile);
            pages.push({
                projectId,
                number: pageNumber,
                blob
            })

            pageNumber++;
        }
        return pages;
    }

    async deleteProject(projectId: string): Promise<void> {
        await this.rootDir.removeEntry(projectId, {recursive: true});
    }
}