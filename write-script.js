document.addEventListener('DOMContentLoaded', async function () {
    // Load data from Data.json and display it
    try {
        const response = await fetch('Data.json');
        const data = await response.json();

        // Display Mobile Number, Name, and Email
        const mobileNumberEl = document.getElementById('mobileNumber');
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');

        if (data.length > 0) {
            const firstRecord = data[0];
            mobileNumberEl.innerText = firstRecord.Mobile_Number || 'N/A';
            nameEl.innerText = firstRecord.Name || 'N/A';
            emailEl.innerText = firstRecord.Email || 'N/A';

            // Populate the table with records of the same mobile number
            const tableContainer = document.getElementById('tableContainer');
            tableContainer.innerHTML = ''; // Clear previous data

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Time of Entry</th>
                        <th>Hotel</th>
                        <th>Area</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Requirement Mentioned</th>
                        <th>Search Time</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;

            const tbody = table.querySelector('tbody');

            // Filter records by the same mobile number
            const filteredRecords = data.filter(record => record.Mobile_Number === firstRecord.Mobile_Number);

            filteredRecords.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record["Sr No"]}</td>
                    <td>${convertExcelDateToJSDate(record["Time_of_Entry"])}</td>
                    <td>${record["Hotel"]}</td>
                    <td>${record["Area"]}</td>
                    <td>${record["City"]}</td>
                    <td>${record["State"]}</td>
                    <td>${record["Requirement Mentioned"]}</td>
                    <td>${record["Search Time"]}</td>
                `;
                tbody.appendChild(row);
            });

            tableContainer.appendChild(table);
        } else {
            alert("No data found in Data.json.");
        }
    } catch (error) {
        console.error("Error loading Data.json:", error);
    }
});

// Function to convert Excel datetime to readable format
function convertExcelDateToJSDate(excelDate) {
    if (!excelDate) return 'N/A';
    const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
    return jsDate.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }); // Format: DD/MM/YYYY HH:mm:ss
}

// Handle form submission for write section
document.getElementById("updateDataButton").addEventListener("click", async () => {
    try {
        const response = await fetch('./Data.json');
        const data = await response.json();

        // Get form data
        const formData = getWriteFormData(); // Function to get data from write form

        if (!formData) {
            alert("Please fill in all required fields.");
            return;
        }

        // Get the mobile number from the read section
        const mobileNumber = document.getElementById("mobileNumber").innerText.trim();

        // Find all entries with the current mobile number
        const matchingRecords = data.filter(record => record.Mobile_Number === mobileNumber);

        if (matchingRecords.length === 0) {
            alert("No records found for the current mobile number.");
            return;
        }

        // Remove matching records from Data.json
        const updatedData = data.filter(record => record.Mobile_Number !== mobileNumber);

        // Append the updated form data to Write-Record.json
        matchingRecords.forEach(record => {
            formData["Sr No"] = record["Sr No"];
            formData["Time of Entry"] = record["Time_of_Entry"];
            formData["Mobile_Number"] = record["Mobile_Number"];
            formData["Name"] = record["Name"];
            formData["Email"] = record["Email"];
            formData["Area"] = record["Area"];
            formData["Hotel"] = record["Hotel"];
            formData["City"] = record["City"];
            formData["State"] = record["State"];
            formData["Requirement Mentioned"] = record["Requirement Mentioned"];
            formData["Search Time"] = record["Search Time"];
        });

        // Save updated data back to Data.json
        await writeJSONFile("Data.json", updatedData);

        // Append new data to Write-Record.json
        const writeRecordData = await readJSONFile("Write-Record.json") || [];
        writeRecordData.push(...matchingRecords);
        await writeJSONFile("Write-Record.json", writeRecordData);

        alert("Data updated successfully.");
    } catch (error) {
        console.error("Error updating data:", error);
        alert("Failed to update data. Check the console for more details.");
    }
});

// Helper: Get data from the write form
function getWriteFormData() {
    const formData = {
        "Call Connected": document.getElementById("callConnected").value,
        "Intent of Call": document.getElementById("intentOfCall").value,
        "Remarks if Others": document.getElementById("remarksIfOthers").value,
        "Booking ID": document.getElementById("bookingId").value,
        "Booking Created or Not": document.getElementById("bookingCreated").value,
        "Check-In Date": document.getElementById("checkInDate").value,
        "Check-Out Date": document.getElementById("checkOutDate").value,
        "Number of Rooms": document.getElementById("noOfRooms").value,
        "Prepay Pitched": document.getElementById("prepayPitched").value,
        "Prepay Collected": document.getElementById("prepayCollected").value,
        "Reason for Non-Prepay": document.getElementById("reasonOfNonPrepay").value,
        "Agent Remarks": document.getElementById("agentRemarks").value,
        "Status": document.getElementById("status").value
    };

    // Validation
    for (const key in formData) {
        if (!formData[key] && key !== "Remarks if Others") {
            return null; // Missing required field
        }
    }

    if (formData["Intent of Call"] === "Others" && !formData["Remarks if Others"]) {
        alert("Remarks are required if 'Intent of Call' is 'Others'.");
        return null;
    }

    return formData;
}

// Helper: Write JSON to file
async function writeJSONFile(filename, jsonData) {
    const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON Files", accept: { "application/json": [".json"] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(jsonData, null, 2));
    await writable.close();
}

// Helper: Read JSON from file
async function readJSONFile(filename) {
    const handle = await window.showOpenFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON Files", accept: { "application/json": [".json"] } }]
    });
    const file = await handle[0].getFile();
    const contents = await file.text();
    return JSON.parse(contents);
}
