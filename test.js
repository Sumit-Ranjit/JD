// Open (or create) the database
let request = indexedDB.open("JD_DB", 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;

    // Create an object store named "Data"
    let objectStore = db.createObjectStore("Data", { keyPath: "Mobile_Number" });

    // Create an index to search by name
    objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = function(event) {
    let db = event.target.result;

    // Fetch data from Data.json
    fetch('Data.json')
        .then(response => response.json())
        .then(data => {
            let transaction = db.transaction(["Data"], "readwrite");
            let objectStore = transaction.objectStore("Data");

            // Add data to the object store
            data.forEach(item => {
                let request = objectStore.add(item);
                request.onerror = function(event) {
                    console.error("Error adding item:", event.target.error);
                };
            });

            transaction.oncomplete = function() {
                console.log("All data added to the database successfully.");
            };

            transaction.onerror = function() {
                console.log("Error occurred while adding data to the database.");
            };
        })
        .catch(error => {
            console.error("Failed to fetch data from Data.json:", error);
        });
};

request.onerror = function(event) {
    console.error("Database error:", event.target.errorCode);
};