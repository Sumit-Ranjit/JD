document.addEventListener("DOMContentLoaded", () => {
    const dbName = "RecordDB";
    const dataStoreName = "Records";
    const writeStoreName = "WriteRecords";

    let db;

    // Open or create the database
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.errorCode);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("Database opened successfully");
        loadInitialData();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains(dataStoreName)) {
            db.createObjectStore(dataStoreName, { keyPath: "Sr No" });
        }
        if (!db.objectStoreNames.contains(writeStoreName)) {
            db.createObjectStore(writeStoreName, { keyPath: "Sr No" });
        }
        console.log("Database setup complete");
    };

    // Load initial data into IndexedDB
    function loadInitialData() {
        fetch("./Data.json")
            .then(response => response.json())
            .then(data => {
                const transaction = db.transaction([dataStoreName], "readwrite");
                const store = transaction.objectStore(dataStoreName);

                data.forEach(record => {
                    store.put(record);
                });

                transaction.oncomplete = () => {
                    console.log("Data loaded into IndexedDB");
                    populateTable();
                };

                transaction.onerror = (event) => {
                    console.error("Error loading data into IndexedDB:", event.target.error);
                };
            });
    }

    // Populate table from IndexedDB
    function populateTable() {
        const transaction = db.transaction([dataStoreName], "readonly");
        const store = transaction.objectStore(dataStoreName);

        const request = store.getAll();

        request.onsuccess = (event) => {
            const records = event.target.result;
            const firstRecord = records.find(record => record.Mobile_Number);

            if (firstRecord) {
                document.getElementById("mobileNumber").textContent = firstRecord.Mobile_Number;
                document.getElementById("name").textContent = firstRecord.Name;
                document.getElementById("email").textContent = firstRecord.Email;

                const filteredRecords = records.filter(
                    record => record.Mobile_Number === firstRecord.Mobile_Number
                );

                const tableContainer = document.getElementById("tableContainer");
                const table = document.createElement("table");
                const thead = document.createElement("thead");
                const tbody = document.createElement("tbody");

                const headers = [
                    "Sr No",
                    "Time of Entry",
                    "Hotel",
                    "Area",
                    "City",
                    "State",
                    "Requirement Mentioned",
                    "Search Time"
                ];

                const headerRow = document.createElement("tr");
                headers.forEach(header => {
                    const th = document.createElement("th");
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);

                filteredRecords.forEach(record => {
                    const row = document.createElement("tr");
                    headers.forEach(key => {
                        const td = document.createElement("td");
                        td.textContent = record[key] || "";
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                tableContainer.innerHTML = "";
                tableContainer.appendChild(table);
            }
        };

        request.onerror = (event) => {
            console.error("Error reading from IndexedDB:", event.target.error);
        };
    }

    // Write updated data to IndexedDB and process batches for Power Automate
    document.getElementById("updateDataButton").addEventListener("click", () => {
        const writeData = {
            Call_Connected: document.getElementById("callConnected").value,
            Intent_of_Call: document.getElementById("intentOfCall").value,
            Remarks_if_Others: document.getElementById("remarksIfOthers").value,
            Booking_ID: document.getElementById("bookingId").value,
            Booking_Created: document.getElementById("bookingCreated").value,
            Check_In_Date: document.getElementById("checkInDate").value,
            Check_Out_Date: document.getElementById("checkOutDate").value,
            No_of_Rooms: document.getElementById("noOfRooms").value,
            Prepay_Pitched: document.getElementById("prepayPitched").value,
            Prepay_Collected: document.getElementById("prepayCollected").value,
            Reason_of_Non_Prepay: document.getElementById("reasonOfNonPrepay").value,
            Agent_Remarks: document.getElementById("agentRemarks").value,
            Status: document.getElementById("status").value
        };

        const mobileNumber = document.getElementById("mobileNumber").textContent;

        const transaction = db.transaction([dataStoreName, writeStoreName], "readwrite");
        const dataStore = transaction.objectStore(dataStoreName);
        const writeStore = transaction.objectStore(writeStoreName);

        const request = dataStore.getAll();

        request.onsuccess = (event) => {
            const records = event.target.result;

            const toWrite = records.filter(record => record.Mobile_Number === mobileNumber).map(record => ({
                ...record,
                ...writeData
            }));

            const remaining = records.filter(record => record.Mobile_Number !== mobileNumber);

            toWrite.forEach(record => writeStore.put(record));
            remaining.forEach(record => dataStore.put(record));

            transaction.oncomplete = () => {
                alert("Data updated successfully!");
                // Optionally send `toWrite` data to Power Automate in batches
            };

            transaction.onerror = (event) => {
                console.error("Error updating data:", event.target.error);
            };
        };
    });
});
