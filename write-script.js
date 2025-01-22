document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";

    // Function to update Data.json after IndexedDB is updated
    function updateDataJson() {
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const records = [];

            store.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;

                if (cursor) {
                    records.push(cursor.value);
                    cursor.continue();
                } else {
                    // All records collected, write to Data.json
                    console.log("Writing updated records to Data.json:", records);
                    saveToJsonFile(records);
                }
            };

            store.openCursor().onerror = function (event) {
                console.error("Error reading from IndexedDB:", event.target.error);
            };
        };

        request.onerror = function (event) {
            console.error("Error opening IndexedDB:", event.target.error);
        };
    }

    // Function to simulate saving data to Data.json (in-browser only)
    function saveToJsonFile(data) {
        localStorage.setItem("Data.json", JSON.stringify(data, null, 2)); // Save to localStorage
        console.log("Data.json updated in localStorage.");
        alert("Data.json has been successfully updated.");
    }

    // Add event listener to a button to trigger the update
    const updateButton = document.getElementById("submit-btn");
    if (updateButton) {
        updateButton.addEventListener("click", updateDataJson);
    } else {
        console.error("Update button with ID 'submit-btn' not found.");
    }
});
