window.onload = function() {
    // Clear local storage
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/"; 
    });

    console.log("All browser storage data has been deleted.");
};