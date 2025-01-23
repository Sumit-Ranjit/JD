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


    indexedDB.databases().then((databases) => {
        databases.forEach((dbInfo) => {
            indexedDB.deleteDatabase(dbInfo.name).onsuccess = function () {
                console.log(`Database '${dbInfo.name}' deleted successfully.`);
            };
        });
    }).catch((error) => {
        console.error("Error fetching databases:", error);
    });
};

// reset-initdb.js

// Function to delete the existing IndexedDB database and create a new one

    const dbName = "initDB";
    const storeName = "user_data_store";
    const dataUrl = "./Data.json"; // Path to your initial data file

    // Function to delete the existing database
    function deleteDatabase() {
        const deleteRequest = indexedDB.deleteDatabase(dbName);

        deleteRequest.onsuccess = function () {
            console.log(`Database '${dbName}' deleted successfully.`);
            createNewDatabase(); // Create a new database after deletion
        };

        deleteRequest.onerror = function (event) {
            console.error(`Error deleting database '${dbName}':`, event.target.error);
        };

        deleteRequest.onblocked = function () {
            console.warn(`Database '${dbName}' deletion blocked. Close all open connections and try again.`);
        };
    }

;