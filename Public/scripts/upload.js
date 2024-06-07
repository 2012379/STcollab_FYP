document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll('.field-checkbox');

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxes.forEach(function(otherCheckbox) {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });

    const checkboxes_1 = document.querySelectorAll('.field-checkbox-1');

    checkboxes_1.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                checkboxes_1.forEach(function(otherCheckbox) {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });

    // Set the username value in the hidden input field
    const usernameInput = document.getElementById('username');
    const storedUsername = window.localStorage.getItem('username');
    if (storedUsername) {
        usernameInput.value = storedUsername;
    }
});

const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
});
