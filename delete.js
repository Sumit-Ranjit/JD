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
document.addEventListener("DOMContentLoaded", () => {
    indexedDB.databases().then((databases) => {
        databases.forEach((dbInfo) => {
            indexedDB.deleteDatabase(dbInfo.name).onsuccess = function () {
                console.log(`Database '${dbInfo.name}' deleted successfully.`);
            };
        });
    }).catch((error) => {
        console.error("Error fetching databases:", error);
    });
});
