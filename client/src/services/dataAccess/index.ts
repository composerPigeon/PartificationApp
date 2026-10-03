import type {StorageService} from "../projects/StorageService.ts";
import {getRootDirectoryOfOriginPrivateFileSystem} from "../fileSystem/storageHelpers.ts";
import {FileSystemStorageService} from "../fileSystem/FileSystemStorageService.ts";

export const browserStorage: StorageService = new FileSystemStorageService(
    await getRootDirectoryOfOriginPrivateFileSystem()
)