import type {StorageService} from "../projects/StorageService.ts";
import {Project} from "../../domain";
import {FileSystemEntryNames} from "./storageHelpers.ts";
import type {MusicorpusMetadata} from "../../domain/metadata/MusicorpusMetadata.ts";
import {deserialize, serialize} from "ts-jackson";
import {SubdivisionsMetadata} from '../../domain/metadata/SubdivisionsMetadata.ts';
import {ScorePageMetadata} from '../../domain/metadata/ScorePageMetadata.ts';
import type {StoredScorePage} from '../projects/StoredScorePage.ts';

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
                FileSystemEntryNames.projectMetadataFile,
                project
            );
        } catch (error) {
            throw new Error(`Unable to save project ${project.id}.`, {cause: error});
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

    async savePage(page: StoredScorePage, create: boolean = false): Promise<void> {
        let projectDir = await this.rootDir.getDirectoryHandle(page.projectId);
        let pageDirName = FileSystemEntryNames.getPageDirName(page.projectId, page.number);
        let pageDir = await projectDir.getDirectoryHandle(pageDirName, {create});
        if (create) {
            await this.writeFileAsBlob(pageDir, FileSystemEntryNames.pageImageFile, page.blob);
        }
        await this.writeJsonFile(pageDir, FileSystemEntryNames.pageMetadataFile, page.metadata);
        await this.writeJsonFile(pageDir, FileSystemEntryNames.subdivisionsMetadataFile, page.subdivisions);
    }

    async saveStaffImages(projectId: string, pageNumber: number, images: AsyncIterable<Blob>): Promise<void> {
        const projectDir = await this.rootDir.getDirectoryHandle(projectId);
        const pageDir = await projectDir.getDirectoryHandle(FileSystemEntryNames.getPageDirName(projectId, pageNumber));
        const stavesDir = await pageDir.getDirectoryHandle(FileSystemEntryNames.stavesDirectory, {create: true});
        let order = 0;
        for await (const image of images) {
            const staffDir = await stavesDir.getDirectoryHandle(String(++order), {create: true});
            await this.writeFileAsBlob(staffDir, FileSystemEntryNames.pageImageFile, image);
        }
        // Remove stale crops only after all current images have been written successfully.
        for await (const [name, entry] of stavesDir) {
            if (entry.kind === 'directory' && /^[1-9]\d*$/.test(name) && Number(name) > order) {
                await stavesDir.removeEntry(name, {recursive: true});
            }
        }
    }

    private async readPageMetadata(directory: FileSystemDirectoryHandle): Promise<ScorePageMetadata> {
        const file = await directory.getFileHandle(FileSystemEntryNames.pageMetadataFile);
        const data = JSON.parse(await (await file.getFile()).text());
        if (!data || !Number.isSafeInteger(data.width) || data.width <= 0
            || !Number.isSafeInteger(data.height) || data.height <= 0) {
            throw new Error(`Invalid page dimensions in folder ${directory.name}.`);
        }
        const mapping = data.instruments;
        if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)
            || !Object.entries(mapping).every(([order, instrumentId]) => /^[1-9]\d*$/.test(order) && typeof instrumentId === 'string')) {
            throw new Error(`Invalid staff instrument mapping in folder ${directory.name}: expected instruments to be an object mapping staff order to instrument ID.`);
        }
        const metadata = new ScorePageMetadata(data.width, data.height, mapping);
        for (const key of ['leftDivider', 'rightDivider'] as const) {
            if (data[key] === undefined) continue;
            if (!data[key] || typeof data[key].x !== 'number' || !Number.isFinite(data[key].x)) {
                throw new Error(`Invalid ${key} position in folder ${directory.name}.`);
            }
            metadata[key] = {x: data[key].x};
        }
        return metadata;
    }

    async loadProjects(): Promise<Project[]> {
        const root = this.rootDir as WritableDirectory;
        const projects: Project[] = [];

        for await (const [name, entry] of this.rootDir) {
            if (entry.kind !== 'directory')
                continue;
            const projectDir = await root.getDirectoryHandle(name);
            try {
                let project = await this.readJsonFileAs(projectDir, FileSystemEntryNames.projectMetadataFile, Project);
                projects.push(project);
            } catch (error) {
                if (error instanceof DOMException && error.name === 'NotFoundError') continue;
                throw error;
            }
        }

        return projects.sort(
            (a, b) => a.projectName.localeCompare(b.projectName, undefined, {sensitivity: 'base'})
        );
    }

    private getPageNumberFromDirectoryName(projectId: string, directoryName: string): number | null {
        const pagePrefix = `${projectId}.page-`;
        if (!directoryName.startsWith(pagePrefix))
            return null;

        const numberText = directoryName.slice(pagePrefix.length);
        if (!/^[1-9]\d*$/.test(numberText))
            return null;

        const pageNumber = Number(numberText);
        return Number.isSafeInteger(pageNumber) ? pageNumber : null;
    }

    private async loadSubdivisions(directory: FileSystemDirectoryHandle): Promise<SubdivisionsMetadata> {
        let file: FileSystemFileHandle;
        try {
            file = await directory.getFileHandle(FileSystemEntryNames.subdivisionsMetadataFile);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'NotFoundError') return new SubdivisionsMetadata();
            throw error;
        }
        try {
            return deserialize(await (await file.getFile()).text(), SubdivisionsMetadata);
        } catch (error) {
            throw new Error(`Unable to load subdivisions in folder ${directory.name}.`, {cause: error});
        }
    }

    async loadPages(projectId: string): Promise<StoredScorePage[]> {
        let projectDir = await this.rootDir.getDirectoryHandle(projectId);
        const pages: StoredScorePage[] = [];

        for await (const [name, entry] of projectDir) {
            if (entry.kind !== 'directory')
                continue;

            const pageNumber = this.getPageNumberFromDirectoryName(projectId, name);
            if (pageNumber === null)
                continue;

            const pageDir = await projectDir.getDirectoryHandle(name);
            const blob = await this.readFileAsBlob(pageDir, FileSystemEntryNames.pageImageFile);
            const metadata = await this.readPageMetadata(pageDir);
            const subdivisions = await this.loadSubdivisions(pageDir);
            pages.push({projectId, number: pageNumber, blob, metadata, subdivisions});
        }
        return pages.sort((a, b) => a.number - b.number);
    }

    async loadStaffImage(projectId: string, pageNumber: number, order: number): Promise<Blob> {
        try {
            const projectDir = await this.rootDir.getDirectoryHandle(projectId);
            const pageDir = await projectDir.getDirectoryHandle(FileSystemEntryNames.getPageDirName(projectId, pageNumber));
            const stavesDir = await pageDir.getDirectoryHandle(FileSystemEntryNames.stavesDirectory);
            const staffDir = await stavesDir.getDirectoryHandle(String(order));
            return await this.readFileAsBlob(staffDir, FileSystemEntryNames.pageImageFile);
        } catch (error) {
            throw new Error(`Unable to load saved staff ${order} on page ${pageNumber}. Save the project before exporting.`, {cause: error});
        }
    }

    async deleteProject(projectId: string): Promise<void> {
        await this.rootDir.removeEntry(projectId, {recursive: true});
    }
}
