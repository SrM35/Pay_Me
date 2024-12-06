

document.getElementById('add-card-btn').addEventListener('click', async () => {
    const balance = document.getElementById('balance').value;
    const numberCard = document.getElementById('card-number').value.replace(/\s+/g, '');
    const nameCardOwner = document.getElementById('name').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const securityNumbers = document.getElementById('cvv').value;

    
    if (!balance || !numberCard || !nameCardOwner || !expirationDate || !securityNumbers) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const idAccount = localStorage.getItem('idAccount');
    if (!idAccount) {
        alert('No se ha encontrado la información de la cuenta. Por favor, inicie sesión nuevamente.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/addCard', {
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
        });

        const data = await response.json();
        if (data.status === 200) {
            alert('Tarjeta añadida exitosamente.');
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Hubo un problema al añadir la tarjeta.');
        }
        
    } catch (error) {
        console.error('Hubo un error:', error);
        alert('Hubo un problema con la solicitud.');
    }
});