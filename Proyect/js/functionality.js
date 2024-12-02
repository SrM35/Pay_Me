document.addEventListener('DOMContentLoaded', function() {
     var redirectBtn = document.getElementById('redirect-btn');
    if (redirectBtn) {
        redirectBtn.addEventListener('click', function() {
            window.location.href = 'login.html'; 
        });
    }


    var signInBtn = document.getElementById('signIn-btn'); 
    if (signInBtn) {
        signInBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html'; 
        });
    }

    var signUpBtn = document.getElementById('signUp-btn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            window.location.href = 'register.html'; 
        });
    }


    var createBtn = document.getElementById('create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html'; 
        });
    }
    var homeIcon = document.getElementById('home-icon');
    if (homeIcon) {
        homeIcon.addEventListener('click', function() {
            window.location.href = 'dashboard.html'; 
        });
    }
    var historialIcon = document.getElementById('historial-icon');
    if (historialIcon) {
        historialIcon.addEventListener('click', function() {
            window.location.href = 'movements.html'; 
        });
    }
    var nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            window.location.href = 'movements.html'; 
        });
    }
    var transferIcon = document.getElementById('transfer-icon');
    if (transferIcon) {
        transferIcon.addEventListener('click', function() {
            window.location.href = 'transfer.html'; 
        });
    }
    var cardsIcon = document.getElementById('cards-icon');
    if (cardsIcon) {
        cardsIcon.addEventListener('click', function() {
            window.location.href = 'cards.html'; 
        });
    }
    var paymentsIcon = document.getElementById('payments-icon');
    if (paymentsIcon) {
        paymentsIcon.addEventListener('click', function() {
            window.location.href = 'payments.html'; 
        });
    }
    var indexIcon = document.getElementById('index-icon');
    if (indexIcon) {
        indexIcon.addEventListener('click', function() {
            window.location.href = 'index.html'; 
        });
    }
  
});