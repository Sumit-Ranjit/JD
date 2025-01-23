document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";
    const dataUrl = "./Data.json"; // Path to your Data.json file

    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
            console.log(`Object store '${storeName}' created.`);
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
       

        // Fetch data from Data.json and load into IndexedDB
        fetch(dataUrl)
            .then((response) => response.json())
            .then((data) => {
                const transaction = db.transaction(storeName, "readwrite");
                const store = transaction.objectStore(storeName);
                store.clear();

                data.forEach((record) => {
                    store.put(record); // Insert record
                });

                transaction.oncomplete = function () {
                    console.log("Data successfully loaded into IndexedDB.");
                };

                transaction.onerror = function (event) {
                    console.error("Error inserting data into IndexedDB:", event.target.error);
                };
            })
            .catch((error) => {
                console.error("Error loading Data.json:", error);
            });
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
});
