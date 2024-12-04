document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-btn');
    createBtn.addEventListener('click', createAccount);

    const signInBtn = document.getElementById('signIn-btn');
    signInBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});

async function createAccount() {
    const nameUser = document.getElementById('first-name').value;
    const emailUser = document.getElementById('email').value;
    const passwordUser = document.getElementById('password').value;
    const balance = document.getElementById('balance').value;

    if (!nameUser || !emailUser || !passwordUser || !balance) {
        alert('Please fill in all fields');
        return;
    }

    const userData = {
        nameUser,
        emailUser,
        passwordUser,
        balance
    };

    try {
        const response = await fetch('/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Account created successfully:', result);
        alert('Account created successfully! Please log in.');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Error creating account. Please try again.');
    }
}