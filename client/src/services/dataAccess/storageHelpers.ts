/*
import StorageType from "./StorageType.ts";
import type {StorageService} from "./StorageService.ts";
import {browserStorage} from "./index.ts";
import type {Project} from "../../domain";
import type {IProjectManager} from "../projects/ProjectManager.ts";

type PickerWindow = Window & {
    showDirectoryPicker?: (options: {mode: 'readwrite'; id: string}) => Promise<FileSystemDirectoryHandle>;
};
*/


export class FileSystemEntryNames {
    static readonly musicorpusFile: string = 'musicorpus.json';
    static readonly pageImageFile: string = 'image.png';
    static readonly projectMetadataFile = 'partification-app-project.json';

    static getProjectId(projectName: string): string {
        return `partification-app.${projectName.toLowerCase()}`
    }

    static getPageDirName(projectId: string, pageNumber: number): string {
        return `${projectId}.page-${pageNumber}`;
    }
}

export function browserSupportsOriginPrivateFileSystem(): boolean {
    return typeof navigator !== 'undefined'
        && typeof navigator.storage?.getDirectory === 'function';
}

export async function getRootDirectoryOfOriginPrivateFileSystem(): Promise<FileSystemDirectoryHandle> {
    if (!browserSupportsOriginPrivateFileSystem()) {
        throw new Error('This browser does not support origin private file storage.');
    }
    return navigator.storage.getDirectory();
}

/*
function isFileName(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0 && value !== '.' && value !== '..'
        && !/[\\/\0]/.test(value);
}
*/

/*
function isProject(value: unknown, directoryName: string): value is Project {
    if (typeof value !== 'object' || value === null) return false;
    const project = value as Partial<Project>;
    return project.id === directoryName && isFileName(project.id)
        && (project.name === undefined || (typeof project.name === 'string' && project.name.trim().length > 0))
        && isFileName(project.pdfFileName) && Array.isArray(project.images)
        && project.images.length > 0
        && project.images.every((image: unknown, index: number) => {
            if (typeof image !== 'object' || image === null) return false;
            const page = image as Partial<ProjectPage>;
            return page.pageNumber === index + 1 && page.fileName === `page-${index + 1}.png`;
        });
}
*/