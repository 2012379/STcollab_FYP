// Define an object to store form data
const formData = {};

// Function to navigate to the next page
function nextPage(targetPage) {
    // Perform form validation if needed
    // Example: Check if required fields are filled
    const currentPage = getCurrentPage();
    
    if (currentPage === 'page1.html') {
        const fullname = document.getElementById('fullname').value;
        const profession = document.getElementById('profession').value;

        if (!fullname || !profession) {
            alert('Please fill in all required fields.');
            return;
        }

        // Store data from page 1
        formData.fullname = fullname;
        formData.profession = profession;
    } else if (currentPage === 'page2.html') {
        // Add validation and data storage for page 2 here
    }
    // Add similar logic for other pages
    
    // Navigate to the next page
    window.location.href = targetPage;
}

// Function to navigate to the previous page
function prevPage(targetPage) {
    window.location.href = targetPage;
}

// Function to get the current page URL
function getCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    return currentPage;
}

// Add event listeners for "Next" and "Previous" buttons
document.getElementById('next-button').addEventListener('click', function() {
    const currentPage = getCurrentPage();
    if (currentPage === 'page5.html') {
        // Handle the "Finish" button click (form submission) here
        alert('Form submitted!'); // Replace with your submission logic
    } else {
        // Navigate to the next page
        const nextPageNumber = parseInt(currentPage.charAt(4)) + 1;
        nextPage(`page${nextPageNumber}.html`);
    }
});

document.getElementById('prev-button').addEventListener('click', function() {
    const currentPage = getCurrentPage();
    if (currentPage !== 'page1.html') {
        // Navigate to the previous page
        const prevPageNumber = parseInt(currentPage.charAt(4)) - 1;
        prevPage(`page${prevPageNumber}.html`);
    }
});
