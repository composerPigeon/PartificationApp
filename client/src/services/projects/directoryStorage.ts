const databaseName = 'partification-settings';
const storeName = 'settings';

async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function storedDirectory(
    directory?: FileSystemDirectoryHandle,
): Promise<FileSystemDirectoryHandle | null> {
    const database = await openDatabase();
    try {
        return await new Promise((resolve, reject) => {
            const transaction = database.transaction(storeName, directory ? 'readwrite' : 'readonly');
            const store = transaction.objectStore(storeName);
            const request = directory
                ? store.put(directory, 'project-directory')
                : store.get('project-directory');
            transaction.oncomplete = () => resolve(directory ?? request.result ?? null);
            transaction.onabort = () => reject(transaction.error ?? new Error('Unable to remember the folder.'));
            transaction.onerror = () => reject(transaction.error);
        });
    } finally {
        database.close();
    }
}
