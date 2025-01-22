document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";

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
        loadFirstNotDoneRecord(db); // Call your function here
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    // Function to load the first record with Status: "Not Done"
    function loadFirstNotDoneRecord(db) {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const records = [];

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.Status === "Not Done") {
                    records.push(cursor.value);
                }
                cursor.continue();
            } else {
                if (records.length > 0) {
                    populateTableAndInfo(records);
                } else {
                    console.warn("No records found with Status: Not Done.");
                }
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
        };
    }

    // Populate Basic Info and Table
    function populateTableAndInfo(records) {
        const firstRecord = records[0];
        console.log("First Record:", firstRecord); // Debugging purpose
    }
});
