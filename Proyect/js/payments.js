document.addEventListener('DOMContentLoaded', () => {
    const emailUser = localStorage.getItem('email');
    const balance = parseFloat(localStorage.getItem('balance'));
    
    const debts = [
        { nameCompany: 'Netflix', amountToPay: 100.00 },
        { nameCompany: 'Spotify', amountToPay: 15.50 },
        { nameCompany: 'Amazon', amountToPay: 200.75 }
    ];

    const debtInfoElement = document.getElementById('amountPay');
    const companyInfoElement = document.getElementById('companyName');
    const debt = debts[0];
    if (debtInfoElement) {
        debtInfoElement.value = `$${debt.amountToPay}`;
    }
    if (companyInfoElement) {
        companyInfoElement.textContent = `Deuda con: ${debt.nameCompany}`;
    }

    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = `Balance disponible: $${balance}`;
    }

    const paymentButton = document.getElementById('make-payment-btn');
    if (paymentButton) {
        paymentButton.addEventListener('click', () => makePayment(debt, emailUser, balance));
    }
});

async function makePayment(debt, emailUser, balance) {
    const paymentMethod = document.getElementById('payment-method').value;
    const amount = debt.amountToPay;

    if (paymentMethod === 'account' && balance < amount) {
        alert('Saldo insuficiente en la cuenta');
        return;
    }

    const requestData = {
        paymentMethod,
        nameCompany: debt.nameCompany,
        emailUser,
        amount,
        numberCard: paymentMethod === 'card' ? document.getElementById('card-number').value : null,
        securityNumbers: paymentMethod === 'card' ? document.getElementById('security-numbers').value : null
    };

    try {
        const response = await fetch('http://localhost:3000/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        if (result.success) {
            alert('Pago realizado con éxito');
            if (paymentMethod === 'account') {
                const newBalance = balance - amount;
                localStorage.setItem('balance', newBalance.toString());
                document.getElementById('balance').textContent = `Balance disponible: $${newBalance}`;
            }
        } else {
            alert('Error al realizar el pago: ' + result.error);
        }
    } catch (error) {
        console.error('Error realizando el pago:', error);
        alert('Hubo un error al procesar el pago');
    }
}

//pa mostrar nombre y saldo
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
