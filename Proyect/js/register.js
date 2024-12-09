document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create-btn').addEventListener('click', async function() {
        const nameUser = document.getElementById('first-name').value;
        const balance = document.getElementById('balance').value;
        const emailUser = document.getElementById('email').value;
        const passwordUser = document.getElementById('password').value;

     
        if (!nameUser || !balance || !emailUser || !passwordUser) {
            await Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor, completa todos los campos para continuar.",
            });
            return;
        }

     
        const namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(nameUser)) {
            await Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "El nombre no debe contener números.",
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

       
        const balanceValue = parseFloat(balance);
        if (isNaN(balanceValue) || balanceValue < 8) {
            await Swal.fire({
                icon: "error",
                title: "Balance inválido",
                text: "El balance debe ser un número mayor o igual a 8.",
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
                    title: "¡Cuenta creada exitosamente!",
                    text: "Ahora puedes iniciar sesión.",
                    icon: "success",
                });

         
                localStorage.setItem('username', nameUser);
                localStorage.setItem('balance', balanceValue.toFixed(2));
                localStorage.setItem('email', emailUser);

                console.log('Datos guardados en localStorage:');
                console.log('Username:', localStorage.getItem('username'));
                console.log('Balance:', localStorage.getItem('balance'));
                console.log('Email:', localStorage.getItem('email'));

               
                window.location.href = 'login.html';
            } else {
        
                await Swal.fire({
                    icon: "error",
                    title: "Error al crear la cuenta",
                    text: result.message || "Ocurrió un problema. Intenta de nuevo.",
                });
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);

      
            await Swal.fire({
                icon: "error",
                title: "Error en el servidor",
                text: error.message || "Ocurrió un error desconocido.",
            });
        }
    });

    document.getElementById('signIn-btn').addEventListener('click', function() {
        Swal.fire({
            icon: "info",
            title: "Iniciar sesión",
            text: "Esta funcionalidad no está implementada aún.",
        });
    });
});
