document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display query details when the page loads
  fetchQueryDetails();

  const replyButton = document.getElementById("reply-btn");
  if (replyButton) {
    replyButton.addEventListener("click", openReplyInput);
  }
});

async function fetchQueryDetails() {
  try {
    const queryId = getQueryParam("queryId");
    if (!queryId) {
      console.error("Query ID not found in URL");
      return;
    }

    const response = await fetch(`/api/getQueryDetails?queryId=${queryId}`);
    const queryDetails = await response.json();

    // Display query details on the page
    const queryDetailsContainer = document.getElementById("query-details");
    queryDetailsContainer.style =
      "border: 2px solid #01858D; width: 700px; margin-top: 80px; border-radius: 5px; margin-left: 450px; text-align: left; word-wrap: break-word;";
    if (queryDetailsContainer) {
      queryDetailsContainer.innerHTML = `
            <div>
            <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Query:</span> ${queryDetails.queryText}</p>
            <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Asker:</span> ${queryDetails.username}</p>
            </div>
            `;
    }

    // Display replies
    displayReplies(queryDetails.replies);
  } catch (error) {
    console.error("Error fetching query details:", error);
  }
}

function displayReplies(replies) {
  const repliesContainer = document.getElementById("replies");
  if (repliesContainer && replies && replies.length > 0) {
  
    repliesContainer.innerHTML = "";

    // Append each reply to the replies container
    replies.forEach((reply) => {
      const replyElement = createReplyElement(reply);
      repliesContainer.appendChild(replyElement);
    });
  }
}

function createReplyElement(reply) {
  const replyElement = document.createElement("div");
  replyElement.style =
    "border: 2px solid #01858D; width: 700px; margin-top: 40px; border-radius: 5px; margin-left: 450px; text-align: left; word-wrap: break-word;";
  replyElement.innerHTML = `
        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D"></span>${
          reply.text
        }</p>
        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Replier: </span>${
          reply.username
        }</p>
        <p style="margin-left: 10px; font-size: 18px; color: black"><span style="color: #01858D">Posted At:</span> ${new Date(
          reply.createdAt
        ).toLocaleString()}</p>
        <hr>
    `;
  return replyElement;
}

function openReplyInput() {
    const repliesContainer = document.getElementById("replies");
    if (repliesContainer) {
      // Create an outer container
      const container = document.createElement("div");

      container.style = "display: flex; flex-direction: column;"
  
      // Create the input field
      const inputField = document.createElement("input");
      inputField.setAttribute("type", "text");
      inputField.setAttribute("id", "reply-input");
      inputField.setAttribute("placeholder", "Type your reply...");
      inputField.style =
        "height: 40px; width: 700px; border: 2px solid #01858D; margin-left: 450px; margin-top: 20px; border-radius: 5px;";
  
      // Create the "Post" button
      const postButton = document.createElement("button");
      postButton.setAttribute("id", "post-btn");
      postButton.textContent = "Post";
      postButton.addEventListener("click", postReply);
      postButton.style =
        "height: 40px; width: 80px; background-color: #01858D; color: white; border-radius: 5px; border: solid #01858D; margin-top: 20px; margin-left: 980px";
  
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", closeReplyInput);
        cancelButton.style = "height: 40px; width: 80px; background-color: #E74C3C; color: white; border-radius: 5px; border: solid #E74C3C; margin-left: 1080px; margin-top: -40px";

        // Append input field, "Post" button, and "Cancel" button to the container
        container.appendChild(inputField);
        container.appendChild(postButton);
        container.appendChild(cancelButton);

      repliesContainer.appendChild(container);
    }
  }

  function closeReplyInput() {
    const repliesContainer = document.getElementById("replies");
    if (repliesContainer) {
        // Remove the outer container to close the input
        const container = repliesContainer.lastElementChild;
        if (container) {
            repliesContainer.removeChild(container);
        }
    }
}

async function postReply() {
  const replyInput = document.getElementById("reply-input");
  const queryId = getQueryParam("queryId");

  if (replyInput && queryId) {
    const replyText = replyInput.value;

    try {
      const storedUsername = window.localStorage.getItem("username");

      const response = await fetch("/api/postReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryId: queryId,
          replyText: replyText,
          username: storedUsername,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        console.log("Reply posted successfully");

        // Fetch and display updated replies
        fetchQueryDetails();
      } else {
        console.error("Error posting reply:", responseData.error);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }

    // Clear the input field after posting the reply
    replyInput.value = "";
  }
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});