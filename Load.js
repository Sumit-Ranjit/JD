document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_store_data";
    const jsonFilePath = "./Data.json"; // Ensure Data.json is in the same folder as this script

    const request = indexedDB.open(dbName, 1);

    // Create the database schema
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        console.log("Setting up IndexedDB...");
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "Mobile_Number" }); // Use Mobile_Number as the key
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("IndexedDB opened successfully.");

        // Fetch and load data from Data.json
        fetch(jsonFilePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch Data.json: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Data.json loaded successfully:", data);

                const transaction = db.transaction(storeName, "readwrite");
                const store = transaction.objectStore(storeName);

                data.forEach((record, index) => {
                    if (record.Mobile_Number) {
                        store.put(record); // Add valid records to IndexedDB
                    } else {
                        console.warn("Skipping record with missing Mobile_Number:", record);
                    }
                });

                transaction.oncomplete = () => {
                    console.log("Data successfully added to IndexedDB.");
                };

                transaction.onerror = (event) => {
                    console.error("Error adding data to IndexedDB:", event.target.error);
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
