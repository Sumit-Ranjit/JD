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
let writeFileHandle
