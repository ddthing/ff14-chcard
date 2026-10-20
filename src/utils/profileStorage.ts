const DATABASE_NAME = 'ff14-chcard-storage';
const OBJECT_STORE_NAME = 'values';

let databasePromise: Promise<IDBDatabase> | undefined;

function clearCachedDatabasePromise(promise: Promise<IDBDatabase>) {
    if (databasePromise === promise) databasePromise = undefined;
}

function openDatabaseWithVersion(version?: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        let request: IDBOpenDBRequest;
        try {
            request = version === undefined
                ? indexedDB.open(DATABASE_NAME)
                : indexedDB.open(DATABASE_NAME, version);
        } catch (error) {
            reject(error instanceof Error ? error : new Error('Could not open profile storage.'));
            return;
        }

        let settled = false;
        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                database.createObjectStore(OBJECT_STORE_NAME);
            }
        };
        request.onerror = () => fail(request.error ?? new Error('Could not open profile storage.'));
        request.onblocked = () => fail(new Error('Profile storage is blocked by another open tab.'));
        request.onsuccess = () => {
            const database = request.result;
            if (settled) {
                database.close();
                return;
            }

            if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                // Reuse a pre-existing database safely, adding our store at its next version.
                const nextVersion = database.version + 1;
                database.close();
                settled = true;
                void openDatabaseWithVersion(nextVersion).then(resolve, reject);
                return;
            }

            settled = true;
            resolve(database);
        };
    });
}

function openDatabase(): Promise<IDBDatabase> {
    if (databasePromise) return databasePromise;

    if (typeof indexedDB === 'undefined') {
        return Promise.reject(new Error('IndexedDB is unavailable in this environment.'));
    }

    const promise = openDatabaseWithVersion().then(database => {
        database.onversionchange = () => {
            database.close();
            clearCachedDatabasePromise(promise);
        };
        return database;
    });
    databasePromise = promise;
    void promise.catch(() => clearCachedDatabasePromise(promise));
    return promise;
}

/** Read a value from the shared IndexedDB key-value store. Missing keys return undefined. */
export async function readStoredValue<T>(key: string): Promise<T | undefined> {
    const database = await openDatabase();

    return new Promise<T | undefined>((resolve, reject) => {
        let value: T | undefined;
        let failure: Error | undefined;
        let settled = false;
        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };

        try {
            const transaction = database.transaction(OBJECT_STORE_NAME, 'readonly');
            const request = transaction.objectStore(OBJECT_STORE_NAME).get(key);
            request.onsuccess = () => { value = request.result as T | undefined; };
            request.onerror = () => { failure = request.error ?? new Error('Could not read profile storage.'); };
            transaction.onerror = () => {
                failure ??= transaction.error ?? new Error('Could not read profile storage.');
            };
            transaction.onabort = () => fail(failure ?? transaction.error ?? new Error('Profile storage read was aborted.'));
            transaction.oncomplete = () => {
                if (settled) return;
                if (failure) {
                    fail(failure);
                    return;
                }
                settled = true;
                resolve(value);
            };
        } catch (error) {
            fail(error instanceof Error ? error : new Error('Could not read profile storage.'));
        }
    });
}

/** Write a value and resolve only after IndexedDB confirms the transaction committed. */
export async function writeStoredValue<T>(key: string, value: T): Promise<void> {
    const database = await openDatabase();

    return new Promise<void>((resolve, reject) => {
        let failure: Error | undefined;
        let settled = false;
        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };

        try {
            const transaction = database.transaction(OBJECT_STORE_NAME, 'readwrite');
            transaction.objectStore(OBJECT_STORE_NAME).put(value, key);
            transaction.onerror = () => {
                failure ??= transaction.error ?? new Error('Could not save profile storage.');
            };
            transaction.onabort = () => fail(failure ?? transaction.error ?? new Error('Profile storage write was aborted.'));
            transaction.oncomplete = () => {
                if (settled) return;
                if (failure) {
                    fail(failure);
                    return;
                }
                settled = true;
                resolve();
            };
        } catch (error) {
            fail(error instanceof Error ? error : new Error('Could not save profile storage.'));
        }
    });
}
