// read-script.js

// Function to get data from local storage
function getDataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Function to find the first record with status 'Not Done'
function findFirstNotDoneRecord(data) {
    return data.find(record => record.Status === 'Not Done');
}

// Function to generate the table
function generateTable(records) {
    let table = '<table border="1"><tr><th>Hotel</th><th>Area</th><th>City</th><th>State</th><th>Requirement Mentioned</th><th>Search Time</th></tr>';
    records.forEach(record => {
        table += `<tr>
                    <td>${record.Hotel}</td>
                    <td>${record.Area}</td>
                    <td>${record.City}</td>
                    <td>${record.State}</td>
                    <td>${record.Requirement_Mentioned}</td>
                    <td>${record.Search_Time}</td>
                  </tr>`;
    });
    table += '</table>';
    return table;
}

// Main function to execute the script
function main() {
    const data = getDataFromLocalStorage('JD_Data');
    if (!data) {
        console.log('No data found in local storage');
        return;
    }

    const firstNotDoneRecord = findFirstNotDoneRecord(data);
    if (!firstNotDoneRecord) {
        console.log('No record with status "Not Done" found');
        return;
    }

    const { Mobile_Number, Name, Email } = firstNotDoneRecord;
    console.log(`Mobile Number: ${Mobile_Number}`);
    console.log(`Name: ${Name}`);
    console.log(`Email: ${Email}`);

    const recordsWithSameMobileNumber = data.filter(record => record.Mobile_Number === Mobile_Number);
    const table = generateTable(recordsWithSameMobileNumber);
    console.log(table);
}

// Execute the main function
main();