document.addEventListener("DOMContentLoaded", () => {
    const mobileNumberElement = document.getElementById("mobileNumber");
    const nameElement = document.getElementById("name");
    const emailElement = document.getElementById("email");
    const tableContainer = document.getElementById("tableContainer");
    const updateDataButton = document.getElementById("updateDataButton");

    // Load data from Data.json
    fetch('./Data.json')
        .then(response => response.json())
        .then(data => {
            // Display the first record (for simplicity)
            const firstRecord = data.find(record => record.Mobile_Number);
            if (firstRecord) {
                mobileNumberElement.textContent = firstRecord.Mobile_Number;
                nameElement.textContent = firstRecord.Name;
                emailElement.textContent = firstRecord.Email;

                // Filter records by Mobile_Number
                const filteredRecords = data.filter(
                    record => record.Mobile_Number === firstRecord.Mobile_Number
                );

                // Create table
                const table = document.createElement("table");
                const thead = document.createElement("thead");
                const tbody = document.createElement("tbody");

                // Define headers
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

                // Populate rows
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
                tableContainer.innerHTML = ""; // Clear previous content
                tableContainer.appendChild(table);
            }
        });

    // Update data
    updateDataButton.addEventListener("click", () => {
        // Gather write section data
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

        // Fetch data from Data.json
        fetch('./Data.json')
            .then(response => response.json())
            .then(data => {
                // Filter records to exclude current mobile number
                const mobileNumber = mobileNumberElement.textContent;
                const updatedRecords = data.filter(
                    record => record.Mobile_Number !== mobileNumber
                );

                // Add new record to Write-Record.json
                const writeRecords = data.filter(
                    record => record.Mobile_Number === mobileNumber
                ).map(record => ({
                    ...record,
                    ...writeData
                }));

                // Update Write-Record.json
                fetch('./Write-Record.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(writeRecords, null, 2)
                })
                    .then(() => {
                        console.log('Data written successfully to Write-Record.json');
                    })
                    .catch(err => console.error('Error writing to Write-Record.json:', err));

                // Update Data.json
                fetch('./Data.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedRecords, null, 2)
                })
                    .then(() => {
                        console.log('Data.json updated successfully.');
                        alert('Data updated successfully!');
                    })
                    .catch(err => console.error('Error updating Data.json:', err));
            });
    });

    // Show or hide "Remarks if Others"
    const intentOfCallElement = document.getElementById("intentOfCall");
    const remarksIfOthersElement = document.getElementById("remarksIfOthers");
    const remarksIfOthersLabel = document.getElementById("remarksIfOthersLabel");

    intentOfCallElement.addEventListener("change", () => {
        if (intentOfCallElement.value === "Others") {
            remarksIfOthersElement.style.display = "block";
            remarksIfOthersLabel.style.display = "block";
        } else {
            remarksIfOthersElement.style.display = "none";
            remarksIfOthersLabel.style.display = "none";
        }
    });
});
