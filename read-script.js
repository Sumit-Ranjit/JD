document.addEventListener("DOMContentLoaded", () => {
    const dbName = "user_data_db";
    const storeName = "user_data_store";

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        loadRecordsForCurrentMobileNumber(db);
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
});

function loadRecordsForCurrentMobileNumber(db) {
    const currentMobileNumber = localStorage.getItem("currentMobileNumber");
    if (!currentMobileNumber) {
        alert("No mobile number found to display records.");
        return;
    }

    const transaction = db.transaction("user_data_store", "readonly");
    const store = transaction.objectStore("user_data_store");
    const records = [];

    store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            if (cursor.value.Mobile_Number === currentMobileNumber) {
                records.push(cursor.value);
            }
            cursor.continue();
        } else {
            if (records.length > 0) {
                populateTableAndInfo(records);
            } else {
                console.warn("No records found for the specified mobile number.");
                document.querySelector("#data-table tbody").innerHTML =
                    "<tr><td colspan='8'>No records found</td></tr>";
            }
        }
    };
}

function populateTableAndInfo(records) {
    const tableBody = document.querySelector("#data-table tbody");
    const firstRecord = records[0];

    document.getElementById("mobileNumber").textContent = firstRecord.Mobile_Number || "N/A";
    document.getElementById("name").textContent = firstRecord.Name || "N/A";
    document.getElementById("email").textContent = firstRecord.Email || "N/A";

    tableBody.innerHTML = "";
    records.forEach((record, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record["Time_of_Entry"] || "N/A"}</td>
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