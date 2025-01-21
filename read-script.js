// Function to load and filter data for the current mobile number
async function loadAndDisplayData() {
    const currentMobileNumber = localStorage.getItem('currentMobileNumber'); // Get mobile number dynamically
    if (!currentMobileNumber) {
        alert("No mobile number set. Please start processing from the first record.");
        return;
    }

    try {
        const response = await fetch('Data.json'); // Load data from Data.json
        const data = await response.json();

        // Filter records by current mobile number
        const filteredRecords = data.filter(record => record.Mobile_Number === currentMobileNumber);

        if (filteredRecords.length === 0) {
            alert(`No more records found for mobile number: ${currentMobileNumber}`);
            // Optionally clear the currentMobileNumber in localStorage
            localStorage.removeItem('currentMobileNumber');
            return;
        }

        // Populate basic info section
        const basicInfoDiv = document.getElementById('basic-info');
        const firstRecord = filteredRecords[0]; // Assuming at least one record exists
        basicInfoDiv.querySelector('#mobile-number').textContent = firstRecord.Mobile_Number || "N/A";
        basicInfoDiv.querySelector('#email').textContent = firstRecord.Email || "N/A";
        basicInfoDiv.querySelector('#name').textContent = firstRecord.Name || "N/A";

        // Populate table with all records for this mobile number
        const tableBody = document.getElementById('data-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        filteredRecords.forEach((record, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.Time_of_Entry || "N/A"}</td>
                <td>${record.Hotel || "N/A"}</td>
                <td>${record.Area || "N/A"}</td>
                <td>${record.City || "N/A"}</td>
                <td>${record.State || "N/A"}</td>
                <td>${record.Requirement_Mentioned || "N/A"}</td>
                <td>${record.Search_Time || "N/A"}</td>
            `;

            tableBody.appendChild(row);
        });

        console.log("Data loaded and displayed successfully.");
    } catch (error) {
        console.error("Error loading or filtering data:", error);
    }
}

// Function to set the next mobile number dynamically
async function setNextMobileNumber() {
    try {
        const response = await fetch('Data.json');
        const data = await response.json();

        // Find the next unprocessed mobile number
        const nextRecord = data.find(record => record.Mobile_Number !== localStorage.getItem('currentMobileNumber'));

        if (!nextRecord) {
            alert("No more mobile numbers to process.");
            localStorage.removeItem('currentMobileNumber'); // Clear current mobile number
            return;
        }

        // Update the current mobile number in localStorage
        localStorage.setItem('currentMobileNumber', nextRecord.Mobile_Number);
        loadAndDisplayData(); // Reload data for the new mobile number
    } catch (error) {
        console.error("Error setting next mobile number:", error);
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', loadAndDisplayData);

// Example usage: Call setNextMobileNumber() after submitting a record
