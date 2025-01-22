document.addEventListener("DOMContentLoaded", () => {
    const mobileNumberField = document.getElementById("mobileNumber");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const tableBody = document.querySelector("#data-table tbody");

    // Ensure required elements exist
    if (!mobileNumberField || !nameField || !emailField || !tableBody) {
        console.error("HTML elements with required IDs are missing.");
        return;
    }

    // Open the initDB database
    const dbName = "initDB";
    const storeName = "user_data_store";
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        loadRecordsForCurrentMobileNumber(db);
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    // Function to load records for the current mobile number
    function loadRecordsForCurrentMobileNumber(db) {
        const currentMobileNumber = localStorage.getItem("currentMobileNumber"); // Assuming mobile number is set here
        if (!currentMobileNumber) {
            alert("No mobile number found to display records.");
            return;
        }

        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const records = [];

        // Use openCursor to fetch all records matching the current mobile number
        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.Mobile_Number === currentMobileNumber) {
                    records.push(cursor.value);
                }
                cursor.continue(); // Continue to the next record
            } else {
                // All matching records have been collected
                if (records.length > 0) {
                    populateTableAndInfo(records);
                } else {
                    console.warn("No records found for the current mobile number.");
                    tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
                }
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
        };
    }

    // Function to populate table and basic info
    function populateTableAndInfo(records) {
        // Populate Basic Info using the first record
        const firstRecord = records[0];
        mobileNumberField.textContent = firstRecord.Mobile_Number || "N/A";
        nameField.textContent = firstRecord.Name || "N/A";
        emailField.textContent = firstRecord.Email || "N/A";

        // Populate the table with all matching records
        tableBody.innerHTML = ""; // Clear previous rows
        records.forEach((record, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record["Time_of_Entry"] || "N/A"}</td>
                <td>${record["Hotel"] || "N/A"}</td>
                <td>${record["Area"] || "N/A"}</td>
                <td>${record["City"] || "N/A"}</td>
                <td>${record["State"] || "N/A"}</td>
                <td>${record["Requirement_Mentioned"] || "N/A"}</td>
                <td>${record["Search_Time"] || "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});
