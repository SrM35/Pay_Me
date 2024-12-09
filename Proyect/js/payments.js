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