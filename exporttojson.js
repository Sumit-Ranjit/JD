// Function to fetch all records from IndexedDB and save them to a JSON file
window.onload = function() {
    // Call the export function when the window loads
    exportIndexedDBToJSON();
};
function exportIndexedDBToJSON() {
    const dbName = "user_data_db";
    const storeName = "user_data_store";

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function (event) {
            const allRecords = event.target.result;

            if (allRecords.length === 0) {
                alert("No records found in IndexedDB to export.");
                return;
            }

            // Convert the records to JSON format
            const jsonString = JSON.stringify(allRecords, null, 2);

            // Create a downloadable file
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const a = document.createElement("a");
            a.href = url;
            a.download = "exported_data.json";
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log("IndexedDB data exported successfully.");
        };

        getAllRequest.onerror = function (event) {
            console.error("Error fetching data from IndexedDB:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
}
