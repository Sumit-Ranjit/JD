document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_store_data";
    const jsonFilePath = "./Data.json"; // Path to the Data.json file

    // Open IndexedDB
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        console.log("Setting up IndexedDB...");

        // Create object store with 'Mobile_Number' as the keyPath
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("IndexedDB opened successfully.");

        // Load and parse the Data.json file
        fetch(jsonFilePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch Data.json: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Data.json loaded successfully:", data);

                // Store data in IndexedDB
                const transaction = db.transaction(storeName, "readwrite");
                const store = transaction.objectStore(storeName);

                // Add the data to the store
                store.put(data);

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
