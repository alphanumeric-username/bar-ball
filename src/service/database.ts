import BarDiminishEvent from "../scene/game-scene/event/events/bar-diminish-event";

const DB_NAME = 'com.alphanumeric_username.bar_ball.db';
const DB_VERSION = 1;

var db: IDBDatabase = null;

interface StoreConfig {
    name: string,
    storeParams?: IDBObjectStoreParameters,
    indexes?: {
        name: string,
        keyPath: string,
        options?: IDBIndexParameters
    }[]
}

function openDatabase(stores: StoreConfig[]): Promise<void> {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    const promise = new Promise<void>((resolve, reject) => {
        request.onerror = (e) => {
            console.error('Database error:', e);
            reject();
        }
        request.onsuccess = () => {
            db = db == null ? request.result : db;
            resolve()
        };
        request.onupgradeneeded = (e) => {
            db = (e.target as any).result as IDBDatabase;
            stores.forEach(store => {
                const objStore = db.createObjectStore(store.name, store.storeParams)
                if (store.indexes) {
                    store.indexes.forEach(idx => {
                        objStore.createIndex(idx.name, idx.keyPath, idx.options);
                    });
                }
            });
        }
    });

    return promise;
}

function read<T>(store: string, key: any): Promise<T> {
    const promise = new Promise<T>((resolve, reject) => {
        const objStore = db.transaction(store, 'readonly').objectStore(store);
        const req = objStore.get(key);
        const successCallback = () => {
            resolve(req.result);
        };

        const errorCallback = () => {
            reject();
        }
        req.addEventListener('success', successCallback);
        req.addEventListener('error', errorCallback);
    });
    
    return promise;
}

function readAll<T>(store:string): Promise<T[]> {
    const promise = new Promise<T[]>((resolve, reject) => {
        const objStore = db.transaction(store, 'readonly').objectStore(store);
        const req = objStore.getAll();

        const successCallback = () => {
            resolve(req.result);
        };

        const errorCallback = () => {
            reject();
        }

        req.addEventListener('success', successCallback);
        req.addEventListener('error', errorCallback);

    });

    return promise;
}

function write(store: string, data: any): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
        const objStore = db.transaction(store, 'readwrite').objectStore(store);
        const req = objStore.put(data);
        const successCallback = () => {
            resolve();
        };

        const errorCallback = () => {
            reject();
        }
        req.addEventListener('success', successCallback);
        req.addEventListener('error', errorCallback);
    });
    return promise;
}

function writeAll(store: string, data: any[]): Promise<void[]> {
    const promises: Promise<void>[] = [];

    data.forEach(d => {
        const promise = write(store, d);
        promises.push(promise);
    })

    return Promise.all(promises);
}

function remove(store: string, key: any): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
        const objStore = db.transaction(store, 'readwrite').objectStore(store);

        const req = objStore.delete(key);

        const successCallback = () => {
            resolve();
        };

        const errorCallback = () => {
            reject();
        }
        req.addEventListener('success', successCallback);
        req.addEventListener('error', errorCallback);
        
    });

    return promise;
}

function removeAll(store: string, keys: any[]): Promise<void[]> {
    const promises: Promise<void>[] = [];

    keys.forEach(k => {
        const promise = remove(store, k);
        promises.push(promise);
    })

    return Promise.all(promises);
}

export {
    StoreConfig,
    openDatabase,
    read,
    readAll,
    write,
    writeAll,
    remove,
    removeAll
};