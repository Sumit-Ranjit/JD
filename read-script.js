let currentIndex = 0; // Index to track the current record

// Function to load and display the first record (and next mobile number)
function loadNextRecord() {
    fetch("Data.json")
        .then(response => response.json())
        .then(data => {
            // Ensure there are records to process
            if (data.length === 0) {
                alert("No records found.");
                return;
            }

            // Get the first record
            const currentRecord = data[currentIndex];

            if (currentRecord) {
                populateHeader(currentRecord);
                populateTable([currentRecord]);

                // Save mobile number for next processing
                localStorage.setItem('currentMobileNumber', currentRecord["Mobile_Number"]);
            }
        })
        .catch(error => console.error('Error loading data:', error));
}

// Populate the basic info section with mobile number, name, and email
function populateHeader(record) {
    const basicInfoElement = document.getElementById('basic-info');
    basicInfoElement.innerHTML = `
        <strong>Mobile Number:</strong> ${record["Mobile_Number"]}<br>
        <strong>Name:</strong> ${record["Name"] || "N/A"}<br>
        <strong>Email:</strong> ${record["Email"] || "N/A"}<br>
    `;
}

// Populate the table with the record's details
function populateTable(records) {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record["Sr_No"]}</td>
            <td>${convertExcelDate(record["Time_of_Entry"])}</td>
            <td>${record["Hotel"] || "N/A"}</td>
            <td>${record["Area"] || "N/A"}</td>
            <td>${record["City"] || "N/A"}</td>
            <td>${record["State"] || "N/A"}</td>
            <td>${record["Requirement Mentioned"] || "N/A"}</td>
            <td>${record["Search Time"] || "N/A"}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Convert Excel date to readable date format
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" });
}

// Call the loadNextRecord function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadNextRecord();
});
