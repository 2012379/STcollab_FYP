let create_btn = document.getElementById("create");
let join_btn = document.getElementById("join");

create_btn.addEventListener("click", function() {
    window.location.href = "../html/createRoom.html"
});

join_btn.addEventListener("click", function() {
    window.location.href = "../html/joinRoom.html"
})

const logout = document.getElementById("logout");
    logout.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        window.location.href = "./login.html";
    });