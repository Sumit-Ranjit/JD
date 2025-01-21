document.addEventListener("DOMContentLoaded", () => {
    // Function to read data from IndexedDB and display records
    function readDataAndDisplay() {
        const dbName = "user_data_db";
        const storeName = "user_data_store";
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = function (event) {
            const db = event.target.result;

            // Get the first record to determine the current mobile number
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);

            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = function (event) {
                const data = event.target.result;

                if (data.length === 0) {
                    alert("No records found in the database.");
                    return;
                }

                // Assume the first record determines the current mobile number
                const currentMobileNumber = data[0].Mobile_Number;

                // Filter records by this mobile number
                const filteredRecords = data.filter(
                    (record) => record.Mobile_Number === currentMobileNumber
                );

                if (filteredRecords.length > 0) {
                    // Populate Basic Info
                    const firstRecord = filteredRecords[0];
                    mobileNumberField.textContent = firstRecord.Mobile_Number || "N/A";
                    nameField.textContent = firstRecord.Name || "N/A";
                    emailField.textContent = firstRecord.Email || "N/A";

                    // Populate Table
                    tableBody.innerHTML = ""; // Clear previous rows
                    filteredRecords.forEach((record) => {
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
                } else {
                    console.warn("No records found for the current mobile number.");
                    tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
                }
            };

            getAllRequest.onerror = function () {
                console.error("Error retrieving records from IndexedDB.");
            };
        };

        request.onerror = function (event) {
            console.error("Error opening IndexedDB:", event.target.error);
        };
    }

    // Call the function to read data and display records
    readDataAndDisplay();
    const mobileNumberField = document.getElementById("mobileNumber");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const tableBody = document.querySelector("#data-table tbody");

    // Ensure required elements exist
    if (!mobileNumberField || !nameField || !emailField || !tableBody) {
        console.error("HTML elements with required IDs are missing.");
        return;
    }

    // Open IndexedDB
    const dbName = "user_data_db";
    const storeName = "user_data_store";
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Get the first record to determine the current mobile number
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;

            if (data.length === 0) {
                alert("No records found in the database.");
                return;
            }

            // Assume the first record determines the current mobile number
            const currentMobileNumber = data[0].Mobile_Number;

            // Filter records by this mobile number
            const filteredRecords = data.filter(
                (record) => record.Mobile_Number === currentMobileNumber
            );

            if (filteredRecords.length > 0) {
                // Populate Basic Info
                const firstRecord = filteredRecords[0];
                mobileNumberField.textContent = firstRecord.Mobile_Number || "N/A";
                nameField.textContent = firstRecord.Name || "N/A";
                emailField.textContent = firstRecord.Email || "N/A";

                // Populate Table
                tableBody.innerHTML = ""; // Clear previous rows
                filteredRecords.forEach((record) => {
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
            } else {
                console.warn("No records found for the current mobile number.");
                tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
            }
        };

        getAllRequest.onerror = function () {
            console.error("Error retrieving records from IndexedDB.");
        };
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
});
