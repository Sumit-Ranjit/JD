// Retrieve the value stored in localStorage with the key "Data.json"
const rawData = localStorage.getItem("Data.json");

if (rawData) {
    try {
        // Parse the JSON data into a structured JavaScript object
        const data = JSON.parse(rawData);

        console.log("Parsed Data:", data); // Logs the structured data
    } catch (error) {
        console.error("Error parsing JSON data from localStorage:", error);
    }
} else {
    console.log("No data found in localStorage for key 'Data.json'.");
}
