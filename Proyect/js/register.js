document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create-btn').addEventListener('click', async function() {
        const nameUser = document.getElementById('first-name').value;
        const balance = document.getElementById('balance').value;
        const emailUser = document.getElementById('email').value;
        const passwordUser = document.getElementById('password').value;

        if (!nameUser || !balance || !emailUser || !passwordUser) {
            await Swal.fire({
                icon: "warning",
                title: "Incomplete fields",
                text: "Please fill in all the fields to continue.",
            });
            return;
        }

        const namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(nameUser)) {
            await Swal.fire({
                icon: "error",
                title: "Invalid name",
                text: "The name should not contain numbers.",
            });
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailUser)) {
            await Swal.fire({
                icon: "error",
                title: "Invalid email",
                text: "Please enter a valid email address.",
            });
            return;
        }

        const balanceValue = parseFloat(balance);
        if (isNaN(balanceValue) || balanceValue < 8) {
            await Swal.fire({
                icon: "error",
                title: "Invalid balance",
                text: "The balance must be a number equal to or greater than 8.",
            });
            return;
        }

        if (passwordUser.length < 8) {
            await Swal.fire({
                icon: "error",
                title: "Invalid password",
                text: "The password must be at least 8 characters long.",
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/createAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nameUser,
                    balance: balanceValue,
                    emailUser,
                    passwordUser,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                await Swal.fire({
                    title: "Account created successfully!",
                    text: "You can now log in.",
                    icon: "success",
                });

                localStorage.setItem('username', nameUser);
                localStorage.setItem('balance', balanceValue.toFixed(2));
                localStorage.setItem('email', emailUser);

                console.log('Data saved in localStorage:');
                console.log('Username:', localStorage.getItem('username'));
                console.log('Balance:', localStorage.getItem('balance'));
                console.log('Email:', localStorage.getItem('email'));

                window.location.href = 'login.html';
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Error creating account",
                    text: result.message || "An issue occurred. Please try again.",
                });
            }
        } catch (error) {
            console.error('Error creating account:', error);

            await Swal.fire({
                icon: "error",
                title: "Server error",
                text: error.message || "An unknown error occurred.",
            });
        }
    });

    document.getElementById('signIn-btn').addEventListener('click', function() {
        Swal.fire({
            icon: "info",
            title: "Sign in",
            text: "This functionality is not implemented yet.",
        });
    });
});
