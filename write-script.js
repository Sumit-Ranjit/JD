// Function to submit the form and save the data to IndexedDB
document.getElementById('user-input-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const currentMobileNumber = localStorage.getItem('currentMobileNumber'); // Get mobile number

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
    
    // Remove the processed record from Data.json (use backend to handle this part)
    deleteProcessedRecord(currentMobileNumber);
    
    // Load the next record
    currentIndex++;
    loadNextRecord();
});

// Function to save data to IndexedDB
function saveToIndexedDB(data) {
    const dbName = 'user_data_db';
    const storeName = 'user_data_store';
    
    let request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = function (e) {
        const db = e.target.result;
        db.createObjectStore(storeName, { keyPath: 'Mobile_Number' });
    };
    
    request.onsuccess = function (e) {
        const db = e.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        store.put(data); // Insert data
        
        transaction.oncomplete = function () {
            console.log('Data saved to IndexedDB');
        };
        
        transaction.onerror = function (e) {
            console.error('Error saving data:', e.target.error);
        };
    };
}

// Function to delete the processed record from Data.json (handled on server)
function deleteProcessedRecord(mobileNumber) {
    // This would typically involve making an API call to delete the record from the server or local file
    console.log(`Deleting processed record for mobile number: ${mobileNumber}`);
}
