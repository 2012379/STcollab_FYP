// Function to get file extension
function getFileExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
}

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

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const roomNumber = window.localStorage.getItem("RoomCode");

        if (!roomNumber) {
            alert("Room number not found. Please join a room first.");
            return;
        }

        const response = await fetch(`/api/room/${roomNumber}`);
        if (!response.ok) {
            throw new Error("Room does not exist. Please enter a valid room number.");
        }

        const roomData = await response.json();
        const roomNameElement = document.getElementById("roomName");
        if (roomNameElement) {
            roomNameElement.textContent = roomData.name;
        } else {
            console.error("Room name element not found");
        }

        const dropdownMenu = document.getElementById("assignedUser");
        if (dropdownMenu) {
            roomData.users.forEach(user => {
                const option = document.createElement("option");
                option.value = user;
                option.textContent = user;
                dropdownMenu.appendChild(option);
            });
        } else {
            console.error("Dropdown menu not found");
        }

        const assignButton = document.getElementById("assignTaskBtn");
        if (assignButton) {
            assignButton.addEventListener("click", assignTask);
        } else {
            console.error("Assign button not found");
        }

        await displayTasks();
        displayUploadedFiles(); // Call the function here

    } catch (error) {
        console.error("Error during DOMContentLoaded:", error);
        alert("An error occurred during page load. Please try again later.");
    }
});

async function assignTask() {
    try {
        const taskInput = document.getElementById("task");
        const assignedUserDropdown = document.getElementById("assignedUser");
        const task = taskInput.value;
        const assignedUser = assignedUserDropdown.value;

        if (!task || !assignedUser) {
            alert("Please fill out both the task and the user to assign it to.");
            return;
        }

        const roomNumber = window.localStorage.getItem("RoomCode");

        // Update the endpoint to match the server endpoint
        const response = await fetch(`/api/task/assign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ room_code: roomNumber, task, assignedTo: assignedUser })
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Error data:', errorData);
            throw new Error("Failed to assign task. Please try again.");
        }

        alert("Task assigned successfully!");
        taskInput.value = "";
        assignedUserDropdown.selectedIndex = 0;

        await displayTasks();
    } catch (error) {
        console.error("Error during task assignment:", error);
        alert("An error occurred while assigning the task. Please try again later.");
    }
}

const displayTasks = async () => {
    try {
        const roomNumber = window.localStorage.getItem("RoomCode");

        const response = await fetch("/api/task/allTasks");
        if (!response.ok) {
            throw new Error("Failed to fetch tasks.");
        }

        const tasks = await response.json();

        const taskListElement = document.getElementById("taskList");
        taskListElement.innerHTML = ""; 

        tasks.forEach(task => {
            
            if (task.room_code === parseInt(roomNumber)) {

                const taskItem = document.createElement("div");
                taskItem.style = "border: 2px solid #01858D; margin-top: 1%; margin-left: 1%; margin-right: 1%; border-radius: 5px 5px 5px 5px; text-align: left;"
                taskItem.classList.add("task-item");
                taskItem.id = `task-${task._id}`;
                taskItem.innerHTML = `
                    <div style="margin-left: 1%; font-size: 18px;"><span style="color: #01858D">Task:</span> ${task.task}</div>
                    <div style="margin-left: 1%; font-size: 18px"><span style="color: #01858D">Assigned to:</span> ${task.assignedTo}</div>
                    <div style="margin-left: 1%; font-size: 18px"><span style="color: #01858D">Status:</span> <span class="task-status">${task.status}</span></div>
                    <div style= "display: flex; flex-direction: row; margin-top: 2%; margin-bottom: 1%;">
                        <button style="background-color: red; color: white; border-color: red; border-radius: 5px 5px 5px 5px; margin-left: 1%;" onclick="turnInTask('${task._id}');">Turn In</button>
                        <button style="background-color: #01858D; color: white; border-color: #01858D; border-radius: 5px 5px 5px 5px; margin-left: 5%;" onclick="removeTask('${task._id}');">Remove Task</button>
                    </div>
                `;
                taskListElement.appendChild(taskItem);
            }
        });

    } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred. Please try again later.");
    }
};


const removeTask = async (taskId) => {
    try {
        // Send a request to delete the task from the server
        const response = await fetch(`/api/task/${taskId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to remove task.");
        }

        const taskElement = document.getElementById(`task-${taskId}`);
        if (taskElement) {
            taskElement.remove();
        } else {
            console.error("Task element not found");
        }

        alert("Task removed successfully.");
    } catch (error) {
        console.error("Error removing task:", error.message);
        alert("Failed to remove task. Please try again later.");
    }
};


const turnInTask = async (taskId) => {
    try {
        const response = await fetch(`/api/task/turnIn/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to turn in task.");
        }

        const updatedTask = await response.json();
        // Update the task status in the DOM
        const taskElement = document.getElementById(`task-${updatedTask._id}`);
        const statusElement = taskElement.querySelector('.task-status');
        if (statusElement) {
            statusElement.textContent = updatedTask.status;
        } else {
            console.error("Status element not found");
        }

        alert("Task turned in successfully.");
    } catch (error) {
        console.error("Error turning in task:", error.message);
        alert("Failed to turn in task. Please try again later.");
    }
};

// Ensure displayUploadedFiles can use getFileExtension
function displayUploadedFiles() {
    fetch("/api/get_uploaded_files")
        .then((response) => response.json())
        .then((data) => {
            const filesContainer = document.getElementById("files-container");
            filesContainer.innerHTML = ""; // Clear existing files

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

const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});
