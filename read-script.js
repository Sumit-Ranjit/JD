// Function to load and filter data for the current mobile number
async function loadAndDisplayData() {
    const currentMobileNumber = localStorage.getItem('currentMobileNumber'); // Get mobile number dynamically
    if (!currentMobileNumber) {
        alert("No mobile number set. Please start processing from the first record.");
        return;
    }

    try {
        const response = await fetch('Data.json'); // Load data from Data.json
        const data = await response.json();

        // Filter records by current mobile number
        const filteredRecords = data.filter(record => record.Mobile_Number === currentMobileNumber);

        if (filteredRecords.length === 0) {
            alert(`No more records found for mobile number: ${currentMobileNumber}`);
            // Optionally clear the currentMobileNumber in localStorage
            localStorage.removeItem('currentMobileNumber');
            return;
        }

        // Populate basic info section
        const basicInfoDiv = document.getElementById('basic-info');
       
