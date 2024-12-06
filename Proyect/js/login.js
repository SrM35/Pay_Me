document.getElementById('signIn-btn').addEventListener('click', function() {
    const emailUser = document.getElementById('email').value;
    const passwordUser = document.getElementById('password').value;
  
    if (!emailUser || !passwordUser) {
        alert('Por favor ingresa tu email y contraseña.');
        return;
    }
  
    console.log('Enviando solicitud de login:', { emailUser, passwordUser });
  
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emailUser,
            passwordUser
        })
    })
    .then(response => {
        console.log('Respuesta recibida:', response);
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(result => {
        
        console.log('Resultado del login:', result);
        if (result.success) {
            localStorage.setItem('username', result.user.name);
            localStorage.setItem('balance', result.user.balance)
            localStorage.setItem('email', result.user.email);
            localStorage.setItem('idAccount', result.user.idAccount);   

            alert('Inicio de sesión exitoso!');
            window.location.href = 'dashboard.html';
        
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        console.error('Error en el login:', error);
        alert('Error: ' + (error.message || 'Ocurrió un error desconocido'));
    });});