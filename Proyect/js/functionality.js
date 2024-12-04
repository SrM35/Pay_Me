document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        'redirect-btn': 'login.html',
       // 'signIn-btn': 'dashboard.html',
        'signUp-btn': 'register.html',
        'create-btn': 'dashboard.html',
        'home-icon': 'dashboard.html',
        'historial-icon': 'movements.html',
        'next-btn': 'movements.html',
        'transfer-icon': 'transfer.html',
        'cards-icon': 'cards.html',
        'payments-icon': 'payments.html',
        'index-icon': 'index.html',
        'add-card-btn': 'dashboard.html',
        'make-transfer-btn': 'dashboard.html',
        'make-payment-btn': 'dashboard.html',
        'make-transfer-btn1': 'transfer.html',
        'make-payment-btn1': 'payments.html',
        'add-card-btn1': 'cards.html',
    };

    Object.entries(routes).forEach(([id, path]) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', () => {
                window.location.href = path;
            });
        }
    });

});



