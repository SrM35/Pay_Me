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
        const numberCard = document.getElementById('card-number').value.trim();
        const nameCardOwner = document.getElementById('name').value.trim();
        const expirationDate = document.getElementById('expiration-date').value;
        const securityNumbers = document.getElementById('cvv').value.trim();

       
        if (!balance || !numberCard || !nameCardOwner || !expirationDate || !securityNumbers) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        if (!idAccount) {
            console.error('Account ID no encontrado en localStorage.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró el Account ID.',
            });
            return;
        }

        if (!/^\d{16}$/.test(numberCard)) {
            Swal.fire({
                icon: 'error',
                title: 'Número de tarjeta inválido',
                text: 'El número de tarjeta debe contener exactamente 16 dígitos y no puede tener letras.',
            });
            return;
        }

        if (!/^\d{3}$/.test(securityNumbers)) {
            Swal.fire({
                icon: 'error',
                title: 'CVV inválido',
                text: 'El CVV debe contener exactamente 3 dígitos.',
            });
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(nameCardOwner)) {
            Swal.fire({
                icon: 'error',
                title: 'Nombre inválido',
                text: 'El nombre solo debe contener letras.',
            });
            return;
        }

        console.log('Enviando datos al backend:', {
            balance,
            numberCard,
            nameCardOwner,
            expirationDate,
            securityNumbers,
            idAccount,
        });

        fetch('http://localhost:3000/addCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                balance: parseFloat(balance),
                numberCard: numberCard,
                nameCardOwner: nameCardOwner,
                expirationDate: expirationDate,
                securityNumbers: securityNumbers,
                idAccount: idAccount,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);

                if (data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Tarjeta agregada',
                        text: '¡Tu tarjeta fue agregada exitosamente!',
                    }).then(() => {
                        window.location.href = 'dashboard.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al agregar tarjeta',
                        text: data.message || 'Ocurrió un error.',
                    });
                }
            })
            .catch(err => {
                console.error('Error en la solicitud:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al procesar la solicitud.',
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
});
