document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('signIn-btn'); 


    signInBtn.addEventListener('click', handleSignIn);

    async function handleSignIn() {
        console.log('Botón Sign In clickeado'); 

       
        const email = document.getElementById('email').value.trim(); 
        const password = document.getElementById('password').value; 

        
        if (!validateForm(email, password)) {
            return;
        }

      
        const loginData = {
            email,
            password,
        };
        console.log('Datos de inicio de sesión:', loginData); 

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
        
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
        
            if (result.success) {
                alert('¡Inicio de sesión exitoso!');
                window.location.href = '/dashboard.html';
            } else {
                alert(result.message || 'Credenciales incorrectas. Por favor, intente de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un problema al procesar su solicitud.');
        }
        

    function validateForm(email, password) {
      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return false;
        }

        
        if (!password) {
            alert('Por favor, ingrese una contraseña.');
            return false;
        }

        return true; 
    }
}});
