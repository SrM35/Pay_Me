document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado correctamente');

    const button = document.getElementById('add-card-btn');
    if (!button) {
        console.error('El botón "add-card-btn" no se encontró.');
        return;
    }

    button.addEventListener('click', function () {
        console.log('Se hizo clic en el botón');

        const idAccount = localStorage.getItem('idAccount');

        const balance = document.getElementById('balance').value;
        const numberCard = document.getElementById('card-number').value;
        const nameCardOwner = document.getElementById('name').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const securityNumbers = document.getElementById('cvv').value;


        if (!balance || !numberCard || !nameCardOwner || !expirationDate || !securityNumbers) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!idAccount) {
            console.error('Account ID no encontrado en localStorage.');
            alert('Error: No se encontró el Account ID.');
            return;
        }

        console.log('Enviando datos al backend:', {
            balance,
            numberCard,
            nameCardOwner,
            expirationDate,
            securityNumbers,
            idAccount
        });

        fetch('http://localhost:3000/addCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                balance: parseFloat(balance),
                numberCard: numberCard,
                nameCardOwner: nameCardOwner,
                expirationDate: expirationDate,
                securityNumbers: securityNumbers,
                idAccount: idAccount
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);

            if (data.status === 200) {
                alert('Tarjeta agregada exitosamente');
                window.location.href = 'dashboard.html';
            } else {
                alert('Error al agregar tarjeta: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Error en la solicitud:', err);
            alert('Error al procesar la solicitud.');
        });
    });
});
const usernameElement = document.querySelector('.cta1');
    if (usernameElement) {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameElement.textContent = savedUsername;
        }
    }