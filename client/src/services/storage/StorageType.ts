
const StorageType = {
    Browser: 0,
    LocalFileSystem: 1,
} as const;

type StorageType = typeof StorageType[keyof typeof StorageType];

export default StorageType
