document.addEventListener('DOMContentLoaded', () => {
    const createRoomBtn = document.getElementById('create');
    
    createRoomBtn.addEventListener('click', async () => {
      const roomNameInput = document.getElementById('name');
      const roomName = roomNameInput.value.trim();
      const user = window.localStorage.getItem("username")
      const user_email = window.localStorage.getItem("email");
  
      if (roomName === '') {
        alert('Please enter a room name');
        return;
      }
  
      try {
        const response = await fetch('/api/createRoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ roomName, user_email, user })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Room created successfully');
          console.log(data.room); 
        } else {
          alert(data.error || 'Failed to create room');
        }
      } catch (error) {
        console.error('Error creating room:', error);
        alert('An error occurred while creating the room');
      }

      window.location.href = "../html/createRoom.html"
    });
  });
  
  const logout = document.getElementById("logout");
  logout.addEventListener("click", function () {
      window.localStorage.removeItem("token");
      window.location.href = "./login.html";
  });