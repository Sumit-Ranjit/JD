(async function () {
    const dbName = "initDB"; // Replace with your database name
    const storeName = "user_data_store"; // Replace with your object store name
  
    // Open the IndexedDB database
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  
    // Get data from the object store
    const data = await new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll(); // Get all data from the store
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  
    // Prepare the data as a JSON object to send to Power Automate
    const payload = {
      id: "Client123", // Unique identifier for the client
      data: data, // The data retrieved from IndexedDB
    };
  
    // Power Automate HTTP trigger URL (replace this with your Power Automate URL)
    const powerAutomateUrl = "https://prod-xx.flow.microsoft.com/..." // Replace with your flow URL
  
    // Send the data to Power Automate using fetch
    await fetch(powerAutomateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    console.log("Data sent to Power Automate:", payload);
  })();
  