document.addEventListener('DOMContentLoaded', () => {
    const addCardBtn = document.getElementById('add-card-btn');
    const form = document.getElementById('credit-card-form');

    console.log('DOM fully loaded');

    // if (!addCardBtn) {
    //     console.error("El botón 'add-card-btn' no se encuentra en el DOM.");
    //     return;
    // }

    // console.log('Botón encontrado:', addCardBtn);

    addCardBtn.addEventListener('click', handleAddCard);

    async function handleAddCard() {
        console.log('Botón clickeado');
        addCardBtn.disabled = true;
        addCardBtn.textContent = 'Agregando...';

        const balance = document.getElementById('balance').value;
        const numberCard = document.getElementById('card-number').value.replace(/\s/g, '');
        const nameCardOwner = document.getElementById('name').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        if (!validateForm(balance, numberCard, nameCardOwner, expirationDate, cvv)) {
            addCardBtn.disabled = false;
            addCardBtn.textContent = 'Agregar Tarjeta';
            return;
        }

        const cardData = {
            balance,
            numberCard,
            nameCardOwner,
            securityNumbers: cvv,
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
            console.log('Tarjeta agregada exitosamente:', result);
            alert('¡Tarjeta agregada exitosamente!');
            form.reset();
        } catch (error) {
            console.error('Error al agregar la tarjeta:', error);
            alert('Error al agregar la tarjeta. Por favor, intente de nuevo.');
        } finally {
            addCardBtn.disabled = false;
            addCardBtn.textContent = 'Agregar Tarjeta';
        }
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