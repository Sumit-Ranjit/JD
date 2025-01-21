// Function to submit the form and save the data to IndexedDB
document.getElementById('data-table').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const currentMobileNumber = localStorage.getItem('currentMobileNumber'); // Get mobile number
    if (!currentMobileNumber) {
        alert("No mobile number found to process.");
        return;
    }

    // Collect user inputs
    const dataToSave = {
        "Mobile_Number": currentMobileNumber,
        "Call_Connected": document.getElementById('call-connected').value,
        "Intent_of_Call": document.getElementById('intent-of-call').value,
        "Remarks_if_Others": document.getElementById('remarks-if-others').value,
        "Booking_ID": document.getElementById('booking-id').value,
        "Booking_Created": document.getElementById('booking-created').value,
        "Prepay_Collected": document.getElementById('prepay-collected').value,
        "Agent_Remarks": document.getElementById('agent-remarks').value
    };

    // Save the data to IndexedDB
    saveToIndexedDB(dataToSave);

    // Remove the processed record from Data.json (handled locally here)
    removeProcessedRecord(currentMobileNumber);

    // Load the next record
    loadNextRecord();
});

// Function to save data to IndexedDB
function saveToIndexedDB(data) {
    const dbName = 'user_data_db';
    const storeName = 'user_data_store';

    let request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'Mobile_Number' });
        }
    };

    request.onsuccess = function (e) {
        const db = e.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        store.put(data); // Insert or update data

        transaction.oncomplete = function () {
            console.log('Data saved to IndexedDB successfully.');
        };

        transaction.onerror = function (e) {
            console.error('Error saving data to IndexedDB:', e.target.error);
        };
    };

    request.onerror = function (e) {
        console.error('Error opening IndexedDB:', e.target.error);
    };
}

// Function to remove the processed record
function removeProcessedRecord(mobileNumber) {
    const data = JSON.parse(localStorage.getItem('data')) || [];
    const updatedData = data.filter(record => record.Mobile_Number !== mobileNumber);

    // Update localStorage with the remaining records
    localStorage.setItem('data', JSON.stringify(updatedData));

    console.log(`Record with mobile number ${mobileNumber} removed.`);
}

// Function to load the next record
function loadNextRecord() {
    const data = JSON.parse(localStorage.getItem('data')) || [];
    if (data.length === 0) {
        alert("No more records to process.");
        return;
    }

    // Load the next record
    const nextRecord = data[0]; // Get the first record
    localStorage.setItem('currentMobileNumber', nextRecord.Mobile_Number);

    // Refresh the page to display the new record
    window.location.reload();
}
