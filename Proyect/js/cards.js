document.addEventListener('DOMContentLoaded', () => {
    const addCardBtn = document.getElementById('add-card-btn');
    addCardBtn.addEventListener('click', addCard);
});

async function addCard() {
    const balance = document.getElementById('balance').value;
    const numberCard = document.getElementById('card-number').value.replace(/\s/g, '');
    const nameCardOwner = document.getElementById('name').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const cvv = document.getElementById('cvv').value;
    
   
   // const idAccount = '123456'; 

    const cardData = {
        balance,
        numberCard,
        nameCardOwner,
        securityNumbers: cvv,
       // idAccount
    };

    try {
        const response = await fetch('/addCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Card added successfully:', result);
        alert('Card added successfully!');
        
    } catch (error) {
        console.error('Error adding card:', error);
        alert('Error adding card. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addCardBtn = document.getElementById('add-card-btn');
    addCardBtn.addEventListener('click', addCard);
});

async function addCard() {
    const balance = document.getElementById('balance').value;
    const numberCard = document.getElementById('card-number').value.replace(/\s/g, '');
    const nameCardOwner = document.getElementById('name').value;
    const expirationDate = document.getElementById('expiration-date').value;
    const cvv = document.getElementById('cvv').value;
    

    //const idAccount = '123456'; 

    const cardData = {
        balance,
        numberCard,
        nameCardOwner,
        securityNumbers: cvv,
        //idAccount
    };

    try {
        const response = await fetch('/addCard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Card added successfully:', result);
        alert('Card added successfully!');
       
    } catch (error) {
        console.error('Error adding card:', error);
        alert('Error adding card. Please try again.');
    }
}

