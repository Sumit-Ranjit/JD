document.addEventListener("DOMContentLoaded", () => {
    const dataUrl = "./Data.json"; // Path to your Data.json file
    const mobileNumberField = document.getElementById("mobileNumber");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const tableBody = document.querySelector("#data-table tbody");

    if (!mobileNumberField || !nameField || !emailField || !tableBody) {
        console.error("HTML elements with required IDs are missing.");
        return;
    }

    const currentMobileNumber = localStorage.getItem('currentMobileNumber'); // Get current mobile number
    if (!currentMobileNumber) {
        alert("No mobile number found to display records.");
        return;
    }

    fetch(dataUrl)
        .then((response) => response.json())
        .then((data) => {
            // Filter records for the current mobile number
            const records = data.filter((entry) => entry.Mobile_Number === currentMobileNumber);

            if (records.length > 0) {
                // Populate Basic Info with the first matching record
                const firstRecord = records[0];
                mobileNumberField.textContent = firstRecord.Mobile_Number || "N/A";
                nameField.textContent = firstRecord.Name || "N/A";
                emailField.textContent = firstRecord.Email || "N/A";

                // Populate the table with all matching records
                tableBody.innerHTML = ""; // Clear previous rows
                records.forEach((record, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
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
            } else {
                console.warn("No records found for the specified mobile number.");
                tableBody.innerHTML = `<tr><td colspan="8">No records found</td></tr>`;
            }
        })
        .catch((error) => {
            console.error("Error loading or filtering data:", error);
            tableBody.innerHTML = `<tr><td colspan="8">Error loading data</td></tr>`;
        });

    // Convert Excel date to readable format
    function convertExcelDate(excelDate) {
        if (!excelDate) return null;
        const date = new Date((excelDate - 25569) * 86400 * 1000); // Convert Excel date to JS date
        return date.toLocaleString(); // Format date to local string
    }
});
