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

db.close();