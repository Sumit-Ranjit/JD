document.addEventListener("DOMContentLoaded", () => {
    const dbName = "user_data_db";
    const storeName = "user_data_store";
    const dataUrl = "./Data.json"; // Path to your Data.json file

    // Open IndexedDB
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        // Create an object store if it doesn't exist
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'Mobile_Number' });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        fetch(dataUrl)
            .then(response => response.json()) // Get JSON data from Data.json
            .then(data => {
                // Insert each record into IndexedDB
                data.forEach(record => {
                    store.put(record); // Put the record into the object store
                });
                console.log("Data successfully loaded into IndexedDB.");
            })
            .catch((error) => {
                console.error("Error loading Data.json:", error);
            });

        transaction.oncomplete = function () {
            console.log("Transaction completed and data inserted into IndexedDB.");
        };

        transaction.onerror = function (event) {
            console.error("Transaction failed:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
});
