// Fetch the JSON file
fetch('Data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load Data JSON file');
    }
    return response.json(); // Parse the JSON data
  })
  .then(Data => {
    // Access the first record
    const firstRecord = Data[0];

    // Display the record
    const recordDiv = document.getElementById('record');
    recordDiv.innerHTML = `
      <p><strong>Mobile Number:</strong> ${firstRecord.Mobile_Number}</p>
      <p><strong>Name:</strong> ${firstRecord.Name}</p>
      <p><strong>Email:</strong> ${firstRecord.Email}</p>
      <p><strong>Area:</strong> ${firstRecord.Area}</p>
      <p><strong>Hotel:</strong> ${firstRecord.Hotel}</p>
      <p><strong>City:</strong> ${firstRecord.City}</p>
      <p><strong>State:</strong> ${firstRecord.State}</p>
      <p><strong>Requirement Mentioned:</strong> ${firstRecord.Requirement Mentioned}</p>
      <p><strong>Search Time:</strong> ${firstRecord.Search Time}</p>
    `;
  })
  .catch(error => {
    const recordDiv = document.getElementById('record');
    recordDiv.innerHTML = `<p>Error loading data: ${error.message}</p>`;
    console.error('Error:', error);
  });
