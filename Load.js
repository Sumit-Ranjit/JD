document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";

    const request = indexedDB.open(dbName, 2); // Increment the version to trigger onupgradeneeded

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Create the object store if it doesn't already exist
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
            console.log(`Object store '${storeName}' created.`);
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Database opened successfully.");

        // Call your function to load records (if needed)
        loadFirstNotDoneRecord(db);
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    // Function to load the first record with Status: "Not Done"
    function loadFirstNotDoneRecord(db) {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.Status === "Not Done") {
                    console.log("Record found:", cursor.value);
                    return; // Stop further cursor iteration
                }
                cursor.continue();
            } else {
                console.log("No records found with Status: Not Done.");
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
        };
    }
});
