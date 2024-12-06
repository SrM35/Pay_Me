document.addEventListener('DOMContentLoaded', () => {
    const addCardButton = document.getElementById('add-card-btn');
    
    addCardButton.addEventListener('click', async () => {
       
        const idAccount = localStorage.getItem('idAccount');

        
        const balance = document.getElementById('balance').value;
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, ''); 
        const nameCardOwner = document.getElementById('name').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const securityNumbers = document.getElementById('cvv').value;

       
        if (!idAccount) {
            alert('User not logged in. Please log in again.');
            return;
        }

        if (!balance || !cardNumber || !nameCardOwner || !expirationDate || !securityNumbers) {
            alert('Please fill in all required fields');
            return;
        }

       
        if (!/^\d{16}$/.test(cardNumber)) {
            alert('Please enter a valid 16-digit card number');
            return;
        }

       
        if (!/^\d{3}$/.test(securityNumbers)) {
            alert('Please enter a valid 3-digit CVV');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/addCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    balance: parseFloat(balance),
                    numberCard: cardNumber,
                    nameCardOwner: nameCardOwner,
                    expirationDate: expirationDate,
                    securityNumbers: securityNumbers,
                    idAccount: idAccount
                })
            });

            const result = await response.json();

            if (result.status === 200) {
                alert('Card added successfully!');
                
              
                document.getElementById('balance').value = '';
                document.getElementById('card-number').value = '';
                document.getElementById('name').value = '';
                document.getElementById('expiration-date').value = '';
                document.getElementById('cvv').value = '';
               
            } else {
                alert('Failed to add card: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding card:', error);
            alert('An error occurred while adding the card');
        }
    });

    
    const usernameElement = document.querySelector('.cta1');
    if (usernameElement) {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameElement.textContent = savedUsername;
        }
    }
});