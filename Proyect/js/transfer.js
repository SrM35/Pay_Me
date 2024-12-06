document.getElementById('make-transfer-btn').addEventListener('click', function(event) {
    event.preventDefault(); 

    const recipientEmail = document.getElementById('recipient-email').value;
    const transferAmount = parseFloat(document.getElementById('transfer-amount').value);
    const transferMessage = document.getElementById('transfer-message').value;

   
    if (!recipientEmail || !transferAmount || transferAmount <= 0) {
        alert('Por favor, completa todos los campos requeridos con valores válidos.');
        return;
    }

    console.log('Enviando datos de transferencia:', {
        emailUser_destiny: recipientEmail,
        amountTransfer: transferAmount,
        messageTransfer: transferMessage
    });

   
    fetch('http://localhost:3000/transfere', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emailUser_destiny: recipientEmail,
            amountTransfer: transferAmount,
            messageTransfer: transferMessage
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Respuesta del servidor:', result);
        if (result.status === 200) {
            alert(result.message);
            document.getElementById('recipient-email').value = '';
            document.getElementById('transfer-amount').value = '';
            document.getElementById('transfer-message').value = '';
        } else {
            alert(result.message || 'Error en la transferencia.');
        }
    })
    .catch(error => {
        console.error('Error al realizar la transferencia:', error);
        alert('Ocurrió un error al conectarse al servidor.');
    });
});
