var nextButton = document.getElementById("next-btn");

nextButton.addEventListener("click", function() {
    const full_name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const profession = document.getElementById("prof").value;
    const skills = document.getElementById("skills").value;
    const qualification = document.getElementById("quali").value;
    const institute = document.getElementById("institute").value;
    const linkedin = document.getElementById("linkedin").value;

    if(full_name.length == 0){
        alert("Username is required")
        return
     }

     if(age.length == 0){
        alert("Age is required")
        return
     }

     if(gender.length == 0){
        alert("Gender is required")
        return
     }

     if(profession.length == 0){
        alert("Profession is required")
        return
     }

     if(skills.length == 0){
        alert("Skills is required")
        return
     }

     if(qualification.length == 0){
        alert("Qualification is required")
        return
     }

     if(institute.length == 0){
        alert("Institute is required")
        return
     }

     if(linkedin.length == 0){
        alert("Linkedin Link is required")
        return
     }

    window.localStorage.setItem("name", full_name);
    window.localStorage.setItem("age", age);
    window.localStorage.setItem("gender", gender);
    window.localStorage.setItem("prof", profession);
    window.localStorage.setItem("skills", skills);
    window.localStorage.setItem("quali", qualification);
    window.localStorage.setItem("institute", institute);
    window.localStorage.setItem("linkedin", linkedin);
    
    window.location.href = "./info2.html"
});
