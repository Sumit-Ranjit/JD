window.onload = function() {
    // Preserve login information
    const loginInfo = localStorage.getItem('loginInfo');
    const sessionLoginInfo = sessionStorage.getItem('loginInfo');
    const loginCookie = document.cookie.split(";").find(c => c.trim().startsWith('loginInfo='));

    // Clear local storage except login information
    localStorage.clear();
    if (loginInfo) {
        localStorage.setItem('loginInfo', loginInfo);
    }

    // Clear session storage except login information
    sessionStorage.clear();
    if (sessionLoginInfo) {
        sessionStorage.setItem('loginInfo', sessionLoginInfo);
    }

    // Clear cookies except login information
    document.cookie.split(";").forEach(function(c) {
        if (!c.trim().startsWith('loginInfo=')) {
            document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        }
    });
    if (loginCookie) {
        document.cookie = loginCookie;
    }

    console.log("All browser storage data except login information has been deleted.");


};

// reset-initdb.js

// Function to delete the existing IndexedDB database and create a new one

    const dbName = "initDB";
    const storeName = "user_data_store";
    const dataUrl = "./Data.json"; // Path to your initial data file

    // Function to delete the existing database
   

;

// Step 1: Delete the entire database


let deleteRequest = indexedDB.deleteDatabase(dbName);

deleteRequest.onsuccess = function() {
  console.log(`Database '${dbName}' deleted successfully!`);

  // Step 2: Recreate the database with a new version
  let openRequest = indexedDB.open(dbName, 1); // Open with new version (2, or any version you want)

  openRequest.onupgradeneeded = function(event) {
    let db = event.target.result;
    console.log(`Opening database with version: ${event.target.version}`);
    
    // Create object stores (for example, 'user_store_data')
    if (!db.objectStoreNames.contains('user_store_data')) {
      db.createObjectStore('user_store_data', { keyPath: 'Mobile_Number' });
    }

    // Add any other object stores or indexes as needed
  };

  openRequest.onsuccess = function() {
    console.log('Database opened successfully with new version!');
  };

  openRequest.onerror = function() {
    console.log('Error opening database.');
  };
};

deleteRequest.onerror = function() {
  console.log('Error deleting the database.');
};
