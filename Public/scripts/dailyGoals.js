const addGoal = async () => {
    try{
        const goal = document.getElementById("goal").value; 
        const room_code = window.localStorage.getItem("RoomCode");

        if (!goal) {
            throw new Error("Goal is required"); 
        }

        const response = await fetch("/api/dailyGoals", { 
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({ room_code, goal })
        });

        if (!response.ok){
            throw new Error("Failed To Add Goal")
        }

        alert("Goal Added Successfully");

        window.location.href = "../html/dailyGoals.html"; 
    }
    catch(error){
        console.error("Error adding goal:", error.message);
        alert("Failed to Add Goal. Please try again later.");
    }
};

const displayGoals = async () => {
    try {
        const roomNumber = window.localStorage.getItem("RoomCode");

        const response = await fetch("/api/goals/allgoals");

        if(!response.ok){
            throw new Error("Failed To Fetch Tasks");
        }

        const goals = await response.json();
        console.log("Received goals:", goals);

        const goalListELement = document.getElementById("displayGoals");
        goalListELement.innerHTML = "";

        goals.forEach(goal => {
            if(goal.room_code === parseInt(roomNumber)) {
                const goalItem = document.createElement("div");
                goalItem.style = "border: 2px solid #01858D; margin-top: 5%; margin-left: 1%; margin-right: 1%; border-radius: 5px 5px 5px 5px; text-align: left;"
                goalItem.classList.add("goal-item");
                goalItem.id = `task-${goal._id}`;
                goalItem.innerHTML = `
                <div style="margin-left: 1%; font-size: 18px;"><span style="color: #01858D">Task:</span> ${goal.goal}</div>
                <div style="margin-left: 1%; font-size: 18px"><span style="color: #01858D">Status:</span> <span class="goal-status">${goal.status}</span></div>
                <div style= "display: flex; flex-direction: row; margin-top: 2%; margin-bottom: 1%;">
                <button onclick="removeGoal('${goal._id}');" style="background-color: red; color: white; border-color: red; border-radius: 5px 5px 5px 5px; margin-left: 1%;">Remove</button>
                <button onclick="completeGoal('${goal._id}');" style="background-color: #01858D; color: white; border-color: #01858D; border-radius: 5px 5px 5px 5px; margin-left: 5%;">Mark As Done</button>
                </div>
            `;
            goalListELement.appendChild(goalItem);
            }
        }) 
    }
    catch (error) {
        console.error("Error:", error.message);
        alert("Failed To Get Goals.")
    }
    
}

const completeGoal = async (goalId) => {
    try {
        const response = await fetch(`/api/dailyGoals/turnIn/${goalId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Failed To Turn In Goal.");
        }

        const updatedGoal = await response.json();

        const goalElement = document.getElementById(`task-${goalId}`); // Change _id to goalId
        const statusElement = goalElement.querySelector('.goal-status'); // Change '.task-status' to '.goal-status'
        if (statusElement) {
            statusElement.textContent = updatedGoal.status;
        } else {
            console.error("Status element not found");
        }

        alert("Goal Turned In Successfully");
    } catch (error) {
        console.error("Error turning in goal:", error.message);
        alert("Failed to turn in goal. Please try again later.");
    }
};

document.addEventListener("DOMContentLoaded",async function (){
    try{const assignButton = document.getElementById("addGoalBtn");
    if (assignButton) {
        assignButton.addEventListener("click", addGoal);
    } else {
        console.error("Assign button not found");
    }

    await displayGoals();

}  catch(error){

}
})

const removeGoal = async (goalId) => {
    try {
        const response = await fetch(`/api/dailyGoals/${goalId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed To Remove Goal.");
        }

        const goalElement = document.getElementById(`task-${goalId}`);
        if (goalElement) {
            goalElement.remove();
        } else {
            console.error("Goal element not found");
        }

        alert("Goal Removed Successfully");
    } catch (error) {
        console.error("Error removing goal:", error.message);
        alert("Failed to remove goal. Please try again later.");
    }
};

const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        window.location.href = "./login.html";
    });
