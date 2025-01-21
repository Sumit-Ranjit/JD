const readTable = document.getElementById('readTable').getElementsByTagName('tbody')[0];
const mobileNumberSpan = document.getElementById('mobileNumber');
const nameSpan = document.getElementById('name');
const emailSpan = document.getElementById('email');
const intentOfCall = document.getElementById('intentOfCall');
const remarksIfOthersSection = document.getElementById('remarksIfOthersSection');
const remarksIfOthers = document.getElementById('remarksIfOthers');

// Mock data (replace with actual fetch from Data.json)
const data = [
    {
        "Sr No": "804",
        "Time_of_Entry": "45676.8351851852",
        "Mobile_Number": "9082175513",
        "Name": "Mr Saif",
        "Email": "saif@example.com",
        "Area": "Andheri East",
        "Hotel": "Super Townhouse Khar The Unicontinental",
        "City": "Mumbai",
        "State": "Maharashtra",
        "Requirement Mentioned": "Hotels Rs 3001 To Rs 4000",
        "Search Time": "2025-01-19 20:01:21",
        "Status": "Not Done"
    }
];

// Load read section dynamically
function loadReadSection() {
    const mobileNumber = data[0]?.Mobile_Number || '';
    const name = data[0]?.Name || '';
    const email = data[0]?.Email || '';

    mobileNumberSpan.textContent = mobileNumber;
    nameSpan.textContent = name;
    emailSpan.textContent = email;

    data.forEach(record => {
        if (record.Mobile_Number === mobileNumber) {
            const row = readTable.insertRow();
            row.insertCell(0).textContent = record["Sr No"];
            row.insertCell(1).textContent = convertExcelDate(record["Time_of_Entry"]);
            row.insertCell(2).textContent = record["Hotel"];
            row.insertCell(3).textContent = record["Area"];
            row.insertCell(4).textContent = record["City"];
            row.insertCell(5).textContent = record["State"];
            row.insertCell(6).textContent = record["Requirement Mentioned"];
            row.insertCell(7).textContent = record["Search Time"];
        }
    });
}

// Convert Excel date to standard format
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Show or hide "Remarks if Others" field
intentOfCall.addEventListener('change', () => {
    if (intentOfCall.value === 'Others') {
        remarksIfOthersSection.style.display = 'block';
        remarksIfOthers.setAttribute('required', true);
    } else {
        remarksIfOthersSection.style.display = 'none';
        remarksIfOthers.removeAttribute('required');
    }
});

// Save button logic
document.getElementById('saveButton').addEventListener('click', () => {
    const formData = {
        "Call Connected": document.getElementById('callConnected').value,
        "Intent of Call": intentOfCall.value,
        "Remarks if Others": remarksIfOthers.value,
        "Booking ID": document.getElementById('bookingId').value,
        "Check-In Date": document.getElementById('checkInDate').value,
        "Check-Out Date": document.getElementById('checkOutDate').value,
        "Number of Rooms": parseInt(document.getElementById('numRooms').value),
        "Booking Created": document.getElementById('bookingCreated').value,
        "Reason of Non-Booking": document.getElementById('reasonNonBooking').value,
        "Prepay Pitched": document.getElementById('prepayPitched').value,
        "Prepay Collected": document.getElementById('prepayCollected').value,
        "Reason of Non-Prepay": document.getElementById('reasonNonPrepay').value,
        "Agent Remarks": document.getElementById('agentRemarks').value,
        "Status": document.getElementById('status').value
    };

    const mobileNumber = mobileNumberSpan.textContent;

    // Update all records with the same mobile number
    const updatedData = data.map(record => {
        if (record.Mobile_Number === mobileNumber) {
            return { ...record, ...formData };
        }
        return record;
    });

    // Save to Write-Record.json (simulated here as console log)
    console.log('Updated Records:', updatedData);
    alert('Records saved successfully!');
});

// Load the initial data
loadReadSection();
