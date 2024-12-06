document.addEventListener('DOMContentLoaded', () => {
    const transferButton = document.getElementById('make-transfer-btn');
    
    transferButton.addEventListener('click', async () => {
      
        const emailUser_origin = localStorage.getItem('email');

     
        const recipientEmail = document.getElementById('recipient-email').value;
        const transferAmount = document.getElementById('transfer-amount').value;
        const transferMessage = document.getElementById('transfer-message').value;

       
        if (!emailUser_origin) {
            alert('User not logged in. Please log in again.');
            return;
        }

        if (!recipientEmail || !transferAmount) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/transfere', {
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
            });

            const result = await response.json();

            if (result.status === 200) {
                alert('Transfer successful!');
                
               
                document.getElementById('recipient-email').value = '';
                document.getElementById('transfer-amount').value = '';
                document.getElementById('transfer-message').value = '';
                const balanceElement = document.querySelector('.total-balance div:nth-child(2)');
                const savedBalance = localStorage.getItem('balance');
                if (savedBalance && balanceElement) {
                    const newBalance = parseFloat(savedBalance) - parseFloat(transferAmount);
                    localStorage.setItem('balance', newBalance.toFixed(2));
                    balanceElement.textContent = `$${newBalance.toFixed(2)}`;
                }
                window.location.href = 'dashboard.html';
            } else {
                alert('Transfer failed: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during the transfer');
        }
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