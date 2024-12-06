document.addEventListener('DOMContentLoaded', function () {
    
    const balance = localStorage.getItem('balance');
    const username = localStorage.getItem('username');

    console.log('Saldo guardado:', balance);  

  
    if (balance) {
        const balanceElement = document.querySelector('.total-balance div:nth-child(2)');
        if (balanceElement) {
            balanceElement.textContent = `$${parseFloat(balance).toFixed(2)}`; 
        }
    }

   
    if (username) {
        const usernameElement = document.querySelector('.title');
        if (usernameElement) {
            usernameElement.textContent = `Hi there, ${username}!`;
        }

        const ctaUsernameElement = document.querySelector('.cta1');
        if (ctaUsernameElement) {
            ctaUsernameElement.textContent = username;
        }
    }
});
