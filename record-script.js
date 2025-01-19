// Fetch the JSON file
fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load JSON file');
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {
    // Access the first record
    const firstRecord = data[0];

    // Display the record
    const recordDiv = document.getElementById('record');
    recordDiv.innerHTML = `
      <p><strong>Mobile Number:</strong> ${firstRecord.Mobile_Number}</p>
      <p><strong>Name:</strong> ${firstRecord.name}</p>
      <p><strong>Email:</strong> ${firstRecord.email}</p>
    `;
  })
  .catch(error => {
    const recordDiv = document.getElementById('record');
    recordDiv.innerHTML = `<p>Error loading data: ${error.message}</p>`;
    console.error('Error:', error);
  });
