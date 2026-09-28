import type {StorageService} from "./StorageService.ts";
import {getRootDirectoryOfOriginPrivateFileSystem} from "./storageHelpers.ts";
import {FileSystemStorageService} from "./FileSystemStorageService.ts";

export const browserStorage: StorageService = new FileSystemStorageService(
    await getRootDirectoryOfOriginPrivateFileSystem()
)