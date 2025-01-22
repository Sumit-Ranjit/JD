// Load.js

// Function to initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MyDatabase', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('DataStore', { keyPath: 'Mobile_Number' });
            objectStore.createIndex('Status', 'Status', { unique: false });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Function to load data from Data.json
async function loadData() {
    const response = await fetch('Data.json');
    const data = await response.json();
    const db = await initDB();

    const transaction = db.transaction(['DataStore'], 'readwrite');
    const objectStore = transaction.objectStore('DataStore');

    data.forEach(item => {
        objectStore.put(item);
    });

    transaction.oncomplete = () => {
        console.log('All data loaded into IndexedDB');
    };

    transaction.onerror = (event) => {
        console.error('Transaction error:', event.target.error);
    };
}

// Function to filter data by Mobile_Number
function filterByMobileNumber(mobileNumber) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MyDatabase', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['DataStore'], 'readonly');
            const objectStore = transaction.objectStore('DataStore');
            const getRequest = objectStore.get(mobileNumber);

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };

            getRequest.onerror = (event) => {
                reject(event.target.error);
            };
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Function to filter data by Status
function filterByStatus(status) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MyDatabase', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['DataStore'], 'readonly');
            const objectStore = transaction.objectStore('DataStore');
            const index = objectStore.index('Status');
            const getRequest = index.getAll(status);

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };

            getRequest.onerror = (event) => {
                reject(event.target.error);
            };
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Load data when the script is executed
loadData();