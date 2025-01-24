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
        loadDuplicateRecords(db);
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    function loadDuplicateRecords(db) {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const records = [];

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                // Ensure Mobile_Number exists and is valid
                const mobileNumber = cursor.value.Mobile_Number || "N/A";
                if (mobileNumber !== "N/A") {
                    records.push(cursor.value);
                }
                cursor.continue();
            } else {
                // Process records for duplicates
                const duplicates = findDuplicates(records);
                if (duplicates.length > 0) {
                    console.log("Duplicate records found:", duplicates);
                    populateTable(duplicates);
                } else {
                    console.warn("No duplicate records found.");
                    tableBody.innerHTML = `<tr><td colspan="8">No duplicate records found</td></tr>`;
                }
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
        };
    }

    function findDuplicates(records) {
        const grouped = {};

        // Group records by Mobile_Number
        records.forEach((record) => {
            const mobileNumber = record.Mobile_Number;
            if (!grouped[mobileNumber]) {
                grouped[mobileNumber] = [];
            }
            grouped[mobileNumber].push(record);
        });

        // Filter groups where there are more than one record
        const duplicates = [];
        for (const mobileNumber in grouped) {
            if (grouped[mobileNumber].length > 1) {
                duplicates.push(...grouped[mobileNumber]);
            }
        }

        return duplicates;
    }

    function populateTable(records) {
        tableBody.innerHTML = ""; // Clear previous rows
        records.forEach((record) => {
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
