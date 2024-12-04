// document.addEventListener('DOMContentLoaded', () => {
//     const loginBtn = document.getElementById('signIn-btn');
//     if (loginBtn) {
//         loginBtn.addEventListener('click', loginUser);
//     }
// });

// async function loginUser(event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('http://localhost:3000/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password })
//         });

//         const data = await response.json();

//         if (response.ok) {
//             localStorage.setItem('user', JSON.stringify(data.user));
//             window.location.href = 'dashboard.html';
//         } else {
//             alert(data.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Error de conexión');
//     }
// }