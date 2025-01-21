// Read Data.json and filter by mobile number
function loadAndFilterData(currentMobileNumber) {
    fetch("Data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load Data.json");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Loaded data:", data); // Debug: Log all data to ensure it's loaded correctly

            // Filter records by mobile number
            const filteredRecords = data.filter(
                (record) => record["Mobile_Number"] === currentMobileNumber
            );

            console.log("Filtered records:", filteredRecords); // Debug: Check the filtered data

            if (filteredRecords.length === 0) {
                alert(`No records found for mobile number: ${currentMobileNumber}`);
            }

            // Populate table with the filtered records
            populateTable(filteredRecords);
        })
        .catch((error) => {
            console.error("Error loading or filtering data:", error);
        });
}

// Populate the table with records
function populateTable(records) {
    const tableBody = document.getElementById("data-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    if (records.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="8">No records available for the selected mobile number.</td>`;
        tableBody.appendChild(row);
        return;
    }

    records.forEach((record) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record["Sr No"] || "N/A"}</td>
            <td>${convertExcelDate(record["Time_of_Entry"]) || "N/A"}</td>
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

// Convert Excel date to readable format
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }); // Format as DD/MM/YYYY HH:mm:ss
}

// Set the current mobile number (replace with dynamic value if needed)
const currentMobileNumber = "9082175513"; // Replace with the actual mobile number dynamically
loadAndFilterData(currentMobileNumber);
