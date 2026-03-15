function showToast(message, type="danger") {
    const toastEl = document.getElementById("liveToast");
    const toastBody = document.getElementById("toastBody");

    toastBody.innerText = message;
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;

    const toast = new bootstrap.Toast(toastEl, { delay: 4000 }); // auto-hide after 4s
    toast.show();
}

document.querySelector(".btn-success").addEventListener("click", function(){

    // Get values
    const idNumber = document.getElementById("idNumber").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const courseLevel = document.getElementById("courseLevel").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value;
    const address = document.getElementById("address").value.trim();

    // Validation top-to-bottom
    if(!idNumber) return showToast("ID Number cannot be blank");
    if(!/^[0-9]+$/.test(idNumber)) return showToast("ID Number must be numeric");

    if(!lastName) return showToast("Last Name cannot be blank");
    if(!firstName) return showToast("First Name cannot be blank");

    if(!courseLevel) return showToast("Please select a course level");

    if(!password) return showToast("Password cannot be blank");
    if(password.length < 6) return showToast("Password must be at least 6 characters");
    if(password !== confirmPassword) return showToast("Passwords do not match");

    if(!email) return showToast("Email cannot be blank");
    if(!/\S+@\S+\.\S+/.test(email)) return showToast("Email is invalid");

    if(!course) return showToast("Please select a course");
    if(!address) return showToast("Address cannot be blank");

    // All valid
    showToast("All inputs are valid!", "success");
});