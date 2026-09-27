import type {Project, ProjectImage} from '../../domain/Project.ts';
import {storedDirectory} from './directoryStorage.ts';

type WritableDirectory = FileSystemDirectoryHandle & {
    queryPermission(options: {mode: 'readwrite'}): Promise<PermissionState>;
    requestPermission(options: {mode: 'readwrite'}): Promise<PermissionState>;
    values(): AsyncIterableIterator<FileSystemHandle>;
};
type PickerWindow = Window & {
    showDirectoryPicker?: (options: {mode: 'readwrite'; id: string}) => Promise<FileSystemDirectoryHandle>;
};
export interface DirectoryState {
    name: string;
    granted: boolean;
}
export interface IProjectManager {
    setRoot(directory: FileSystemDirectoryHandle): void;
    supportsDirectoryPicker(): boolean;
    selectDirectory(): Promise<void>;
    restoreDirectory(): Promise<DirectoryState | null>;
    getDirectoryState(): Promise<DirectoryState | null>;
    requestDirectoryAccess(): Promise<void>;
    createProject(name: string, pdf: File, pages: AsyncIterable<Blob>): Promise<Project>;
    loadProjects(): Promise<Project[]>;
    loadProject(projectId: string): Promise<Project>;
    loadPage(projectId: string, image: ProjectImage): Promise<Blob>;
}

function isFileName(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0 && value !== '.' && value !== '..'
        && !/[\\/\0]/.test(value);
}

function isProject(value: unknown, directoryName: string): value is Project {
    if (typeof value !== 'object' || value === null) return false;
    const project = value as Partial<Project>;
    return project.id === directoryName && isFileName(project.id)
        && (project.name === undefined || (typeof project.name === 'string' && project.name.trim().length > 0))
        && isFileName(project.pdfFileName) && Array.isArray(project.images)
        && project.images.length > 0
        && project.images.every((image: unknown, index: number) => {
            if (typeof image !== 'object' || image === null) return false;
            const page = image as Partial<ProjectImage>;
            return page.pageNumber === index + 1 && page.fileName === `page-${index + 1}.png`;
        });
}

export class ProjectManager implements IProjectManager {
    private root: FileSystemDirectoryHandle | null = null;

    setRoot(directory: FileSystemDirectoryHandle): void {
        this.root = directory;
    }

    private getRoot(): FileSystemDirectoryHandle {
        if (!this.root) throw new Error('Select a project folder first.');
        return this.root;
    }

    supportsDirectoryPicker(): boolean {
        return typeof (window as PickerWindow).showDirectoryPicker === 'function';
    }

    async selectDirectory(): Promise<void> {
        const picker = window as PickerWindow;
        if (!picker.showDirectoryPicker) throw new Error('This browser does not support folder selection.');
        this.root = await picker.showDirectoryPicker({mode: 'readwrite', id: 'project-directory'});
        await storedDirectory(this.root);
    }

    async restoreDirectory(): Promise<DirectoryState | null> {
        if (!this.root) this.root = await storedDirectory();
        return this.getDirectoryState();
    }

    async getDirectoryState(): Promise<DirectoryState | null> {
        if (!this.root) return null;
        return {
            name: this.root.name,
            granted: await (this.root as WritableDirectory).queryPermission({mode: 'readwrite'}) === 'granted',
        };
    }

    async requestDirectoryAccess(): Promise<void> {
        const permission = await (this.getRoot() as WritableDirectory).requestPermission({mode: 'readwrite'});
        if (permission !== 'granted') throw new Error('Folder access was not granted. Try again or choose another folder.');
    }

    private async writeFile(directory: FileSystemDirectoryHandle, name: string, data: Blob | string): Promise<void> {
        const file = await directory.getFileHandle(name, {create: true});
        const writer = await file.createWritable();
        try {
            await writer.write(data);
            await writer.close();
        } catch (error) {
            await writer.abort().catch(() => undefined);
            throw error;
        }
    }

    // Pages must already be converted to PNG, in PDF page order.
    async createProject(name: string, pdf: File, pages: AsyncIterable<Blob>): Promise<Project> {
        const root = this.getRoot();
        name = name.trim();
        if (!name || name.length > 120) throw new Error('Provide a project name of 1–120 characters.');
        const pdfFileName = pdf.name;
        if (!isFileName(pdfFileName) || !pdfFileName.toLowerCase().endsWith('.pdf')) {
            throw new Error('Provide a PDF filename.');
        }
        const slug = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '')
            .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 32);
        const id = `${slug(name) || 'project'}-${slug(pdfFileName.replace(/\.pdf$/i, '')) || 'pdf'}-${crypto.randomUUID()}`;
        const directory = await root.getDirectoryHandle(id, {create: true});
        const project: Project = {id, name, pdfFileName, images: []};
        try {
            await this.writeFile(directory, 'source.pdf', pdf);
            for await (const png of pages) {
                if (png.type !== 'image/png') throw new Error('Provide PNG pages.');
                const pageNumber = project.images.length + 1;
                const fileName = `page-${pageNumber}.png`;
                await this.writeFile(directory, fileName, png);
                project.images.push({pageNumber, fileName});
            }
            if (!project.images.length) throw new Error('The PDF contains no pages.');
            // Publish metadata only after every page has been written.
            await this.writeFile(directory, 'project.json', JSON.stringify(project, null, 2));
            return project;
        } catch (error) {
            try {
                await root.removeEntry(id, {recursive: true});
            } catch {
                throw new Error(`Unable to save project; incomplete files remain in folder ${id}.`, {cause: error});
            }
            throw error;
        }
    }

    private async readProject(metadata: FileSystemFileHandle, projectId: string): Promise<Project> {
        let project: unknown;
        try {
            project = JSON.parse(await (await metadata.getFile()).text());
        } catch (error) {
            throw new Error(`Unable to read project metadata in folder ${projectId}.`, {cause: error});
        }
        if (!isProject(project, projectId)) throw new Error(`Invalid project metadata in folder ${projectId}.`);
        return {...project, name: project.name ?? project.pdfFileName.replace(/\.pdf$/i, '')};
    }

    async loadProject(projectId: string): Promise<Project> {
        if (!isFileName(projectId)) throw new Error('Invalid project reference.');
        try {
            const directory = await this.getRoot().getDirectoryHandle(projectId);
            return await this.readProject(await directory.getFileHandle('project.json'), projectId);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'NotFoundError') {
                throw new Error('This project was not found in the selected folder.', {cause: error});
            }
            throw error;
        }
    }

    async loadProjects(): Promise<Project[]> {
        const root = this.getRoot() as WritableDirectory;
        const projects: Project[] = [];
        for await (const entry of root.values()) {
            if (entry.kind !== 'directory') continue;
            const directory = await root.getDirectoryHandle(entry.name);
            let metadata: FileSystemFileHandle;
            try {
                metadata = await directory.getFileHandle('project.json');
            } catch (error) {
                if (error instanceof DOMException && error.name === 'NotFoundError') continue;
                throw error;
            }
            projects.push(await this.readProject(metadata, entry.name));
        }
        return projects.sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}) || a.id.localeCompare(b.id));
    }

    async loadPage(projectId: string, image: ProjectImage): Promise<Blob> {
        if (!isFileName(projectId) || !Number.isInteger(image.pageNumber) || image.pageNumber < 1
            || image.fileName !== `page-${image.pageNumber}.png`) {
            throw new Error('Invalid project page reference.');
        }
        const directory = await this.getRoot().getDirectoryHandle(projectId);
        const file = await directory.getFileHandle(image.fileName);
        return file.getFile();
    }
}
