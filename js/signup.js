const form = document.querySelector('#form');
const formBtn = document.querySelector('input[type="submit"]');

const usernameInput = document.querySelector('[name="username"]');
const emailInput = document.querySelector('[name="email"]');
const passwordInput = document.querySelector('[name="password"]');
const checkInput = document.querySelector('[name="passwordCheck"]');

let usernameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let checkValidation = false;

window.addEventListener('resize', appHeight);
appHeight();

function appHeight() {
  const doc = document.documentElement;
  doc.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (localStorage.getItem(form.username.value.trim())) {
    return (form.querySelector('.redirect').innerHTML = 'El usuario ya esta en uso');
  }

  Object.keys(localStorage)?.forEach((key) => {
    if (JSON.parse(localStorage.getItem(key))?.user?.email === form.email.value.trim()) {
      return (form.querySelector('.redirect').innerHTML = 'El email ya esta en uso');
    }
  });

  let newUser = {
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value.trim(),
  };

  localStorage.setItem('currentUser', JSON.stringify(newUser.username));
  localStorage.setItem(newUser.username, JSON.stringify({ user: newUser, list: [] }));
  localStorage.setItem('firstLogin', JSON.stringify(true));

  return (location = '/app.html');
});

let usernameTimer;
usernameInput.addEventListener('input', (e) => {
  clearTimeout(usernameTimer);
  usernameTimer = setTimeout(() => {
    const USERNAME_REGEX = /^[\w]{3,8}$/gm;
    usernameValidation = USERNAME_REGEX.test(e.target.value.trim());
    validation(usernameInput, usernameValidation);
  }, 500);
});

let emailTimer;
emailInput.addEventListener('input', (e) => {
  clearTimeout(emailTimer);
  emailTimer = setTimeout(() => {
    const EMAIL_REGEX = /^\w+@\w+\.\w+/gm;
    emailValidation = EMAIL_REGEX.test(e.target.value.trim());
    validation(emailInput, emailValidation);
  }, 500);
});

let passwordTimer;
passwordInput.addEventListener('input', (e) => {
  clearTimeout(passwordTimer);
  passwordTimer = setTimeout(() => {
    const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,24}$/gm;
    passwordValidation = PASSWORD_REGEX.test(e.target.value.trim());
    validation(passwordInput, passwordValidation);
  }, 500);
});

let checkTimer;
checkInput.addEventListener('input', (e) => {
  clearTimeout(checkTimer);
  checkTimer = setTimeout(() => {
    checkValidation = e.target.value.trim() === passwordInput.value.trim();
    validation(checkInput, checkValidation);
  }, 500);
});

const validation = (input, regexValidation) => {
  formBtn.disabled = !usernameValidation || !emailValidation || !passwordValidation || !checkValidation;
  if (!regexValidation && input.value) {
    input.parentElement.querySelector('p').classList.add('show');
    input.classList.add('invalid');
    input.classList.remove('valid');
  } else if (regexValidation) {
    input.parentElement.querySelector('p').classList.remove('show');
    input.classList.remove('invalid');
    input.classList.add('valid');
  } else if (!input.value) {
    input.parentElement.querySelector('p').classList.remove('show');
    input.classList.remove('invalid');
    input.classList.remove('valid');
  }
};
