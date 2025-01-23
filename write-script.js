document.addEventListener("DOMContentLoaded", () => {
    const dbName = "initDB";
    const storeName = "user_data_store";

    // Function to update Data.json after IndexedDB is updated
    function updateDataJson() {
        const request = indexedDB.open(dbName, 1);

        request.onsuccess = function (event) {
            const db = event.target.result;

            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const records = [];
            const mobileNumber = document.getElementById("mobileNumber").textContent;

            if (!mobileNumber || mobileNumber === "N/A") {
                alert("No mobile number found to update the record.");
                return;
            }

            store.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;

                if (cursor) {
                    records.push(cursor.value);
                    cursor.continue();
                } else {
                    console.log("Writing updated records to Data.json:", records);
                    saveToJsonFile(records);
                }
            };

            store.openCursor().onerror = function (event) {
                console.error("Error reading from IndexedDB:", event.target.error);
            };

            const getRequest = store.get(mobileNumber); // Assuming `Mobile_Number` is the key
            getRequest.onsuccess = function (event) {
                const record = event.target.result;

                if (record) {
                    // Update the record with new values from the form
                    record.Call_Connected = document.getElementById("call-connected").value;
                    record.Intent_of_Call = document.getElementById("intent-of-call").value;
                    record.Remarks_If_Others = document.getElementById("remarks-if-others").value;
                    record.Booking_ID = document.getElementById("booking-id").value;
                    record.Booking_Created = document.getElementById("booking-created").value;
                    record.Prepay_Collected = document.getElementById("prepay-collected").value;
                    record.Agent_Remarks = document.getElementById("agent-remarks").value;
                    record.Status = "Done";

                    // Save the updated record back to IndexedDB
                    const updateRequest = store.put(record);

                    updateRequest.onsuccess = function () {
                        console.log("Record updated successfully:", record);
                        alert("Record updated successfully.");
                        location.reload();
                    };

                    updateRequest.onerror = function (event) {
                        console.error("Error updating record:", event.target.error);
                        alert("Failed to update the record.");
                    };
                } else {
                    alert("Record not found in the database.");
                }
            };

            getRequest.onerror = function (event) {
                console.error("Error fetching record from IndexedDB:", event.target.error);
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
        updateButton.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default form submission
            updateDataJson();
        });
    } else {
        console.error("Update button with ID 'submit-btn' not found.");
    }
});
