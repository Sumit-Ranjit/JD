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
saveButton.addEventListener("click", async () => {
    try {
        const updatedData = [...mobileNumberRecords];

        // Simulate writing to Write-Record.json
        console.log("Saving the following records to Write-Record.json:", updatedData);
        alert("Records saved successfully (simulated)!");
    } catch (error) {
        console.error("Error saving records:", error);
        alert("Failed to save the records. Please check the console for details.");
    }
});

// Update Data.json
updateDataButton.addEventListener("click", async () => {
    try {
        const remainingRecords = data.filter(record => record.Mobile_Number !== selectedMobileNumber);

        console.log("Updated Data.json contents (simulated):", remainingRecords);
        alert("Data.json updated successfully (simulated)!");
        location.reload();
    } catch (error) {
        console.error("Error updating Data.json:", error);
        alert("Failed to update Data.json. Please check the console for details.");
    }
});

// Automatically load the data from the repository when the page loads
window.addEventListener("DOMContentLoaded", loadDataFromRepo);
