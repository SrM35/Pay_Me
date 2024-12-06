document.addEventListener('DOMContentLoaded', function () {
    const balance = localStorage.getItem('balance');
    const username = localStorage.getItem('username');

    console.log('Saldo guardado:', balance);  

    if (balance) {
        const balanceElement = document.querySelector('.total-balance div:nth-child(2)');
        balanceElement.textContent = `$${balance}`;
    }

    if (username) {
        const usernameElement = document.querySelector('.title');
        usernameElement.textContent = `Hi there, ${username}!`;
    }
});
const usernameElement = document.querySelector('.cta1');
if (usernameElement) {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        usernameElement.textContent = savedUsername;
    }
}
