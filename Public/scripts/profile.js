const full_name = document.getElementById("name");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const profession = document.getElementById("profession");
const skills = document.getElementById("skills");
const qualification = document.getElementById("qualification");
const institute = document.getElementById("institute");
const linkedin = document.getElementById("linkedin");
const description = document.getElementById("about");

const token = window.localStorage.getItem("token");

// Check if the token is available
if (!token) {
  alert("User not logged in");
  // Redirect or handle unauthorized access as needed
} else {
  // Fetch user data with the token in the Authorization header
  fetch("http://localhost:3000/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status) {
        const user = res.user;
        full_name.value = user.full_name;
        age.value = user.age;
        gender.value = user.gender;
        profession.value = user.profession;
        skills.value = user.skills;
        qualification.value = user.qualification;
        institute.value = user.institute;
        linkedin.value = user.linkedin;
        description.value = user.about;
      } else {
        alert("User Not Authorized");
        // Redirect or handle unauthorized access as needed
      }
    })
    .catch((err) => console.log(err));
}

const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  window.localStorage.removeItem("token");
  window.location.href = "./login.html";
});
