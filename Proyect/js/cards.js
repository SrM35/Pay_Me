document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado correctamente');

    const button = document.getElementById('add-card-btn');
    if (!button) {
        console.error('El botón "add-card-btn" no se encontró.');
        return;
    }

    button.addEventListener('click', async function () {
        console.log('Se hizo clic en el botón');

        const balance = document.getElementById('balance').value;
        const numberCard = document.getElementById('card-number').value;
        const nameCardOwner = document.getElementById('name').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const securityNumbers = document.getElementById('cvv').value;

       
        if (!balance || !numberCard || !nameCardOwner || !expirationDate || !securityNumbers) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const idAccount = localStorage.getItem('idAccount');
        if (!idAccount) {
            console.error('Account ID no encontrado en localStorage.');
            alert('Error: No se encontró el Account ID.');
            return;
        }

        try {
            console.log('Enviando datos al backend:', {
                balance,
                numberCard,
                nameCardOwner,
                expirationDate,
                securityNumbers,
                idAccount
            });

            const response = await fetch('http://localhost:3000/addCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    balance,
                    numberCard,
                    nameCardOwner,
                    expirationDate,
                    securityNumbers,
                    idAccount
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (response.ok) {
                alert('Tarjeta agregada exitosamente');
                window.location.href = 'dashboard.html';
            } else {
                alert('Error al agregar tarjeta: ' + data.message);
            }
        } catch (err) {
            console.error('Error en la solicitud:', err);
            alert('Error al procesar la solicitud.');
        }
    });
});
