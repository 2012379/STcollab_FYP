document.addEventListener("DOMContentLoaded", async function () {
    const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        window.location.href = "./login.html";
    });

    await displayFiles("http://localhost:3000/api/files?category=Solution", "solutionFiles");

    await displayFiles("http://localhost:3000/api/files?category=Research", "researchFiles");

    await fetchAndDisplayQueries();
});

async function displayFiles(apiEndpoint, elementId) {
    try {
        const response = await fetch(apiEndpoint);
        const files = await response.json();

        console.log(`Fetched ${elementId} files:`, files);

        const username = window.localStorage.getItem("username");

        const filesDiv = document.getElementById(elementId);

        filesDiv.innerHTML = '';

        files.forEach(function (file) {
            if (username === file.uploaderUsername) {
                const fileDiv = document.createElement('div');
                fileDiv.style = "border: 2px solid #01858D; width: 700px; margin-top: 25px; border-radius: 5px 5px 5px 5px; margin-left: 550px";
                fileDiv.innerHTML = `
                    <p style="margin-left: 10px"><span style="color: #01858D">File:</span> ${file.originalFileName}</p>
                    <div style="height: 40px; width: 70px; float: right; margin-top: -40px">
                        <p style="font-size: 14px; color: #01858D">${file.category}</p>
                    </div>
                    <p style="margin-left: 10px"><span style="color: #01858D">Uploader:</span> ${file.uploaderUsername}</p>
                    <p style="margin-left: 10px"><span style="color: #01858D">Field:</span> ${file.field}</p>
                    <button class="delete-file-btn" data-fileid="${file._id}" style="background-color: #E24E42; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
                `;

                filesDiv.appendChild(fileDiv);
            }
        });
    } catch (error) {
        console.error(`Error fetching ${elementId} files:`, error);
    }
}

async function fetchAndDisplayQueries() {
    try {
        const response = await fetch('/api/getQueries');
        const queriesData = await response.json();

        const username = window.localStorage.getItem("username");

        const queriesDiv = document.getElementById('queries');
        if (queriesDiv) {
            queriesDiv.innerHTML = '';

            queriesData.forEach(query => {
                if (username === query.username){
                    const queryElement = document.createElement('div');
                    queryElement.style = "border: 2px solid #01858D; width: 700px; margin-top: 50px; border-radius: 5px; margin-left: 550px; text-align: left;";
                    queryElement.innerHTML = `
                        <div style="margin-top: 15px" data-queryid="${query._id}" class="query-item">
                            <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Query:</span> ${query.queryText}</p>
                            <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Asker:</span> ${query.username}</p>
                            <button class="delete-query-btn" data-queryid="${query._id}" style="background-color: #E24E42; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button> <!-- Delete button -->
                        </div>
                    `;
                    queriesDiv.appendChild(queryElement);

                }
            });
        }
    } catch (error) {
        console.error('Error fetching queries:', error);
    }
}

// Add event listener for delete buttons
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-file-btn')) {
        const fileId = event.target.getAttribute('data-fileid');
        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('File deleted successfully');
                // Refresh the displayed files after deletion
                await displayFiles("http://localhost:3000/api/files?category=Solution", "solutionFiles");
                await displayFiles("http://localhost:3000/api/files?category=Research", "researchFiles");
            } else {
                console.error('Failed to delete file');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    } else if (event.target.classList.contains('delete-query-btn')) {
        const queryId = event.target.getAttribute('data-queryid');
        try {
            const response = await fetch(`/api/deleteQuery/${queryId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Query deleted successfully');
                // Refresh the displayed queries after deletion
                await fetchAndDisplayQueries();
            } else {
                console.error('Failed to delete query');
            }
        } catch (error) {
            console.error('Error deleting query:', error);
        }
    }
});

const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        window.location.href = "./login.html";
    });