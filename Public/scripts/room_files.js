const fileInput = document.getElementById("file");
const addBtn = document.getElementById("add-btn");
const roomCode = window.localStorage.getItem("RoomCode");
const uploaderUsername = window.localStorage.getItem("username");

const fileIcons = {
    pdf: "../images/pdf-icon.png",
    doc: "../images/word-icon.png",
    docx: "../images/word.png",
    xls: "../images/excel-icon.png",
    xlsx: "../images/excel-icon.png",
    ppt: "../images/powerpoint-icon.png",
    pptx: "../images/powerpoint-icon.png",
    jpg: "../images/image-icon.png",
    jpeg: "../images/image-icon.png",
    png: "../images/png-icon.png",
    gif: "../images/image-icon.png",
    default: "../images/file-icon.png" 
};

function getFileExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
}

function displayUploadedFiles() {
  fetch("/api/get_uploaded_files")
      .then((response) => response.json())
      .then((data) => {
          const filesContainer = document.getElementById("files-container");
          filesContainer.innerHTML = ""; 

          data.forEach((file) => {
              const fileElement = document.createElement("div");
              fileElement.classList.add("file-item");

              const fileName = document.createElement("span");
              fileName.textContent = file.originalFileName;

              const fileIcon = document.createElement("img");
              const fileExtension = getFileExtension(file.originalFileName);
              fileIcon.src = fileIcons[fileExtension] || fileIcons.default; 
              fileIcon.alt = "File Icon";

              fileElement.addEventListener("click", () => {
                window.open(`/api/upload_room_files/${file._id}`, "_blank");
              });

              fileElement.appendChild(fileIcon);
              fileElement.appendChild(fileName);

              filesContainer.appendChild(fileElement);
          });
      })
      .catch((error) => console.error("Error fetching uploaded files:", error));
}

addBtn.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("room_code", roomCode);
        formData.append("uploader_username", uploaderUsername);

        fetch("/api/upload_room_files", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                displayUploadedFiles(); 
            })
            .catch((error) => console.error("Error:", error));
    }
});

displayUploadedFiles();

const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});