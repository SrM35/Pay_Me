document.getElementById('signIn-btn').addEventListener('click', async function() {
    const emailUser = document.getElementById('email').value;
    const passwordUser = document.getElementById('password').value;

   
    if (!emailUser || !passwordUser) {
        await Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor, ingresa tu email y contraseña.",
        });
        return;
    }

    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailUser)) {
        await Swal.fire({
            icon: "error",
            title: "Correo inválido",
            text: "Por favor, ingresa un correo electrónico válido.",
        });
        return;
    }

    
    if (passwordUser.length < 8) {
        await Swal.fire({
            icon: "error",
            title: "Contraseña inválida",
            text: "La contraseña debe tener al menos 8 caracteres.",
        });
        return;
    }

    console.log('Enviando solicitud de login:', { emailUser, passwordUser });

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
        console.log('Resultado del login:', result);

        if (result.success) {
            localStorage.setItem('username', result.user.name);
            localStorage.setItem('balance', result.user.balance);
            localStorage.setItem('email', result.user.email);
            localStorage.setItem('idAccount', result.user.idAccount);

            await Swal.fire({
                title: "Inicio de sesión exitoso!",
                text: "Bienvenido a PAY-ME!",
                icon: "success"
            });

            window.location.href = 'dashboard.html';
        } else {
            await Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: result.message || "Intenta de nuevo!",
            });
        }
    } catch (error) {
        console.error('Error en el login:', error);

        await Swal.fire({
            icon: "error",
            title: "Error en el servidor",
            text: error.message || "Ocurrió un error desconocido.",
        });
    }
});
