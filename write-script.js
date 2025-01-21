let data = [];
let mobileNumberRecords = [];
let selectedMobileNumber = "";

// Elements
const readSection = document.getElementById("readSection");
const writeSection = document.querySelector(".write-section");
const mobileNumberSpan = document.getElementById("mobileNumber");
const nameSpan = document.getElementById("name");
const emailSpan = document.getElementById("email");
const readTable = document.getElementById("readTable").getElementsByTagName("tbody")[0];
const saveButton = document.getElementById("saveButton");
const updateDataButton = document.getElementById("updateDataButton");

// Utility: Convert Excel Date to ISO
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Utility: Show Read Section
function showReadSection() {
    readSection.style.display = "block";
    writeSection.style.display = "block";
    updateDataButton.style.display = "block";
}

// Fetch Data.json from Repository
async function loadDataFromRepo() {
    try {
        const response = await fetch('./Data.json'); // Assumes Data.json is in the same directory as the HTML file
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        data = await response.json();

        if (!data || data.length === 0) {
            alert("No data found in the file!");
            return;
        }

        // Select the first mobile number for filtering
        selectedMobileNumber = data[0]?.Mobile_Number;
        if (!selectedMobileNumber) {
            alert("No valid mobile number found in the data!");
            return;
        }

        mobileNumberRecords = data.filter(record => record.Mobile_Number === selectedMobileNumber);

        // Populate the basic details
        mobileNumberSpan.textContent = selectedMobileNumber;
        nameSpan.textContent = data[0]?.Name || "N/A";
        emailSpan.textContent = data[0]?.Email || "N/A";

        // Populate the table
        readTable.innerHTML = ""; // Clear the table first
        mobileNumberRecords.forEach(record => {
            const row = readTable.insertRow();
            row.insertCell(0).textContent = record["Sr No"];
            row.insertCell(1).textContent = convertExcelDate(record["Time_of_Entry"]);
            row.insertCell(2).textContent = record["Hotel"];
            row.insertCell(3).textContent = record["Area"];
            row.insertCell(4).textContent = record["City"];
            row.insertCell(5).textContent = record["State"];
            row.insertCell(6).textContent = record["Requirement Mentioned"];
            row.insertCell(7).textContent = record["Search Time"];
        });

        showReadSection();
        console.log("Data loaded successfully.");
    } catch (error) {
        console.error("Error loading Data.json from repository:", error);
        alert("Failed to load the data from the repository. Please check the console for details.");
    }
}

// Save to Write-Record.json
document.getElementById("updateDataButton").addEventListener("click", async () => {
    try {
        // Fetch Data.json
        const response = await fetch("./Data.json");
        const data = await response.json();

        // Get form data
        const formData = getWriteFormData(); // Function to get data from write form

        if (!formData) {
            alert("Please fill in all required fields.");
            return;
        }

        // Find all entries with the current mobile number
        const mobileNumber = document.getElementById("mobileNumber").innerText.trim();
        const matchingRecords = data.filter(record => record.Mobile_Number === mobileNumber);

        if (matchingRecords.length === 0) {
            alert("No records found for the current mobile number.");
            return;
        }

        // Remove matching records from Data.json
        const updatedData = data.filter(record => record.Mobile_Number !== mobileNumber);

        // Add matching records to form data and write to Write-Record.json
        matchingRecords.forEach(record => {
            formData["Sr No"] = record["Sr No"];
            formData["Time_of_Entry"] = record["Time_of_Entry"];
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

// Automatically load the data from the repository when the page loads
window.addEventListener("DOMContentLoaded", loadDataFromRepo);
