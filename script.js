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
            db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Fetch the data from Data.json
        fetch(dataUrl)
            .then((response) => response.json())
            .then((data) => {
                const transaction = db.transaction(storeName, "readwrite");
                const store = transaction.objectStore(storeName);

                // Add each record to the object store
                data.forEach((record) => {
                    store.put(record);
                });

                transaction.oncomplete = function () {
                    console.log("Data successfully loaded into IndexedDB.");
                };

                transaction.onerror = function (event) {
                    console.error("Transaction failed:", event.target.error);
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