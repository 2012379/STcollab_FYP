let popup = document.getElementById("popup");

function openPopup() {
  popup.classList.add("open-popup");
}

function closePopup() {
  const gigname = document.getElementById("gigname").value;
  const aboutgig = document.getElementById("aboutgig").value;
  const qualification = document.getElementById("qualification").value;
  const skills = document.getElementById("skills").value;;
  const gigfield =
    document.getElementById("gigfield").options[
      document.getElementById("gigfield").selectedIndex
    ].value;
  const gigtype =
    document.getElementById("gigtype").options[
      document.getElementById("gigtype").selectedIndex
    ].value;

  window.localStorage.setItem("gigname", gigname);
  window.localStorage.setItem("aboutgig", aboutgig);
  window.localStorage.setItem("qualification", qualification);
  window.localStorage.setItem("skills", skills);
  window.localStorage.setItem("gigfield", gigfield);
  window.localStorage.setItem("gigtype", gigtype);

  // Form submission
  document.getElementById("form").submit();

  // Close the popup
  popup.classList.remove("open-popup");
}

var handleSubmit = document.getElementById("submit_btn");

handleSubmit.addEventListener("click", function () {
  fetch("http://localhost:3000/api/gig/postGig", {
    method: "POST",
    body: JSON.stringify({
      gigname: window.localStorage.getItem("gigname"),
      aboutgig: window.localStorage.getItem("aboutgig"),
      qualification: window.localStorage.getItem("qualification"),
      skills: window.localStorage.getItem("skills"),
      gigfield: window.localStorage.getItem("gigfield"),
      gigtype: window.localStorage.getItem("gigtype"),
      username: window.localStorage.getItem("username"),
      email: window.localStorage.getItem("email")
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((res) => {
      getAllGigs();
      console.log(res);
      if (res.status) {
        alert("You have posted a gig");
        window.location.href = "./gigs.html";
      } else {
        alert(res.message);
      }
    })
    .catch((err) => console.error(err));
});

getAllGigs();

document.addEventListener("DOMContentLoaded", async function () {
  const checkboxesField = document.querySelectorAll(".field-checkbox");
  const checkboxesFilter = document.querySelectorAll(".filter-checkbox");

  checkboxesField.forEach(function (checkbox) {
    checkbox.addEventListener("change", async function () {
      checkboxesField.forEach(function (otherCheckbox) {
        if (otherCheckbox !== checkbox) {
          otherCheckbox.checked = false;
        }
      });

      // Fetch files based on selected checkboxes
      getAllGigs();
    });
  });

  checkboxesFilter.forEach(function (checkbox) {
    checkbox.addEventListener("change", async function () {
      checkboxesFilter.forEach(function (otherCheckbox) {
        if (otherCheckbox !== checkbox) {
          otherCheckbox.checked = false;
        }
      });

      // Fetch files based on selected checkboxes
      getAllGigs();
    });
  });
});

var gigs;

async function getAllGigs() {
  const response = await fetch(`http://localhost:3000/api/gig/getGigs`);
  gigs = await response.json();

  console.log("Fetched gigs:", gigs);

  const gigsDiv = document.getElementById("gigs");

  gigsDiv.innerHTML = "";

  const allCheckedField = document.getElementById("all-field").checked;
  const allCheckedFilter = document.getElementById("all-filter").checked;
  const csChecked = document.getElementById("computerScience").checked;
  const bussChecked = document.getElementById("business").checked;
  const projectChecked = document.getElementById("projects").checked;
  const researchChecked = document.getElementById("research").checked;
  
    gigs.forEach(function (gig) {
      if (allCheckedField && allCheckedFilter) {
        renderGig(gig);
      }
      else if (allCheckedField && projectChecked && gig.gigtype === 'Project'){
        renderGig(gig);
      }
      else if (allCheckedField && researchChecked && gig.gigtype === 'Research'){
        renderGig(gig);
      }
      else if (csChecked && allCheckedFilter && gig.gigfield === 'Computer Science'){
        renderGig(gig);
      }
      else if (csChecked && gig.gigfield === 'Computer Science' && projectChecked && gig.gigtype === 'Project'  ){
        renderGig(gig);
      }
      else if (csChecked && gig.gigfield === 'Computer Science' && researchChecked && gig.gigtype === 'Research'  ){
        renderGig(gig);
      }
      else if (bussChecked  && allCheckedFilter && gig.gigfield === 'Business' ){
        renderGig(gig);
      }
      else if (bussChecked && gig.gigfield === 'Business' && projectChecked && gig.gigtype === 'Project'){
        renderGig(gig);
      }
      else if (bussChecked && gig.gigfield === 'Business' && researchChecked && gig.gigtype === 'Research' ){
        renderGig(gig);
      }
  });
  
  function renderGig(gig) {
    const gigDiv = document.createElement("div");
    gigDiv.style =
      "border: 2px solid #01858D; width: 700px; margin-top: 50px; border-radius: 5px 5px 5px 5px";
    gigDiv.innerHTML = `
      <p style="margin-left: 10px"> ${gig.gigname}</p>
      <div style="height: 40px; width: 70px; float: right; margin-top: -35px">
        <p style="font-size: 14px; color: #01858D">${gig.gigtype}</p>
      </div>
      <p style="margin-left: 10px">About: ${gig.aboutgig}</p>
      <p style="margin-left: 10px">Qualification: ${gig.qualification}</p>
      <button 
        class="apply_btn" 
        onClick="applyToGig('${gig._id}', this)" 
        style="height: 40px; width: 70px; float: right; margin-right:20px; background-color: ${
          gig.applied ? '#888888' : '#01858D'
        };
        border-radius: 4px 4px 4px 4px; border: #01858D; color: white;" 
        ${gig.applied ? 'disabled' : ''}
      >
        ${gig.applied ? 'Applied' : 'Apply'}
      </button>
      <p style="margin-left: 10px">Skills: ${gig.skills}</p>
      <p style="margin-left: 10px">Field: ${gig.gigfield}</p>
    `;
    gigsDiv.appendChild(gigDiv);
  }
}  

document.addEventListener("DOMContentLoaded", function () {
  const apply = document.querySelectorAll('.apply_btn');

  apply.forEach(function (applyButton) {
    applyButton.addEventListener('click', async function () {
      try {
        // Collect user data dynamically (you need to implement this part)
        const userData = await fetchUserData();

        // Get the gig ID dynamically (you need to implement this part)
        const gigId = applyButton.dataset.gigId;

        // Send the application
        await applyToGig(gigId, userData);
        alert('Application submitted successfully!');
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Failed to submit application. Please try again later.');
      }
    });
  });
});

// Function to fetch user data from the server (you need to implement this part)
async function fetchUserData() {
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
  const response = await fetch('http://localhost:3000/api/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();
  return userData;
}

// Function to send the application to the server
// Function to send the application to the server
let isSubmitting = false; // Flag to prevent multiple submissions

// Function to fetch user data from the server (you need to implement this part)
async function fetchUserData() {
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
  const response = await fetch('http://localhost:3000/api/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();
  return userData;
}

async function applyToGig(gigId) {
  try {
    if (isSubmitting) {
      // Application is already being submitted, ignore the request
      return;
    }

    isSubmitting = true; // Set the flag to indicate that the application is being submitted

    // Collect user data dynamically (you need to implement this part)
    const userData = await fetchUserData();

    // Check if the user has already applied to this gig
    const gig = gigs.find((gig) => gig._id === gigId);

    if (gig && gig.applicants.some((applicant) => applicant.userId === userData._id)) {
      alert('You have already applied to this gig.');
      return;
    }

    // Send the application
    const response = await fetch(`http://localhost:3000/api/gig/applyToGig/${gigId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit application.');
    }

    // Notify the user about successful application
    alert('Application submitted successfully!');
  } catch (error) {
    console.error('Error submitting application:', error);
    alert('Failed to submit application. Please try again later.');
  } finally {
    isSubmitting = false; // Reset the flag after the application process is complete
  }
}

logout.addEventListener("click", function () {
  window.localStorage.removeItem("token");
  window.location.href = "./login.html";
});