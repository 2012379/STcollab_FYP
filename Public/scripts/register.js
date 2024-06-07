var registerButton = document.getElementById("register-btn");

registerButton.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (username.length == 0) {
        alert("Username is required");
        return;
    }

    if (email.length == 0) {
        alert("Email is required");
        return;
    }

    if (password.length == 0) {
        alert("Password is required");
        return;
    }

    // Check if username and email are unique
    fetch('http://localhost:3000/api/auth/checkUnique', {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        if (res.status) {
            // If username and email are unique and email is valid, proceed to info.html
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("email", email);
            window.localStorage.setItem("password", password);
            window.location.href = "./info.html";
        } else {
            // If username or email is not unique, or email is invalid, show an error message
            alert(res.message);
        }
    })
    .catch(err => console.log(err));
});