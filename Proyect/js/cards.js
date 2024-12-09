document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded successfully');

    const button = document.getElementById('add-card-btn');
    if (!button) {
        console.error('The "add-card-btn" button was not found.');
        return;
    }

    button.addEventListener('click', function () {
        console.log('Button clicked');

        const idAccount = localStorage.getItem('idAccount');
        const balance = document.getElementById('balance').value;
        const numberCard = document.getElementById('card-number').value.trim();
        const nameCardOwner = document.getElementById('name').value.trim();
        const expirationDate = document.getElementById('expiration-date').value;
        const securityNumbers = document.getElementById('cvv').value.trim();

        

        if (!balance || !numberCard || !nameCardOwner || !expirationDate || !securityNumbers) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete fields',
                text: 'Please fill out all fields.',
            });
            return;
        }

        if (!idAccount) {
            console.error('Account ID not found in localStorage.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Account ID not found.',
            });
            return;
        }

        if (!/^\d{16}$/.test(numberCard)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid card number',
                text: 'The card number must contain exactly 16 digits and cannot have letters.',
            });
            return;
        }

        if (!/^\d{3}$/.test(securityNumbers)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid CVV',
                text: 'The CVV must contain exactly 3 digits.',
            });
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(nameCardOwner)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid name',
                text: 'The name should only contain letters.',
            });
            return;
        }

        console.log('Sending data to the backend:', {
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
                console.log('Server response:', data);

                if (data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Card added',
                        text: 'Your card was successfully added!',
                    }).then(() => {

                        localStorage.setItem('numberCard', numberCard);
                         localStorage.setItem('securityNumbers', securityNumbers);
                        window.location.href = 'dashboard.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to add card',
                        text: data.message || 'An error occurred.',
                    });
                }
            })
            .catch(err => {
                console.error('Request error:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error processing the request.',
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
