const form = document.querySelector('#form');

window.addEventListener('resize', appHeight);
appHeight();

function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let username = form.username.value.trim();
  let password = form.password.value.trim();

  if (!username || !password) {
    return (form.querySelector('.redirect').innerHTML = `Todos los campos son obligatorios`);
  }

  if (localStorage.getItem(username)) {
    if (password === JSON.parse(localStorage.getItem(username)).user.password) {
      localStorage.setItem('currentUser', JSON.stringify(username));
      localStorage.setItem('firstLogin', JSON.stringify(true));
      return (location = '/app.html');
    } else {
      return (form.querySelector('.redirect').innerHTML = `Contraseña inválida`);
    }
  } else {
    return (form.querySelector('.redirect').innerHTML = `Usuario inválido`);
  }
});
