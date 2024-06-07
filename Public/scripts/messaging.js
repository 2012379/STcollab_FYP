document.addEventListener("DOMContentLoaded", async () => {
    const socket = io("http://localhost:3000"); // Connect to the Socket.IO server
  
    const chatBox = document.getElementById("chatBox");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const username = window.localStorage.getItem("username");
    const RoomCode = window.localStorage.getItem("RoomCode");
  
    // Function to add a message to the chat box
    function addMessageToChat(sender, content) {
        const messageElement = document.createElement("div");
        messageElement.innerHTML = `<strong>${sender}: </strong>${content}`;
        chatBox.appendChild(messageElement);
        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Fetch previous messages from the server and display them
    async function loadMessages() {
        try {
            const response = await fetch(`/api/messages/${RoomCode}`);
            const messages = await response.json();
            messages.forEach(msg => {
                addMessageToChat(msg.username, msg.message);
            });
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    // Call loadMessages when the page loads
    await loadMessages();
  
    // Listen for customEvent from the server
    socket.on('customEvent', (data) => {
        console.log('Received from server:', data);
    });
  
    // Send message when sendButton is clicked
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
            addMessageToChat(username, message); // Display your own message
            socket.emit('sendMessage', { username, RoomCode, message });
            messageInput.value = "";
        }
    });
});
