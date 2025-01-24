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

    // Open IndexedDB
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("IndexedDB opened successfully.");

        // Fetch all records from the database
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const records = [];

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                records.push(cursor.value);
                cursor.continue();
            } else {
                if (records.length > 0) {
                    console.log("Records fetched successfully:", records);
                    populateFields(records[0]); // Populate basic info using the first record
                    populateTable(records); // Populate table with all records
                } else {
                    console.warn("No records found in the database.");
                    tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
                }
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    function populateFields(record) {
        // Display mobile number, email, and name from the first record
        mobileNumberField.textContent = record.Mobile_Number || "N/A";
        emailField.textContent = record.Email || "N/A";
        nameField.textContent = record.Name || "N/A";
    }

    function populateTable(records) {
        // Clear the table before populating
        tableBody.innerHTML = "";

        // Populate each record in the table
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
