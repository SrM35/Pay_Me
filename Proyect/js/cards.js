document.addEventListener('DOMContentLoaded', () => {
    const addCardBtn = document.getElementById('add-card-btn');
    const form = document.getElementById('credit-card-form');

    addCardBtn.addEventListener('click', handleAddCard);

    async function handleAddCard() {
        console.log('Botón clickeado');
        

        const balance = document.getElementById('balance').value;
        const numberCard = document.getElementById('card-number').value.replace(/\s/g, '');
        const nameCardOwner = document.getElementById('name').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        if (!validateForm(balance, numberCard, nameCardOwner, expirationDate, cvv)) {
            resetButton();
            return;
        }
        //objeto para enviar al s+erver
        const cardData = {
            balance: parseFloat(balance),
            numberCard,
            nameCardOwner,
            expirationDate,
            securityNumbers: cvv,
        };
        console.log('Datos de la tarjeta:', cardData);
        try {
            const response = await fetch('http://localhost:3000/addCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),//convierte a json
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Resultado del servidor:', result);
            console.log('Tarjeta agregada exitosamente:', result);
            alert('¡Tarjeta agregada exitosamente!');
            form.reset();
        } catch (error) {
            console.error('Error al agregar la tarjeta:', error);
            alert('Error al agregar la tarjeta. Por favor, intente de nuevo.');
        } finally {
            resetButton();
        }
    }

    function resetButton() {
        addCardBtn.disabled = false;
        addCardBtn.textContent = 'Agregar Tarjeta';
    }

    function validateForm(balance, numberCard, nameCardOwner, expirationDate, cvv) {
        if (!balance || isNaN(parseFloat(balance))) {
            alert('Por favor, ingrese un balance válido.');
            return false;
        }
        if (numberCard.length !== 16) {
            alert('El número de tarjeta debe tener 16 dígitos.');
            return false;
        }
        if (!nameCardOwner) {
            alert('Por favor, ingrese el nombre del titular de la tarjeta.');
            return false;
        }
       
        if (cvv.length !== 3) {
            alert('El CVV debe tener 3 dígitos.');
            return false;
        }
        return true;
    }
});