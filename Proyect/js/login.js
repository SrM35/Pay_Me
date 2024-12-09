function showAlert() {
    Swal.fire({
        title: "Google no disponible.",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url('/images/si.jpg') no-repeat center center",
        backdrop: `
            rgba(0,0,123,0.4)
            url("/images/kirby.gif")  
            left top
            no-repeat
        `
    });
}

document.getElementById('signIn-btn').addEventListener('click', async function() {
    const emailUser = document.getElementById('email').value;
    const passwordUser = document.getElementById('password').value;

    if (!emailUser || !passwordUser) {
        await Swal.fire({
            icon: "warning",
            title: "Incomplete fields",
            text: "Please enter your email and password.",
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

    if (passwordUser.length < 8) {
        await Swal.fire({
            icon: "error",
            title: "Invalid password",
            text: "The password must be at least 8 characters long.",
        });
        return;
    }

    console.log('Sending login request:', { emailUser, passwordUser });

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailUser,
                passwordUser
            })
        });

        const result = await response.json();
        console.log('Login result:', result);

        if (result.success) {
            localStorage.setItem('username', result.user.name);
            localStorage.setItem('balance', result.user.balance);
            localStorage.setItem('email', result.user.email);
            localStorage.setItem('idAccount', result.user.idAccount);

            await Swal.fire({
                title: "Login successful!",
                text: "Welcome to PAY-ME!",
                color: "#716add",
                icon: "success"
            });

            window.location.href = 'dashboard.html';
        } else {
            await Swal.fire({
                icon: "error",
                title: "Login failed",
                text: result.message || "Please try again!",
            });
        }
    } catch (error) {
        console.error('Login error:', error);

        await Swal.fire({
            icon: "error",
            title: "Server error",
            text: error.message || "An unknown error occurred.",
        });
    }
 
});
