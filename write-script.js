let db;
const dbName = "RecordDatabase";
const storeName = "records";

// Open IndexedDB
const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;

    if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "Sr_No" }); // Using "Sr No" as the unique key
    }
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Database initialized successfully.");
    loadData(); // Automatically load data when the database is ready
};

request.onerror = (event) => {
    console.error("Database error:", event.target.errorCode);
};

// Load data from IndexedDB
function loadData() {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);

    const request = store.getAll();

    request.onsuccess = (event) => {
        const records = event.target.result;
        populateReadSection(records);
    };

    request.onerror = (event) => {
        console.error("Error fetching records:", event.target.error);
    };
}

// Populate Read Section
function populateReadSection(records) {
    // Display Mobile, Name, Email
    const firstRecord = records[0]; // Assuming records are grouped by Mobile Number
    if (firstRecord) {
        document.getElementById("mobileNumber").innerText = firstRecord["Mobile_Number"];
        document.getElementById("name").innerText = firstRecord["Name"];
        document.getElementById("email").innerText = firstRecord["Email"];
    }

    // Populate Table
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = ""; // Clear any existing rows

    records.forEach((record) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record["Sr No"]}</td>
            <td>${formatDateTime(record["Time_of_Entry"])}</td>
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

// Helper Function to Format Excel Date
function formatDateTime(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000); // Convert Excel serial date to JS Date
    return date.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "medium" });
}

// Update Data Functionality
document.getElementById("updateDataButton").addEventListener("click", () => {
    const updatedData = {
        "Call Connected": document.getElementById("callConnected").value,
        "Intent of Call": document.getElementById("intentOfCall").value,
        "Remarks if Others": document.getElementById("remarksIfOthers").value,
        "Booking ID": document.getElementById("bookingId").value,
        "Booking Created": document.getElementById("bookingCreated").value,
        "Check-In Date": document.getElementById("checkInDate").value,
        "Check-Out Date": document.getElementById("checkOutDate").value,
        "No of Rooms": document.getElementById("noOfRooms").value,
        "Prepay Pitched": document.getElementById("prepayPitched").value,
        "Prepay Collected": document.getElementById("prepayCollected").value,
        "Reason of Non-Prepay": document.getElementById("reasonOfNonPrepay").value,
        "Agent Remarks": document.getElementById("agentRemarks").value,
        "Status": document.getElementById("status").value,
    };

    writeUpdatedData(updatedData);
});

// Write Updated Data to IndexedDB
function writeUpdatedData(updatedData) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    // Get all records, update the necessary ones, and write back
    const request = store.getAll();

    request.onsuccess = (event) => {
        const records = event.target.result;

        const mobileNumber = document.getElementById("mobileNumber").innerText;

        // Filter records matching the current mobile number
        const updatedRecords = records.map((record) => {
            if (record["Mobile_Number"] === mobileNumber) {
                return { ...record, ...updatedData }; // Update matching records
            }
            return record;
        });

        // Add updated records back to the store
        updatedRecords.forEach((record) => {
            store.put(record); // Update record in the object store
        });

        console.log("Data updated successfully:", updatedRecords);
        alert("Data updated successfully!");
    };

    request.onerror = (event) => {
        console.error("Error updating records:", event.target.error);
    };
}

// Toggle Remarks Section for "Others" in Intent of Call
function toggleRemarksSection() {
    const intent = document.getElementById("intentOfCall").value;
    const remarksSection = document.getElementById("remarksSection");

    if (intent === "Others") {
        remarksSection.style.display = "block";
    } else {
        remarksSection.style.display = "none";
    }
}
