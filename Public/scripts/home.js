// home.js
document.addEventListener("DOMContentLoaded", async function () {
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", async function () {
        const searchInput = document.getElementById("searchInput").value;
        await displayFilesWithSearch(searchInput, "solutionFiles");
        await displayFilesWithSearch(searchInput, "researchFiles");
        await displayQueriesWithSearch(searchInput);
    });

    const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        window.location.href = "./login.html";
    });

    // Fetch and display solution files
    await displayFiles("http://localhost:3000/api/files?category=Solution", "solutionFiles");

    // Fetch and display research papers
    await displayFiles("http://localhost:3000/api/files?category=Research", "researchFiles");

    // Fetch and display queries
    await fetchAndDisplayQueries();
});

async function displayFiles(apiEndpoint, elementId) {
    try {
        const response = await fetch(apiEndpoint);
        const files = await response.json();

        console.log(`Fetched ${elementId} files:`, files);

        const username = window.localStorage.getItem("username");

        const filesDiv = document.getElementById(elementId);
        // Clear existing content
        filesDiv.innerHTML = '';

        // Add file information to the div based on selected checkboxes and search input
        files.forEach(function (file) {
                const fileDiv = document.createElement('div');
                fileDiv.style = "border: 2px solid #01858D; width: 700px; margin-top: 25px; border-radius: 5px 5px 5px 5px; margin-left: 550px";
                fileDiv.innerHTML = `
                    <p style="margin-left: 10px"><span style="color: #01858D">File:</span> ${file.originalFileName}</p>
                    <div style="height: 40px; width: 70px; float: right; margin-top: -50px">
                        <p style="font-size: 14px; color: #01858D">${file.category}</p>
                    </div>
                    <p style="margin-left: 10px"><span style="color: #01858D">Uploader:</span> ${file.uploaderUsername}</p>
                    <p style="margin-left: 10px"><span style="color: #01858D">Field:</span> ${file.field}</p>
                `;

                // Add a click event listener to open the file
                fileDiv.addEventListener('click', function () {
                    openFile(file);
                });

                filesDiv.appendChild(fileDiv);
        });
    } catch (error) {
        console.error(`Error fetching ${elementId} files:`, error);
    }
}

async function fetchAndDisplayQueries() {
    try {
        const response = await fetch('/api/getQueries');
        const queriesData = await response.json();

        const queriesDiv = document.getElementById('queries');
        if (queriesDiv) {
            queriesDiv.innerHTML = '';

            queriesData.forEach(query => {
                const queryElement = document.createElement('div');
                queryElement.style = "border: 2px solid #01858D; width: 700px; margin-top: 50px; border-radius: 5px; margin-left: 550px; text-align: left;";
                queryElement.innerHTML = `
                    <div style="margin-top: 15px" data-queryid="${query._id}" class="query-item">
                        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Query:</span> ${query.queryText}</p>
                        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Asker:</span> ${query.username}</p>
                    </div>
                `;
                queriesDiv.appendChild(queryElement);

                // Add event listener to each query item
                queryElement.addEventListener('click', function () {
                    const queryId = query._id;
                    window.location.href = `../html/replies.html?queryId=${queryId}`;
                });
            });
        }
    } catch (error) {
        console.error('Error fetching queries:', error);
    }
}

async function displayFilesWithSearch(searchInput, elementId) {
    try {
        const response = await fetch(`http://localhost:3000/api/files?category=Solution`);
        const files = await response.json();

        const filteredFiles = files.filter(file => {
            return file.originalFileName.toLowerCase().includes(searchInput.toLowerCase());
        });

        const filesDiv = document.getElementById(elementId);
        filesDiv.innerHTML = '';

        filteredFiles.forEach(function (file) {
            const fileDiv = document.createElement('div');
            fileDiv.style = "border: 2px solid #01858D; width: 700px; margin-top: 50px; border-radius: 5px 5px 5px 5px; margin-left: 550px";
            fileDiv.innerHTML = `
                <p style="margin-left: 10px"><span style="color: #01858D">File:</span> ${file.originalFileName}</p>
                <div style="height: 40px; width: 70px; float: right; margin-top: -50px">
                    <p style="font-size: 14px; color: #01858D">${file.category}</p>
                </div>
                <p style="margin-left: 10px"><span style="color: #01858D">Uploader:</span> ${file.uploaderUsername}</p>
                <p style="margin-left: 10px"><span style="color: #01858D">Field:</span> ${file.field}</p>
            `;

            fileDiv.addEventListener('click', function () {
                openFile(file);
            });

            filesDiv.appendChild(fileDiv);
        });
    } catch (error) {
        console.error(`Error fetching ${elementId} files:`, error);
    }
}

async function displayQueriesWithSearch(searchInput) {
    try {
        const response = await fetch('/api/getQueries');
        const queriesData = await response.json();

        const queriesDiv = document.getElementById('queries');
        if (queriesDiv) {
            queriesDiv.innerHTML = '';

            const filteredQueries = queriesData.filter(query => {
                return query.queryText.toLowerCase().includes(searchInput.toLowerCase());
            });

            filteredQueries.forEach(query => {
                const queryElement = document.createElement('div');
                queryElement.style = "border: 2px solid #01858D; width: 700px; margin-top: 20px; border-radius: 5px; margin-left: 550px; text-align: left;";
                queryElement.innerHTML = `
                    <div style="margin-top: 15px" data-queryid="${query._id}" class="query-item">
                        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Query:</span> ${query.queryText}</p>
                        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Asker:</span> ${query.username}</p>
                    </div>
                `;
                queriesDiv.appendChild(queryElement);

                queryElement.addEventListener('click', function () {
                    const queryId = query._id;
                    window.location.href = `../html/replies.html?queryId=${queryId}`;
                });
            });
        }
    } catch (error) {
        console.error('Error fetching queries:', error);
    }
}

function openFile(file) {
    if (!file || !file._id) {
        console.error('Invalid file object or file ID.');
        return;
    }

    window.open(`http://localhost:3000/api/files/${file._id}`, '_blank');
}
