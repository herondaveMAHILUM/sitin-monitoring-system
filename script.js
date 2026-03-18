    document.addEventListener("DOMContentLoaded", function () {

        const toastElement = document.getElementById("liveToast");
        const toastBody = document.getElementById("toastBody");
        const toast = new bootstrap.Toast(toastElement);

        function showToast(message, type = "danger") {
            toastElement.className = `toast align-items-center text-bg-${type} border-0`;
            toastBody.innerText = message;
            toast.show();
        }

        // REGISTER
        const registerBtn = document.getElementById("registerBtn");

        if (registerBtn) {
            registerBtn.addEventListener("click", function () {

                const data = {
                    idNumber: document.getElementById("idNumber").value,
                    lastName: document.getElementById("lastName").value,
                    firstName: document.getElementById("firstName").value,
                    middleName: document.getElementById("middleName").value,
                    courseLevel: document.getElementById("courseLevel").value,
                    course: document.getElementById("course").value,
                    email: document.getElementById("email").value,
                    address: document.getElementById("address").value,
                    password: document.getElementById("password").value,
                    confirmPassword: document.getElementById("confirmPassword").value
                };

                // FRONTEND VALIDATION
                if (!data.idNumber) return showToast("ID Number is required");
                if (!data.lastName) return showToast("Last name is required");
                if (!data.firstName) return showToast("First name is required");
                if (!data.courseLevel) return showToast("Course level is required");
                if (!data.course) return showToast("Course is required");
                if (!data.email) return showToast("Email is required");
                if (!data.address) return showToast("Address is required");
                if (!data.password) return showToast("Password is required");
                if (data.password !== data.confirmPassword) return showToast("Passwords do not match");

                fetch("register.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(data)
                })
                .then(res => res.json())
                .then(res => {
                    if (res.status === "success") {
                        showToast(res.message, "success");
                        setTimeout(() => window.location.href = "login.html", 1500);
                    } else {
                        showToast(res.message);
                    }
                });
            });
        }

        // LOGIN
        const loginBtn = document.getElementById("loginBtn");

        if (loginBtn) {
            loginBtn.addEventListener("click", function () {
                const email = document.getElementById("loginEmail").value;
                const password = document.getElementById("loginPassword").value;

                if (!email) return showToast("Email is required");
                if (!password) return showToast("Password is required");

                fetch("login.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ email, password })
                })
                .then(res => res.json())
                .then(res => {
                    if (res.status === "success") {
                        // store user object in localStorage
                        localStorage.setItem("userData", JSON.stringify(res.user));
                        localStorage.setItem("userRole", res.role);

                        showToast(res.message, "success");

                        setTimeout(() => {
                            // redirect based on role
                            if (res.role === "admin") {
                                window.location.href = "admin-dashboard.html";
                            } else {
                                window.location.href = "user-dashboard.html";
                            }
                        }, 1500);
                    } else {
                        showToast(res.message);
                    }
                });
            });
        }

    });