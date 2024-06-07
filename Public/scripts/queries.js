const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});

document.addEventListener("DOMContentLoaded", () => {
    const popupButton = document.getElementById('ask_btn');

    if (popupButton) {
        popupButton.addEventListener('click', openPopup);
    }

    const queryForm = document.querySelector('form');
    if (queryForm) {
        queryForm.addEventListener('submit', submitQuery);
    }

    // Fetch and display queries when the page loads
    fetchQueries();
});

function openPopup() {
    const queryModal = document.getElementById("queryModal");
    const queryForm = document.getElementById("queryForm");

    if (queryModal && queryForm) {
        queryModal.classList.add("show");
        queryModal.style.display = "block"; // Ensure modal is visible
        queryForm.reset(); // Reset form fields

        // Retrieve username from local storage
        const storedUsername = window.localStorage.getItem('username');
        const usernameInput = document.getElementById('username');

        // Set the default value of username input box to storedUsername
        if (usernameInput && storedUsername) {
            usernameInput.value = storedUsername;
        }
    }
}


function closePopup() {
    const queryModal = document.getElementById("queryModal");

    if (queryModal) {
        queryModal.classList.remove("show");
        queryModal.style.display = "none"; // Hide modal
    }

    fetchQueries();
}

async function submitQuery(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const queryInput = document.getElementById('que');

    const username = usernameInput.value;
    const query = queryInput.value;

    try {
        const response = await fetch('/api/saveQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                query: query,
            }),
        });

        const responseData = await response.json();

        if (responseData.success) {
            console.log('Query saved successfully');
        } else {
            console.error('Error saving the query:', responseData.error);
        }
    } catch (error) {
        console.error('Error submitting query:', error);
    }

    closePopup();
}

async function fetchQueries() {
    try {
        const response = await fetch('/api/getQueries');
        const queriesData = await response.json();

        queriesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const queriesDiv = document.getElementById('queries');
        if (queriesDiv) {
            queriesDiv.innerHTML = '';

            queriesData.forEach(query => {
                const queryElement = document.createElement('div');
                queryElement.style = "border: 2px solid #01858D; width: 700px; margin-top: 40px; border-radius: 5px; margin-left: 320px; text-align: left; word-wrap: break-word;";
                queryElement.innerHTML = `
                    <div style="margin-top: 15px" data-queryid="${query._id}" class="query-item">
                        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Query:</span> ${query.queryText}</p>
                        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Asker:</span> ${query.username}</p>
                    </div>
                `;
                queriesDiv.appendChild(queryElement);
            
                // Add event listener to each query item
                queryElement.addEventListener('click', function() {
                    const queryId = query._id;
                    window.location.href = `../html/replies.html?queryId=${queryId}`;
                });
            });
        }
    } catch (error) {
        console.error('Error fetching queries:', error);
    }
}

logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
  });