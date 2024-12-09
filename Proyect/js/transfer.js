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
                title: "User not authenticated",
                text: "Please log in again.",
            });
            return;
        }

        if (!recipientEmail || !transferAmount || !transferMessage) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete fields",
                text: "Please fill in all required fields.",
            });
            return;
        }

        const savedBalance = parseFloat(localStorage.getItem('balance'));
        if (parseFloat(transferAmount) > savedBalance) {
            Swal.fire({
                icon: "error",
                title: "Insufficient funds",
                text: "You do not have enough balance to complete this transfer.",
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
                    title: "Transfer successful",
                    text: "The money has been sent successfully!",
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
                    title: "Transfer failed",
                    text: result.message || "An unknown error occurred.",
                }).then(() => {
                    return;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Transfer error",
                text: "There was a problem processing your request. Please try again.",
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
