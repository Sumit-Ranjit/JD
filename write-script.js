let data = [];
let mobileNumberRecords = [];
let selectedMobileNumber = "";

// Elements
const loadDataButton = document.getElementById("loadDataButton");
const readSection = document.getElementById("readSection");
const writeSection = document.querySelector(".write-section");
const mobileNumberSpan = document.getElementById("mobileNumber");
const nameSpan = document.getElementById("name");
const emailSpan = document.getElementById("email");
const readTable = document.getElementById("readTable").getElementsByTagName("tbody")[0];
const saveButton = document.getElementById("saveButton");
const updateDataButton = document.getElementById("updateDataButton");

// File handles
let dataFileHandle = null;
let writeFileHandle = null;

// Utility: Convert Excel Date to ISO
function convertExcelDate(excelDate) {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Utility: Show Read Section
function showReadSection() {
    readSection.style.display = "block";
    writeSection.style.display = "block";
    updateDataButton.style.display = "block";
}

// Load Data.json
loadDataButton.addEventListener("click", async () => {
    [dataFileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: "JSON Files",
                accept: { "application/json": [".json"] },
            },
        ],
    });

    const file = await dataFileHandle.getFile();
    const text = await file.text();
    data = JSON.parse(text);

    selectedMobileNumber = data[0]?.Mobile_Number;
    mobileNumberRecords = data.filter(record => record.Mobile_Number === selectedMobileNumber);

    mobileNumberSpan.textContent = selectedMobileNumber;
    nameSpan.textContent = data[0]?.Name || "N/A";
    emailSpan.textContent = data[0]?.Email || "N/A";

    mobileNumberRecords.forEach(record => {
        const row = readTable.insertRow();
        row.insertCell(0).textContent = record["Sr No"];
        row.insertCell(1).textContent = convertExcelDate(record["Time_of_Entry"]);
        row.insertCell(2).textContent = record["Hotel"];
        row.insertCell(3).textContent = record["Area"];
        row.insertCell(4).textContent = record["City"];
        row.insertCell(5).textContent = record["State"];
        row.insertCell(6).textContent = record["Requirement Mentioned"];
        row.insertCell(7).textContent = record["Search Time"];
    });

    showReadSection();
});

// Save to Write-Record.json
saveButton.addEventListener("click", async () => {
    if (!writeFileHandle) {
        [writeFileHandle] = await window.showSaveFilePicker({
            suggestedName: "Write-Record.json",
            types: [
                {
                    description: "JSON Files",
                    accept: { "application/json": [".json"] },
                },
            ],
        });
    }

    const writableStream = await writeFileHandle.createWritable();
    await writableStream.write(JSON.stringify(mobileNumberRecords, null, 2));
    await writableStream.close();

    alert("Records saved to Write-Record.json");
});

// Update Data.json
updateDataButton.addEventListener("click", async () => {
    const remainingRecords = data.filter(record => record.Mobile_Number !== selectedMobileNumber);

    const writableStream = await dataFileHandle.createWritable();
    await writableStream.write(JSON.stringify(remainingRecords, null, 2));
    await writableStream.close();

    alert("Data.json updated successfully!");
    location.reload();
});
