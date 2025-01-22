// Node.js code
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./initDB.db');

db.serialize(() => {
    // Fetch the first record where Status is 'Not Done'
    db.get("SELECT * FROM initDB WHERE Status = 'Not Done' LIMIT 1", (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row) {
            const mobileNumber = row.Mobile_Number;

            // Fetch all records with the same Mobile_Number
            db.all("SELECT * FROM initDB WHERE Mobile_Number = ?", [mobileNumber], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return;
                }

                if (rows.length > 0) {
                    // Display Name, Mobile Number, Email as text
                    console.log(`Name: ${rows[0].Name}`);
                    console.log(`Mobile Number: ${rows[0].Mobile_Number}`);
                    console.log(`Email: ${rows[0].Email}`);

                    // Display Hotel, Area, City, State, Requirement Mentioned and Search Time in table
                    console.log("\nRecords:");
                    console.log("Hotel\tArea\tCity\tState\tRequirement Mentioned\tSearch Time");
                    rows.forEach(record => {
                        console.log(`${record.Hotel}\t${record.Area}\t${record.City}\t${record.State}\t${record.Requirement_Mentioned}\t${record.Search_Time}`);
                    });
                } else {
                    console.log("No records found with the given Mobile Number.");
                }
            });
        } else {
            console.log("No records found with Status 'Not Done'.");
        }
    });
});

// Browser code
// One option is to use a library like sql.js to work with SQLite databases in the browser.

const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.js";
document.head.appendChild(script);

script.onload = function() {
    // Initialize the SQL.js library
    initSqlJs().then(function(SQL) {
        // Load the database from a file or create a new one
        fetch('./initDB.db').then(response => response.arrayBuffer()).then(data => {
            const db = new SQL.Database(new Uint8Array(data));

            // Fetch the first record where Status is 'Not Done'
            const result = db.exec("SELECT * FROM initDB WHERE Status = 'Not Done' LIMIT 1");
            if (result.length > 0) {
                const row = result[0].values[0];
                const records = db.exec(`SELECT * FROM initDB WHERE Mobile_Number = '${mobileNumber}'`);
                if (records.length > 0) {
                    const rows = records[0].values;

                    // Display Name, Mobile Number, Email as text
                    console.log(`Name: ${rows[0][1]}`); // Assuming Name is the second column
                    console.log(`Mobile Number: ${rows[0][2]}`); // Assuming Mobile_Number is the third column
                    console.log(`Email: ${rows[0][3]}`); // Assuming Email is the fourth column

                    // Display Hotel, Area, City, State, Requirement Mentioned and Search Time in table
                    console.log("\nRecords:");
                    console.log("Hotel\tArea\tCity\tState\tRequirement Mentioned\tSearch Time");
                    rows.forEach(record => {
                        console.log(`${record[4]}\t${record[5]}\t${record[6]}\t${record[7]}\t${record[8]}\t${record[9]}`);
                    });
                } else {
                    console.log("No records found with the given Mobile Number.");
                }
            } else {
                console.log("No records found with Status 'Not Done'.");
            }

            db.close();
        });
    });
};
