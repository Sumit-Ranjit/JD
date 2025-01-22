document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('yourButtonId').addEventListener('click', function() {
        const formElements = document.querySelectorAll('#yourFormId input, #yourFormId select, #yourFormId textarea');
        const formData = {};

        formElements.forEach(element => {
            formData[element.name] = element.value;
        });

        console.log(formData);
        // You can now send formData to your server or process it as needed
    });
});