document.getElementById("user-input-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const currentMobileNumber = localStorage.getItem("currentMobileNumber");
    if (!currentMobileNumber) {
        alert("No mobile number found to process.");
        return;
    }

    const dataToSave = {
        "Mobile_Number": currentMobileNumber,
        "Call_Connected": document.getElementById("call-connected").value,
        "Intent_of_Call": document.getElementById("intent-of-call").value,
        "Remarks_if_Others": document.getElementById("remarks-if-others").value,
        "Booking_ID": document.getElementById("booking-id").value,
        "Booking_Created": document.getElementById("booking-created").value,
        "Prepay_Collected": document.getElementById("prepay-collected").value,
        "Agent_Remarks": document.getElementById("agent-remarks").value,
    };

    saveToIndexedDB(dataToSave);
    loadNextMobileNumber();
});

// Save to IndexedDB
function saveToIndexedDB(data) {
    const dbName = "user_data_db";
    const storeName = "user_data_store";
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "Mobile_Number" });
        }
    };

    request.onsuccess = function (e) {
        const db = e.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        store.put(data);

        transaction.oncomplete = function () {
            console.log("Data saved to IndexedDB successfully.");
        };

        transaction.onerror = function (e) {
            console.error("Error saving data to IndexedDB:", e.target.error);
        };
    };

    request.onerror = function (e) {
        console.error("Error opening IndexedDB:", e.target.error);
    };
}

// Load next mobile number
function loadNextMobileNumber() {
    // Logic to fetch and update the next mobile number
    console.log("Next mobile number logic goes here.");
}