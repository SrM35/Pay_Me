ddocument.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado correctamente');

    const button = document.getElementById('add-card-btn');
    if (button) {
        console.log('Botón encontrado:', button);

        button.addEventListener('click', async function () {
            console.log('Se hizo clic en el botón');

            const balance = document.getElementById('balance').value.trim();
            const numberCard = document.getElementById('numberCard').value.trim();
            const nameCardOwner = document.getElementById('nameCardOwner').value.trim();
            const expirationDate = document.getElementById('expirationDate').value.trim();
            const securityNumbers = document.getElementById('securityNumbers').value.trim();

            if (!balance || !numberCard || !nameCardOwner || !expirationDate || !securityNumbers) {
                console.error('Todos los campos deben ser completados.');
                return;
            }

            const idAccount = localStorage.getItem('idAccount');
            if (!idAccount) {
                console.error('Account ID no encontrado en localStorage.');
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

                const response = await fetch('/addCard', {
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
                } else {
                    alert('Error al agregar tarjeta: ' + data.message);
                }
            } catch (err) {
                console.error('Error en la solicitud:', err);
                alert('Error al procesar la solicitud.');
            }
        });
    } else {
        console.error('El botón "add-card-btn" no se encontró.');
    }
});
