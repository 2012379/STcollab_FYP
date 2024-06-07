var loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", function() {
    const loginIdentifier = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('http://localhost:3000/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                loginIdentifier, 
                password,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.token) {
                window.localStorage.setItem('token', res.token);
                alert('You Have Logged In');
                window.location.href = "../html/home.html";
            }
        })
        .catch(err => console.log(err));
});
