var version1 = 0;

(async function getDatabaseVersion(callback) {
    const dbName = "initDB"; // Replace with your IndexedDB database name
  
    // Open the database
    const openRequest = indexedDB.open(dbName);
  
    // Handle success
    
    openRequest.onsuccess = (event) => {
      const db = event.target.result;
  
      // Get the version of the database
      console.log(`Database Name: ${db.name}`);
      console.log(`Database Version: ${db.version}`);
      version1 = db.version + 1;
      console.log(`Inter mediate value: ${version1}`);
      return version1;
      // Close the database
      db.close();
    
    callback(version1);
    };
  
    // Handle errors
    openRequest.onerror = (event) => {
      console.error(`Error opening database: ${event.target.error}`);
    };
  
    // Handle database not existing
    openRequest.onupgradeneeded = () => {
      console.log("Database does not exist or is being upgraded.");
    };
    
});

// Increment the version number;
export let version= getDatabaseVersion(function(version1){
  version = version1 + 1;

console.log(`Passed Value: ${version}`);
});
  