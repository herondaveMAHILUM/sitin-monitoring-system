document.addEventListener("DOMContentLoaded", function() {

    // ---------------- Registration ----------------
    const registerBtn = document.getElementById("registerBtn");
    if(registerBtn) {
        registerBtn.addEventListener("click", function() {
            const idNumber = document.getElementById("idNumber").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const firstName = document.getElementById("firstName").value.trim();
            const middleName = document.getElementById("middleName").value.trim();
            const courseLevel = document.getElementById("courseLevel").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const email = document.getElementById("email").value.trim();
            const course = document.getElementById("course").value;
            const address = document.getElementById("address").value.trim();

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

            fetch("register.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `idNumber=${idNumber}&lastName=${lastName}&firstName=${firstName}&middleName=${middleName}&courseLevel=${courseLevel}&course=${course}&email=${email}&password=${password}&address=${address}`
            })
            .then(res => res.text())
            .then(data => {
                if(data === "success"){
                    showToast("Registered successfully!", "success");
                    setTimeout(() => { window.location.href = "login.html"; }, 3000);
                } else {
                    showToast("Registration failed");
                }
            });
        });
    }

    // ---------------- Login ----------------
    const loginBtn = document.getElementById("loginBtn");
    if(loginBtn){
        loginBtn.addEventListener("click", function(){
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            fetch("login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${email}&password=${password}`
            })
            .then(res => res.text())
            .then(data => {
                if(data === "admin"){
                    window.location.href = "admin-dashboard.html";
                } else if(data === "user"){
                    window.location.href = "user-dashboard.html";
                } else {
                    showToast("Invalid login!", "danger");
                }
            });
        });
    }

    // ---------------- Dashboard / Edit Profile ----------------
    const studentName = document.getElementById("studentName");
    if(studentName) {

        function loadUserInfo() {
            fetch("get-user.php")
            .then(res => res.json())
            .then(data => {
                if(data.error) return showToast(data.error);

                // Dashboard info
                studentName.innerText = data.name;
                document.getElementById("studentCourse").innerText = data.course;
                document.getElementById("studentYear").innerText = data.year;
                document.getElementById("studentEmail").innerText = data.email;
                document.getElementById("studentAddress").innerText = data.address;
                document.getElementById("studentSessions").innerText = data.sessions;

                // Edit Profile fields
                const idNumberInput = document.getElementById("idNumber");
                if(idNumberInput){
                    const fields = ["idNumber","lastName","firstName","middleName","courseLevel","password","confirmPassword","email","course","address"];
                    document.getElementById("idNumber").value = data.id_number || "";
                    document.getElementById("lastName").value = data.last_name || "";
                    document.getElementById("firstName").value = data.first_name || "";
                    document.getElementById("middleName").value = data.middle_name || "";
                    document.getElementById("courseLevel").value = data.course_level || "";
                    document.getElementById("password").value = data.password || "";
                    document.getElementById("confirmPassword").value = data.password || "";
                    document.getElementById("email").value = data.email || "";
                    document.getElementById("course").value = data.course || "";
                    document.getElementById("address").value = data.address || "";

                    // Disable all fields initially
                    fields.forEach(f => document.getElementById(f).setAttribute("disabled","true"));
                }
            });
        }

        loadUserInfo(); // initial load

        const editBtn = document.getElementById("editBtn");
        if(editBtn){
            let isEditing = false;
            const fields = ["idNumber","lastName","firstName","middleName","courseLevel","password","confirmPassword","email","course","address"];

            editBtn.addEventListener("click", function(){
                if(!isEditing){
                    fields.forEach(f => document.getElementById(f).removeAttribute("disabled"));
                    editBtn.innerText = "Save Changes";
                    showToast("You can now edit your profile.", "success");
                    isEditing = true;
                } else {
                    const idNumber = document.getElementById("idNumber").value.trim();
                    const lastName = document.getElementById("lastName").value.trim();
                    const firstName = document.getElementById("firstName").value.trim();
                    const middleName = document.getElementById("middleName").value.trim();
                    const courseLevel = document.getElementById("courseLevel").value;
                    const password = document.getElementById("password").value;
                    const confirmPassword = document.getElementById("confirmPassword").value;
                    const email = document.getElementById("email").value.trim();
                    const course = document.getElementById("course").value;
                    const address = document.getElementById("address").value.trim();

                    if(password !== confirmPassword) return showToast("Passwords do not match", "danger");

                    fetch("update-user.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: `idNumber=${idNumber}&lastName=${lastName}&firstName=${firstName}&middleName=${middleName}&courseLevel=${courseLevel}&password=${password}&email=${email}&course=${course}&address=${address}`
                    })
                    .then(res => res.text())
                    .then(data => {
                        if(data === "success"){
                            showToast("Profile updated successfully!", "success");
                            fields.forEach(f => document.getElementById(f).setAttribute("disabled","true"));
                            editBtn.innerText = "Edit Profile";
                            isEditing = false;
                            loadUserInfo();
                        } else {
                            showToast("Update failed", "danger");
                        }
                    });
                }
            });
        }
    }

    // ---------------- Toast ----------------
    function showToast(message, type="danger"){
        const toastEl = document.getElementById("liveToast");
        if(!toastEl) return;
        const toastBody = document.getElementById("toastBody");
        toastBody.innerText = message;
        toastEl.className = `toast align-items-center text-bg-${type} border-0`;
        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
    }
});