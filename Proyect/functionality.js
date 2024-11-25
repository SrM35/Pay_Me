document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('redirect-btn')) {
        document.getElementById('redirect-btn').addEventListener('click', function() {
            window.location.href = 'login.html'; 
        });
    }

    if (document.getElementById('signIn-btn')) {
        document.getElementById('signIn-btn').addEventListener('click', function() {
            window.location.href = 'dashboard.html'; 
        });
    }

    if (document.getElementById('signUp-btn')) {
        document.getElementById('signUp-btn').addEventListener('click', function() {
            window.location.href = 'register.html'; 
        });
    }
    if(document.getElementById('create-btn')) {
        document.getElementById('create-btn').addEventListener('click', function() {
            window.location.href = 'dashboard.html'; 
        });
    }
    if(document.getElementById('sign-In-btn')) {
        document.getElementById('sign-In-btn').addEventListener('click', function() {
            window.location.href = 'login.html'; 
        });
    }
    
});
