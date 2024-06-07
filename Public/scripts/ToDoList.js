const addToDo = async () => {
    try {
      const ToDo = document.getElementById("ToDoItem").value;
      const room_code = window.localStorage.getItem("RoomCode");
  
      if (!ToDo) {
        throw new Error("ToDo item is required");
      }
  
      const response = await fetch("/api/ToDoList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ room_code, ToDo })
      });
  
      if (!response.ok) {
        throw new Error("Failed to add ToDo");
      }
  
      alert("Added to list successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding to list:", error.message);
      alert("Failed to add to list. Please try again later.");
    }
  };
  
  const displayToDoList = async () => {
    try {
      const roomNumber = window.localStorage.getItem("RoomCode");
      const response = await fetch("/api/ToDoList/allToDo");
  
      if (!response.ok) {
        throw new Error("Failed To Fetch ToDo items");
      }
  
      const ToDoList = await response.json();
      console.log("Received ToDo items:", ToDoList);
  
      const ToDoListElement = document.getElementById("displayToDoList");
      ToDoListElement.innerHTML = "";
  
      ToDoList.forEach(ToDo => {
        if (ToDo.room_code === parseInt(roomNumber)) {
          const ToDoItem = document.createElement("div");
          ToDoItem.classList.add("ToDo-item");
          ToDoItem.id = `ToDo-${ToDo._id}`;
          ToDoItem.innerHTML = `
          <div style="border: 2px solid #01858D; margin-top: 5%; margin-left: 1%; margin-right: 1%; border-radius: 5px 5px 5px 5px; text-align: left;">
            <div style="margin-left: 1%; font-size: 18px;"><strong>Task:</strong> ${ToDo.ToDo}</div>
            <div style="margin-left: 1%; font-size: 18px;"><strong>Status:</strong> <span class="ToDo-status">${ToDo.status}</span></div>
            <div>
              <button onclick="removeToDo('${ToDo._id}');" style="background-color: red; color: white; border-color: red; border-radius: 5px 5px 5px 5px; margin-left: 1%;">Remove</button>
              <button onclick="completeToDo('${ToDo._id}');" data-action="complete" style="background-color: #01858D; color: white; border-color: #01858D; border-radius: 5px 5px 5px 5px; margin-left: 5%;">Mark As Done</button>
            </div>
            </div>
          `;
          ToDoListElement.appendChild(ToDoItem);
        }
      });
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed To Get ToDo items: " + error.message);
    }
  };

  const removeToDo = async (ToDoId) => {
    try {
      const response = await fetch(`/api/ToDoList/${ToDoId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete ToDo");
      }
  
      const deletedToDo = document.getElementById(`ToDo-${ToDoId}`);
      deletedToDo.remove();
      alert("ToDo removed successfully");
    } catch (error) {
      console.error("Error removing ToDo:", error.message);
      alert("Failed to remove ToDo. Please try again later.");
    }
  };
  
  const completeToDo = async (ToDoId) => {
    try {
      const response = await fetch(`/api/ToDoList/turnIn/${ToDoId}`, {
        method: "PUT",
      });
  
      if (!response.ok) {
        throw new Error("Failed to mark ToDo as done");
      }
  
      const updatedToDo = await response.json();
      const statusElement = document.getElementById(`ToDo-${ToDoId}`).querySelector(".ToDo-status");
      statusElement.textContent = updatedToDo.status;
  
      // Hide the "Mark As Done" button
      const completeButton = document.getElementById(`ToDo-${ToDoId}`).querySelector("button[data-action='complete']");
      completeButton.style.display = 'none';
  
      alert("ToDo marked as done successfully");
    } catch (error) {
      console.error("Error marking ToDo as done:", error.message);
      alert("Failed to mark ToDo as done. Please try again later.");
    }
  };   
  
  document.addEventListener("DOMContentLoaded", async function () {
    try {
      const addToDoButton = document.getElementById("addToDoBtn");
      if (addToDoButton) {
        addToDoButton.addEventListener("click", addToDo);
      } else {
        console.error("Add ToDo button not found");
      }
  
      await displayToDoList();
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
  
  const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        window.location.href = "./login.html";
    });