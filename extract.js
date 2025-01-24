document.addEventListener("DOMContentLoaded", () => {
    const sendBackButton = document.getElementById("send-back-btn");

    if (sendBackButton) {
        sendBackButton.addEventListener("click", async function () {
            const powerAutomateUrl =
                "https://prod-03.centralindia.logic.azure.com:443/workflows/4855239eef9346f185b1792b259dfb23/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0Bf_RNJxBoxkD2U4XLFQ9OXA6n3DgZKHbZiG5hcuVFo"; // Replace with your URL

            // Retrieve data from localStorage
            const rawData = localStorage.getItem("Data.json");

            if (!rawData) {
                console.error("No data found in localStorage for key 'Data.json'.");
                alert("No data found in localStorage to send.");
                return;
            }

            try {
                // Parse the data
                const data = JSON.parse(rawData);

                // Send the data to Power Automate
                const response = await fetch(powerAutomateUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    console.log("Data successfully sent to Power Automate.");
                    alert("Data sent to Power Automate successfully!");
                } else {
                    console.error(`HTTP Error: ${response.status} ${response.statusText}`);
                    const errorDetails = await response.text();
                    console.error("Error Details:", errorDetails);
                    alert(`Failed to send data. HTTP Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error during fetch request:", error.message);
                alert("An error occurred while sending data to Power Automate. Check console for details.");
            }
        });
    } else {
        console.error("Button with ID 'send-back-btn' not found.");
    }
});
