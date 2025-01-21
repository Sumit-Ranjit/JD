// IndexedDB setup for storing locally
const dbName = "RecordManagementDB";
const storeName = "Records";

// Open IndexedDB
const dbPromise = indexedDB.open(dbName, 1);

// Handle database setup
dbPromise.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        store.createIndex("mobileNumber", "mobileNumber", { unique: false });
    }
};

dbPromise.onerror = (event) => {
    console.error("Error opening IndexedDB:", event.target.error);
};

dbPromise.onsuccess = () => {
    console.log("IndexedDB setup complete.");
};

// Function to save data into IndexedDB
function saveDataToDB(data) {
    const dbRequest = indexedDB.open(dbName);

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        // Add data to the store
        store.add(data);

        transaction.oncomplete = () => {
            console.log("Data saved successfully.");
            alert("Data saved locally.");
        };

        transaction.onerror = (event) => {
            console.error("Error saving data:", event.target.error);
        };
    };
}

// Collect data from the form
function collectFormData() {
    const callConnected = document.getElementById("call-connected").value;
    const intentOfCall = document.getElementById("intent-of-call").value;
    const remarksIfOthers =
        intentOfCall === "Others" ? document.getElementById("remarks-if-others").value : null;
    const bookingId = document.getElementById("booking-id").value;
    const bookingDone = document.getElementById("booking-done").value;
    const prepayCollected = document.getElementById("prepay-collected").value;
    const reasonNonPrepay = document.getElementById("reason-non-prepay").value;
    const agentRemarks = document.getElementById("agent-remarks").value;
    const status = document.getElementById("status").value;

    // Sample metadata (can be extended as needed)
    const mobileNumber = document.getElementById("mobile-number").textContent;

    return {
        mobileNumber,
        CallConnected: callConnected,
        IntentOfCall: intentOfCall,
        RemarksIfOthers: remarksIfOthers,
        BookingID: bookingId,
        BookingDone: bookingDone,
        PrepayCollected: prepayCollected,
        ReasonNonPrepay: reasonNonPrepay,
        AgentRemarks: agentRemarks,
        Status: status,
    };
}

// Handle form submission
document.getElementById("save-button").addEventListener("click", () => {
    const data = collectFormData();

    if (!data.mobileNumber) {
        alert("No mobile number associated with the record!");
        return;
    }

    saveDataToDB(data);
});

// Show/hide Remarks if Intent of Call is Others
document.getElementById("intent-of-call").addEventListener("change", (event) => {
    const remarksSection = document.getElementById("remarks-section");
    if (event.target.value === "Others") {
        remarksSection.style.display = "block";
    } else {
        remarksSection.style.display = "none";
    }
});
