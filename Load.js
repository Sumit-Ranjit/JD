window.onload = function() {
    fetch('Data.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                localStorage.setItem(`IndexDB_${item.Mobible_number}`, JSON.stringify(item));
            });
        })
        .catch(error => console.error('Error loading data:', error));
};