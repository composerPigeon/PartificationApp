import type {StorageService} from "../storage/StorageService.ts";
import {getRootDirectoryOfOriginPrivateFileSystem} from "../storage/fileSystem/storageHelpers.ts";
import {FileSystemStorageService} from "../storage/fileSystem/FileSystemStorageService.ts";

export const browserStorage: StorageService = new FileSystemStorageService(
    await getRootDirectoryOfOriginPrivateFileSystem()
);
