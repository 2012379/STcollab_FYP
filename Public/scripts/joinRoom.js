document.addEventListener("DOMContentLoaded", function () {
    const joinRoomBtn = document.getElementById("join");

    joinRoomBtn.addEventListener("click", async function () {
        const roomNumber = document.getElementById("roomNumber").value;
        const username = localStorage.getItem("username"); // Get username from localStorage

        if (!(/^\d{4}$/).test(roomNumber)) {
            alert("Please enter a 4-digit room number.");
            return;
        }

        try {
            const response = await fetch(`/api/room/${roomNumber}?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                window.localStorage.setItem("RoomCode", roomNumber);
                window.location.href = "/html/Room.html";
            } else {
                alert("Room does not exist. Please enter a valid room number.");
            }
        } catch (error) {
            console.error("Error checking room:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});

const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});