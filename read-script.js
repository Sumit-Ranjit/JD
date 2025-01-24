document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_store_data";

    const mobileNumberField = document.getElementById("mobileNumber");
    const emailField = document.getElementById("email");
    const nameField = document.getElementById("name");
    const tableBody = document.querySelector("#data-table tbody");

    if (!mobileNumberField || !emailField || !nameField || !tableBody) {
        console.error("HTML elements with required IDs are missing.");
        return;
    }

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Database opened successfully.");
        loadAllRecords(db);
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    function loadAllRecords(db) {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const records = [];

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                records.push(cursor.value); // Add each record to the array
                cursor.continue();
            } else {
                if (records.length > 0) {
                    console.log("Records found in IndexedDB:", records);
                    displayBasicInfo(records[0]); // Display info for the first record
                    populateTable(records); // Populate table with all records
                } else {
                    console.warn("No records found in IndexedDB.");
                    tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
                }
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
        };
    }

    function displayBasicInfo(record) {
        mobileNumberField.textContent = record.Mobile_Number || "N/A";
        emailField.textContent = record.Email || "N/A";
        nameField.textContent = record.Name || "N/A";
    }

    function populateTable(records) {
        tableBody.innerHTML = ""; // Clear previous rows
        records.forEach((record, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record["Sr_No"] || "N/A"}</td>
                <td>${record["Time_of_Entry"] || "N/A"}</td>
                <td>${record["Hotel"] || "N/A"}</td>
                <td>${record["Area"] || "N/A"}</td>
                <td>${record["City"] || "N/A"}</td>
                <td>${record["State"] || "N/A"}</td>
                <td>${record["Requirement Mentioned"] || "N/A"}</td>
                <td>${record["Search Time"] || "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});
