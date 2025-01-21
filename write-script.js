document.getElementById("updateDataButton").addEventListener("click", async () => {
    try {
        // Fetch Data.json
        const response = await fetch("Data.json");
        const data = await response.json();

        // Get form data
        const formData = getWriteFormData(); // Function to get data from write form

        if (!formData) {
            alert("Please fill in all required fields.");
            return;
        }

        // Find all entries with the current mobile number
        const mobileNumber = document.getElementById("mobileNumber").innerText.trim();
        const matchingRecords = data.filter(record => record.Mobile_Number === mobileNumber);

        if (matchingRecords.length === 0) {
            alert("No records found for the current mobile number.");
            return;
        }

        // Remove matching records from Data.json
        const updatedData = data.filter(record => record.Mobile_Number !== mobileNumber);

        // Add matching records to form data and write to Write-Record.json
        matchingRecords.forEach(record => {
            formData["Sr No"] = record["Sr No"];
            formData["Time_of_Entry"] = record["Time_of_Entry"];
            formData["Mobile_Number"] = record["Mobile_Number"];
            formData["Name"] = record["Name"];
            formData["Email"] = record["Email"];
            formData["Area"] = record["Area"];
            formData["Hotel"] = record["Hotel"];
            formData["City"] = record["City"];
            formData["State"] = record["State"];
            formData["Requirement Mentioned"] = record["Requirement Mentioned"];
            formData["Search Time"] = record["Search Time"];
        });

        // Save updated data back to Data.json
        await writeJSONFile("Data.json", updatedData);

        // Append new data to Write-Record.json
        const writeRecordData = await readJSONFile("Write-Record.json") || [];
        writeRecordData.push(...matchingRecords);
        await writeJSONFile("Write-Record.json", writeRecordData);

        alert("Data updated successfully.");
    } catch (error) {
        console.error("Error updating data:", error);
        alert("Failed to update data. Check the console for more details.");
    }
});

// Helper: Get data from the write form
function getWriteFormData() {
    const formData = {
        "Call Connected": document.getElementById("callConnected").value,
        "Intent of Call": document.getElementById("intentOfCall").value,
        "Remarks if Others": document.getElementById("remarksIfOthers").value,
        "Booking ID": document.getElementById("bookingId").value,
        "Booking Created or Not": document.getElementById("bookingCreated").value,
        "Check-In Date": document.getElementById("checkInDate").value,
        "Check-Out Date": document.getElementById("checkOutDate").value,
        "Number of Rooms": document.getElementById("noOfRooms").value,
        "Prepay Pitched": document.getElementById("prepayPitched").value,
        "Prepay Collected": document.getElementById("prepayCollected").value,
        "Reason for Non-Prepay": document.getElementById("reasonOfNonPrepay").value,
        "Agent Remarks": document.getElementById("agentRemarks").value,
        "Status": document.getElementById("status").value
    };

    // Validation
    for (const key in formData) {
        if (!formData[key] && key !== "Remarks if Others") {
            return null; // Missing required field
        }
    }

    if (formData["Intent of Call"] === "Others" && !formData["Remarks if Others"]) {
        alert("Remarks are required if 'Intent of Call' is 'Others'.");
        return null;
    }

    return formData;
}

// Helper: Write JSON to file
async function writeJSONFile(filename, jsonData) {
    const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON Files", accept: { "application/json": [".json"] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(jsonData, null, 2));
    await writable.close();
}

// Helper: Read JSON from file
async function readJSONFile(filename) {
    const handle = await window.showOpenFilePicker({
        suggestedName: filename,
        types: [{ description: "JSON Files", accept: { "application/json": [".json"] } }]
    });
    const file = await handle[0].getFile();
    const contents = await file.text();
    return JSON.parse(contents);
}
