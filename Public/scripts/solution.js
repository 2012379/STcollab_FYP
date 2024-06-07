document.addEventListener("DOMContentLoaded", async function () {
    const checkboxes = document.querySelectorAll('.field-checkbox');
  
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', async function () {
        checkboxes.forEach(function (otherCheckbox) {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
  
        // Fetch files based on selected checkboxes
        getAllFiles();
      });
    });
  
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function () {
      getAllFiles(); // Call the function whenever the search input changes
    });
  
    getAllFiles(); // Initial call to fetch and display files
  });
  
  async function getAllFiles() {
    const response = await fetch(`http://localhost:3000/api/files`);
    const solutionFiles = await response.json();
  
    console.log("Fetched solution files:", solutionFiles);
  
    const solutionFilesDiv = document.getElementById('solutionFiles');
    const searchInput = document.querySelector('.search-bar input').value.toLowerCase();
  
    // Clear existing content
    solutionFilesDiv.innerHTML = '';
  
    // Get the status of each checkbox
    const allChecked = document.getElementById('all').checked;
    const csChecked = document.getElementById('computerScience').checked;
    const bussChecked = document.getElementById('business').checked;
  
    // Sort files by createdAt in descending order
    solutionFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    // Add file information to the div based on selected checkboxes and search input
    solutionFiles.forEach(function (file) {
      const fileMatchesSearch = file.originalFileName.toLowerCase().includes(searchInput);
  
      if (
        (allChecked || (csChecked && file.field === "Computer Science") || (bussChecked && file.field === "Business")) &&
        file.category === "Solution" &&
        fileMatchesSearch
      ) {
        const fileDiv = document.createElement('div');
        fileDiv.style = "border: 2px solid #01858D; width: 700px; margin-top: 50px; border-radius: 5px 5px 5px 5px;";
        fileDiv.innerHTML = `
          <p style="margin-left: 10px"><span style="color: #01858D">File:</span> ${file.originalFileName}</p>
          <div style="height: 40px; width: 70px; float: right; margin-top: -35px">
            <p style="font-size: 14px; color: #01858D">${file.category}</p>
          </div>
          <p style="margin-left: 10px"><span style="color: #01858D">Uploader:</span> ${file.uploaderUsername}</p>
          <p style="margin-left: 10px"><span style="color: #01858D">Field:</span> ${file.field}</p>
        `;
  
        // Add a click event listener to open the file
        fileDiv.addEventListener('click', function () {
          openFile(file);
        });
  
        solutionFilesDiv.appendChild(fileDiv);
      }
    });
  }  
  
  function openFile(file) {
    if (!file || !file._id) {
      console.error('Invalid file object or file ID.');
      return;
    }
  
    window.open(`http://localhost:3000/api/files/${file._id}`, '_blank');
  }
  

  const logout = document.getElementById("logout");
  logout.addEventListener("click", function () {
      window.localStorage.removeItem("token");
      window.location.href = "./login.html";
  });