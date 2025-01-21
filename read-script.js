document.addEventListener("DOMContentLoaded", () => {
    fetch("./Data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        })
        .then((data) => {
            displayData(data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
});

function displayData(data) {
    const mobileNumber = data[0].Mobile_Number || "N/A";
    const name = data[0].Name || "N/A";
    const email = data[0].Email || "N/A";

    document.getElementById("mobile-number").textContent = mobileNumber;
    document.getElementById("name").textContent = name;
    document.getElementById("email").textContent = email;

    const tableBody = document.querySelector("#record-table tbody");
    tableBody.innerHTML = ""; // Clear any existing rows

    data.forEach((record) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record["Sr No"]}</td>
            <td>${convertExcelDate(record["Time_of_Entry"])}</td>
            <td>${record.Hotel}</td>
            <td>${record.Area}</td>
            <td>${record.City}</td>
            <td>${record.State}</td>
            <td>${record["Requirement Mentioned"]}</td>
            <td>${record["Search Time"]}</td>
        `;
        tableBody.appendChild(row);
    });
}

function convertExcelDate(excelDate) {
    const excelEpoch = new Date(1899, 11, 30).getTime();
    const milliseconds = (excelDate - 1) * 86400000; // Excel date to milliseconds
    return new Date(excelEpoch + milliseconds).toLocaleString();
}
