const DB_NAME = 'com.alphanumeric-username.bar-ball.db';
const request = window.indexedDB.open(DB_NAME, 1);

var db: IDBDatabase;


function openDatabase() {
    request.onerror = (e) => {
        console.error('Database error:', e);
    }
    
    request.onupgradeneeded = (e) => {
        db = (e.target as any).result as IDBDatabase;
        db.createObjectStore('leaderboard', {
            autoIncrement: true,
            keyPath: 'id'
        });
        
        const createLeaderboardTransaction = db.transaction('leaderboard', 'readwrite');
        createLeaderboardTransaction.oncomplete = (e) => {
            const store = db.transaction('leaderboard', 'readwrite').objectStore('leaderboard');
            
        }
    }
}

function read<T>(store: string, key: any): Promise<T> {
    const promise = new Promise<T>((resolve, reject) => {
        const objStore = db.transaction(store, 'readonly').objectStore(store);
        objStore.get(key);
        const successCallback = (e) => {
            resolve();
            objStore.transaction.removeEventListener('complete', successCallback);
        };

        const errorCallback = () => {
            reject();
            objStore.transaction.removeEventListener('error', errorCallback);
        }
        objStore.transaction.addEventListener('complete', successCallback);
        objStore.transaction.addEventListener('error', errorCallback);
    });
    
    return promise;
}

function write(store: string, data: any): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
        const objStore = db.transaction(store, 'readwrite').objectStore(store);
        objStore.put(data);
        const successCallback = () => {
            resolve();
            objStore.transaction.removeEventListener('complete', successCallback);
        };

        const errorCallback = () => {
            reject();
            objStore.transaction.removeEventListener('error', errorCallback);
        }
        objStore.transaction.addEventListener('complete', successCallback);
        objStore.transaction.addEventListener('error', errorCallback);
    });
    return promise;
}

export {
    openDatabase,
    read,
    write
};