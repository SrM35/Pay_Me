document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create-btn').addEventListener('click', function() {
       
        const nameUser = document.getElementById('first-name').value;
        const balance = parseFloat(document.getElementById('balance').value);
        const emailUser = document.getElementById('email').value;
        const passwordUser = document.getElementById('password').value;

        
        if (!nameUser || isNaN(balance) || !emailUser || !passwordUser) {
            alert('Por favor completa todos los campos.');
            return;
        }

        fetch('http://localhost:3000/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nameUser,
                balance,
                emailUser,
                passwordUser
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la creación de la cuenta');
            }
            return response.json();
        })
        .then(result => {
            alert('Cuenta creada exitosamente!');
            localStorage.setItem('username', nameUser);
            localStorage.setItem('balance', balance.toFixed(2));
            
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    });

    document.getElementById('signIn-btn').addEventListener('click', function() {
        alert('Iniciar sesión (esta funcionalidad no está implementada aún)');
    });
});