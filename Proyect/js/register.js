document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-btn'); 

    createBtn.addEventListener('click', handleCreateAccount);

    async function handleCreateAccount() {
        console.log('Botón Create Account clickeado');

      
        const name = document.getElementById('first-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const balance = document.getElementById('balance').value.trim();
        const password = document.getElementById('password').value.trim();

       
        if (!validateForm(name, email, balance, password)) {
            return;
        }

      
        const accountData = {
            nameUser: name,
            emailUser: email,
            passwordUser: password,
        };
        console.log('Datos de la cuenta:', accountData);

        try {
         
            const response = await fetch('http://localhost:3000/createAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountData),
            });

           
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (result.status === 200) {
                alert('¡Cuenta creada exitosamente!');
                window.location.href = 'login.html'; 
            } else {
                alert('Error al crear cuenta. Intente de nuevo.');
            }
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
            alert('Ocurrió un error. Por favor, intente más tarde.');
        }
    }

    function validateForm(name, email, balance, password) {
        if (!name) {
            alert('Por favor, ingrese un nombre.');
            return false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Por favor, ingrese un correo válido.');
            return false;
        }
        if (!balance || isNaN(balance)) {
            alert('Por favor, ingrese un balance válido.');
            return false;
        }
        if (!password || password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        return true;
    }
});
