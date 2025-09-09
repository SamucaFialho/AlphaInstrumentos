const container = document.getElementById('login-container');

    // links dentro dos formulários
    document.getElementById('open-register').addEventListener('click', (e) => {
      e.preventDefault();
      container.classList.add('move');
    });
    document.getElementById('open-login').addEventListener('click', (e) => {
      e.preventDefault();
      container.classList.remove('move');
    });

    // botões do overlay
    document.getElementById('registerBtn').addEventListener('click', () => {
      container.classList.add('move');
    });
    document.getElementById('loginBtn').addEventListener('click', () => {
      container.classList.remove('move');
    });