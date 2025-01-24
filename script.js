window.onload = function () {

const rawData = localStorage.getItem("Data.json");
const data = JSON.parse(rawData);
const URL = "https://prod-03.centralindia.logic.azure.com:443/workflows/4855239eef9346f185b1792b259dfb23/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0Bf_RNJxBoxkD2U4XLFQ9OXA6n3DgZKHbZiG5hcuVFo";

fetch(URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
})
    .then((response) => {
        if (response.ok) {
            console.log("Data successfully sent to Power Automate.");
            alert("Data sent to Power Automate successfully!");
        } else {
            console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
            response.text().then((errorDetails) => {
                console.error("Error Details:", errorDetails);
                alert("Failed to send data. Check the console for details.");
            });
        }
    })
    .catch((error) => {
        console.error("Error during fetch request:", error.message);
        alert("An error occurred while sending data to Power Automate. Check the console for details.");
    });
}