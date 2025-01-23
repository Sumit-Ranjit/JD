document.addEventListener("DOMContentLoaded", () => {
    const sendBackButton = document.getElementById("send-back-btn");

    if (sendBackButton) {
        sendBackButton.addEventListener("click", function () {
            const powerAutomateUrl =
                "https://prod-03.centralindia.logic.azure.com:443/workflows/4855239eef9346f185b1792b259dfb23/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0Bf_RNJxBoxkD2U4XLFQ9OXA6n3DgZKHbZiG5hcuVFo"; // Replace with your Power Automate URL

            // Retrieve data from localStorage
            const rawData = localStorage.getItem("Data.json");

            if (rawData) {
                try {
                    // Parse the data into a structured format
                    const data = JSON.parse(rawData);

                    // Send the data to Power Automate
                    fetch(powerAutomateUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data), // Convert data back to JSON format
                    })
                        .then((response) => {
                            if (response.ok) {
                                console.log("Data successfully sent to Power Automate.");
                                alert("Data sent to Power Automate successfully!");
                            } else {
                                console.error("Failed to send data:", response.statusText);
                                alert("Failed to send data to Power Automate.");
                            }
                        })
                        .catch((error) => {
                            console.error("Error during fetch request:", error);
                            alert("An error occurred while sending data to Power Automate.");
                        });
                } catch (error) {
                    console.error("Failed to parse data from localStorage:", error);
                    alert("Invalid data in localStorage. Could not send.");
                }
            } else {
                console.log("No data found in localStorage for key 'Data.json'.");
                alert("No data found in localStorage to send.");
            }
        });
    } else {
        console.error("Button with ID 'send-back-btn' not found.");
    }
});
