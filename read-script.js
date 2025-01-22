document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";
    const tableBody = document.querySelector("#data-table tbody");
    const mobileNumberField = document.getElementById("mobileNumber");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");

    if (!tableBody || !mobileNumberField || !nameField || !emailField) {
        console.error("HTML elements with required IDs are missing.");
        return;
    }

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Database opened successfully.");

        const lastMobileNumber = localStorage.getItem("currentMobileNumber");
        if (lastMobileNumber) {
            console.log(`Resuming from Mobile Number: ${lastMobileNumber}`);
            fetchAllMatchingRecords(lastMobileNumber, db);
        } else {
            console.log("No previous mobile number found. Starting fresh.");
            loadRecordsWithSameMobileNumber(db);
        }
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    function loadRecordsWithSameMobileNumber(db) {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        let referenceMobileNumber = null;

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                console.log("Processing record:", cursor.value);

                if (cursor.value.Status === "Not Done") {
                    referenceMobileNumber = cursor.value.Mobile_Number;

                    // Update the Status field to "Working"
                    cursor.value.Status = "Working";
                    const updateRequest = cursor.update(cursor.value);

                    updateRequest.onsuccess = function () {
                        console.log(`Status updated to "Working" for Mobile Number: ${referenceMobileNumber}`);
                        localStorage.setItem("currentMobileNumber", referenceMobileNumber); // Save to localStorage
                        populateBasicInfo(cursor.value);
                        fetchAllMatchingRecords(referenceMobileNumber, db);
                    };

                    updateRequest.onerror = function (event) {
                        console.error("Error updating record:", event.target.error);
                    };

                    return;
                }
                cursor.continue();
            } else {
                console.warn("No records found with Status: Not Done.");
                tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB for reference mobile number:", event.target.error);
        };
    }

    function fetchAllMatchingRecords(mobileNumber, db) {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const records = [];

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                if (cursor.value.Mobile_Number === mobileNumber) {
                    records.push(cursor.value);
                }
                cursor.continue();
            } else {
                if (records.length > 0) {
                    console.log("Matching records found:", records);
                    populateTable(records);
                } else {
                    console.warn("No records found for Mobile Number:", mobileNumber);
                    tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
                }
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB for matching records:", event.target.error);
        };
    }

    function populateBasicInfo(record) {
        mobileNumberField.textContent = record.Mobile_Number || "N/A";
        nameField.textContent = record.Name || "N/A";
        emailField.textContent = record.Email || "N/A";
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
                <td>${record["Requirement_Mentioned"] || "N/A"}</td>
                <td>${record["Search_Time"] || "N/A"}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});
