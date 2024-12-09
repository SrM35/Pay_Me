document.addEventListener('DOMContentLoaded', () => {
    const transferButton = document.getElementById('make-transfer-btn');

    transferButton.addEventListener('click', () => {
        const emailUser_origin = localStorage.getItem('email');
        const recipientEmail = document.getElementById('recipient-email').value;
        const transferAmount = document.getElementById('transfer-amount').value;
        const transferMessage = document.getElementById('transfer-message').value;

        if (!emailUser_origin) {
            Swal.fire({
                icon: "error",
                title: "Usuario no autenticado",
                text: "Por favor, inicia sesión de nuevo.",
            });
            return;
        }

        if (!recipientEmail || !transferAmount|| !transferMessage) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor, llena todos los campos requeridos.",
            });
            return;
        }

        const savedBalance = parseFloat(localStorage.getItem('balance'));
        if (parseFloat(transferAmount) > savedBalance) {
            Swal.fire({
                icon: "error",
                title: "Fondos insuficientes",
                text: "No tienes suficiente saldo para realizar esta transferencia.",
            });
            return;
        }

        fetch('http://localhost:3000/transfere', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailUser_origin: emailUser_origin,
                emailUser_destiny: recipientEmail,
                amountTransfer: parseFloat(transferAmount),
                messageTransfer: transferMessage || ''
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success === true) {
                Swal.fire({
                    icon: "success",
                    title: "Transferencia exitosa",
                    text: "¡El dinero ha sido enviado correctamente!",
                }).then(() => {
                    
                    document.getElementById('recipient-email').value = '';
                    document.getElementById('transfer-amount').value = '';
                    document.getElementById('transfer-message').value = '';

                    
                    const balanceElement = document.querySelector('.total-balance div:nth-child(2)');
                    const newBalance = savedBalance - parseFloat(transferAmount);
                    localStorage.setItem('balance', newBalance.toFixed(2));
                    if (balanceElement) {
                        balanceElement.textContent = `$${newBalance.toFixed(2)}`;
                    }

                    window.location.href = 'dashboard.html';
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Transferencia fallida",
                    text: result.message || "Ocurrió un error desconocido.",
                }).then(() => {
                    return;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Error en la transferencia",
                text: "Hubo un problema al procesar tu solicitud. Intenta nuevamente.",
            });
        });
    });

    const balanceElement = document.querySelector('.total-balance div:nth-child(2)');
    if (balanceElement) {
        const savedBalance = localStorage.getItem('balance');
        if (savedBalance) {
            balanceElement.textContent = `$${parseFloat(savedBalance).toFixed(2)}`;
        }
    }

    const usernameElement = document.querySelector('.cta1');
    if (usernameElement) {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameElement.textContent = savedUsername;
        }
    }
});
