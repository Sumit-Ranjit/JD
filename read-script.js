document.addEventListener("DOMContentLoaded", () => {
    function loadAndFilterData(currentMobileNumber) {
        fetch("Data.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load Data.json");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Loaded data:", data);

                // Filter records by mobile number
                const filteredRecords = data.filter(
                    (record) => record["Mobile_Number"] === currentMobileNumber
                );

                console.log("Filtered records:", filteredRecords);

                if (filteredRecords.length === 0) {
                    alert(`No records found for mobile number: ${currentMobileNumber}`);
                    return;
                }

                // Populate the header and table
                populateHeader(filteredRecords[0]);
                populateTable(filteredRecords);
            })
            .catch((error) => {
                console.error("Error loading or filtering data:", error);
            });
    }

    function populateHeader(record) {
        const mobileNumberElement = document.getElementById("mobile-number");
        const nameElement = document.getElementById("name");
        const emailElement = document.getElementById("email");

        if (!mobileNumberElement || !nameElement || !emailElement) {
            console.error("One or more header elements not found.");
            return;
        }

        mobileNumberElement.textContent = record["Mobile_Number"] || "N/A";
        nameElement.textContent = record["Name"] || "N/A";
        emailElement.textContent = record["Email"] || "N/A";
    }

    function populateTable(records) {
        const tableBody = document.getElementById("data-table-body");

        if (!tableBody) {
            console.error("Table body element not found.");
            return;
        }

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
                <td>${record["Sr_No"] || "N/A"}</td>
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

    function convertExcelDate(excelDate) {
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        return date.toLocaleString("en-GB", { timeZone: "Asia/Kolkata" });
    }

    const currentMobileNumber = "9082175513"; // Update with the actual mobile number
    loadAndFilterData(currentMobileNumber);
});
