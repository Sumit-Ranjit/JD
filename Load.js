document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";
    const dataUrl = "./Data.json"; // Path to your initial data file

    const tableBody = document.querySelector("#data-table tbody");
    const mobileNumberField = document.getElementById("mobileNumber");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");

    if (!tableBody || !mobileNumberField || !nameField || !emailField) {
        console.error("HTML elements with required IDs are missing.");
        return;
    }

    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
            console.log("Object store created:", storeName);

            // Populate database with initial data from Data.json
            fetch(dataUrl)
                .then((response) => response.json())
                .then((data) => {
                    const transaction = db.transaction(storeName, "readwrite");
                    const objectStore = transaction.objectStore(storeName);

                    data.forEach((record) => {
                        objectStore.add(record);
                    });

                    transaction.oncomplete = function () {
                        console.log("Initial data loaded into IndexedDB.");
                    };

                    transaction.onerror = function (event) {
                        console.error("Error loading initial data:", event.target.error);
                    };
                })
                .catch((error) => {
                    console.error("Error fetching initial data:", error);
                });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Database opened successfully.");

        // Check for existing data in the store
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        store.count().onsuccess = function (event) {
            if (event.target.result === 0) {
                console.warn("No data found in IndexedDB. Please ensure Data.json is loaded.");
            } else {
                console.log("Data exists in IndexedDB. Proceeding to fetch records.");
                startProcessingRecords(db);
            }
        };

        store.count().onerror = function (event) {
            console.error("Error checking data count:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };

    function startProcessingRecords(db) {
        const lastMobileNumber = localStorage.getItem("currentMobileNumber");

        if (lastMobileNumber) {
            console.log(`Resuming from Mobile Number: ${lastMobileNumber}`);
            fetchAllMatchingRecords(lastMobileNumber, db);
        } else {
            console.log("Starting fresh: Loading the first record.");
            loadFirstRecordWithNotDoneStatus(db);
        }
    }

    function loadFirstRecordWithNotDoneStatus(db) {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                if (cursor.value.Status === "Not Done") {
                    const mobileNumber = cursor.value.Mobile_Number;

                    // Update the record's Status to "Working"
                    cursor.value.Status = "Working";
                    const updateRequest = cursor.update(cursor.value);

                    updateRequest.onsuccess = function () {
                        console.log(`Status updated to "Working" for Mobile Number: ${mobileNumber}`);
                        localStorage.setItem("currentMobileNumber", mobileNumber); // Save the mobile number
                        populateBasicInfo(cursor.value);
                        fetchAllMatchingRecords(mobileNumber, db);
                    };

                    updateRequest.onerror = function (event) {
                        console.error("Error updating record:", event.target.error);
                    };

                    return; // Stop further processing
                }
                cursor.continue();
            } else {
                console.warn("No records found with Status: Not Done.");
                clearUI();
            }
        };

        store.openCursor().onerror = function (event) {
            console.error("Error querying IndexedDB:", event.target.error);
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
                    clearUI();
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

    function clearUI() {
        mobileNumberField.textContent = "N/A";
        nameField.textContent = "N/A";
        emailField.textContent = "N/A";
        tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
    }
});
