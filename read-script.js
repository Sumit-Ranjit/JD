// Read Data.json and filter for current mobile number
function loadAndFilterData(currentMobileNumber) {
    fetch("Data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load Data.json");
            }
            return response.json();
        })
        .then((data) => {
            // Filter records by current mobile number
            const filteredRecords = data.filter(
                (record) => record["Mobile_Number"] === currentMobileNumber
            );

            // Update the table with filtered records
            populateTable(filteredRecords);
        })
        .catch((error) => {
            console.error("Error loading or filtering data:", error);
        });
}

// Function to populate the table
function populateTable(records) {
    const tableBody = document.getElementById("data-table-body");
    tableBody.innerHTML = ""; // Clear previous rows

    records.forEach((record) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record["Sr No"]}</td>
            <td>${convertExcelDate(record["Time_of_Entry"])}</td>
            <td>${record["Hotel"]}</td>
            <td>${record["Area"]}</td>
            <td>${record["City"]}</td>
            <td>${record["State"]}</td>
            <td>${record["Requirement Mentioned"]}</td>
            <td>${record["Search Time"]}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to convert Excel date format to DD/MM/YYYY HH:mm:ss
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000); // Convert to JavaScript date
    return date.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }); // Format as DD/MM/YYYY HH:mm:ss
}

// Call the function with the mobile number of the current record
const currentMobileNumber = "9082175513"; // Replace with dynamic mobile number if necessary
loadAndFilterData(currentMobileNumber);
