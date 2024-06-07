var finishButton = document.getElementById("finish-btn");

finishButton.addEventListener("click", function() {

    const about = document.getElementById("description").value;

    if(about.length == 0){
      alert("Description is required")
      return
   }

    const username = window.localStorage.getItem("username")
    const email = window.localStorage.getItem("email")
    const password = window.localStorage.getItem("password")

    const full_name = window.localStorage.getItem("name")
    const age = window.localStorage.getItem("age")
    const gender = window.localStorage.getItem("gender")
    const profession = window.localStorage.getItem("prof")
    const skills = window.localStorage.getItem("skills")
    const qualification = window.localStorage.getItem("quali")
    const institute = window.localStorage.getItem("institute")
    const linkedin = window.localStorage.getItem("linkedin")

    fetch('http://localhost:3000/api/auth/register' , {
        method : 'POST',
        body : JSON.stringify({
          username,
          email,
          password,
          full_name,
          age,
          gender,
          profession,
          skills,
          qualification,
          institute,
          linkedin,
          about,
        }),
        headers : {
          'Accept' : 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res=> res.json())
      .then(res => {
        console.log(res)
        if(res.status){
          alert('you have registered')
          window.location.href = "./login.html"
        }
        else {
          alert(res.message)
        }
      })
      .catch(err => console.log(err))

});
