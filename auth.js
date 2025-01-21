// Protect record.html
const loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
    alert('You must log in to access this page.');
    window.location.href = 'index.html'; // Redirect to login page
} else {
    console.log(`Welcome, ${loggedInUser}`); // Optional: Show logged-in user in the console
}
