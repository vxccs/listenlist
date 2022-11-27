const settingsBox = document.querySelector('.settings__box');
const userSettingsBtn = document.querySelector('#userSettings svg');
const userSettingsDiv = document.querySelector('.user__settings');
const themePickerBtn = document.querySelector('.theme-button');

const accordions = document.querySelectorAll('.accordion');
const mainSections = document.querySelectorAll('.main-section');

const ctaDiv = document.querySelector('.cta');

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let listenlist = JSON.parse(localStorage.getItem(currentUser)) || { user: {}, list: [] };
let selectedTheme = listenlist.user.selectedTheme || JSON.parse(localStorage.getItem('selectedTheme')) || 'dark';
let fontFactor = JSON.parse(localStorage.getItem('fontFactor')) || 1;

// events

document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
  selectTheme();
  openAccordion(accordions[0]);

  document.querySelector('.font-size-control div:nth-child(2)').textContent = fontFactor * 100 + '%';
  document
    .querySelectorAll('.font-size-control > div')
    .forEach((btn) => btn.addEventListener('click', (e) => changeFontSize(e)));
});

accordions.forEach((accordion) => {
  const title = accordion.querySelector('.accordion__title');
  const content = accordion.querySelector('.accordion__content');

  title.addEventListener('click', () => {
    if (content.style.maxHeight) {
      closeAccordion(accordion);
    } else {
      accordions.forEach((a) => closeAccordion(a));
      openAccordion(accordion);
    }
  });
});

userSettingsBtn.addEventListener('click', () => {
  userSettingsDiv.classList.contains('active-dropdown')
    ? userSettingsDiv.classList.remove('active-dropdown')
    : userSettingsDiv.classList.add('active-dropdown');
  settingsBox.style.display === 'block' ? (settingsBox.style.display = 'none') : (settingsBox.style.display = 'block');
});

['mousedown', 'touchstart'].forEach((e) => {
  window.addEventListener(e, (e) => {
    if (e.target === settingsBox) {
      userSettingsDiv.classList.remove('active-dropdown');
      settingsBox.style.display = 'none';
    }
  });
});

themePickerBtn.addEventListener('click', () => {
  if (selectedTheme === 'dark') {
    selectedTheme = 'light';
    document.documentElement.classList.add('light-mode');
  } else {
    selectedTheme = 'dark';
    document.documentElement.classList.remove('light-mode');
  }

  if (currentUser) {
    listenlist.user.selectedTheme = selectedTheme;
    syncStorage(listenlist.user.username, listenlist);
  } else {
    syncStorage('selectedTheme', selectedTheme);
  }
});

// functions

function syncStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function selectTheme() {
  selectedTheme === 'dark'
    ? document.documentElement.classList.remove('light-mode')
    : document.documentElement.classList.add('light-mode');
  if (fontFactor) document.documentElement.style.setProperty('--font-size-factor', fontFactor);
}

function changeFontSize(e) {
  let value = e.target.textContent;
  let currFactor, newFactor;
  if (e.target.textContent.includes('%')) value = 'Reset';
  switch (value) {
    case '-':
      currFactor = getComputedStyle(document.body).getPropertyValue('--font-size-factor');
      newFactor = currFactor > 0.75 ? parseFloat(currFactor) - 0.05 : currFactor;
      document.documentElement.style.setProperty('--font-size-factor', newFactor);
      document.querySelector('.font-size-control div:nth-child(2)').textContent = Math.round(newFactor * 100) + '%';
      break;

    case 'Reset':
      currFactor = getComputedStyle(document.body).getPropertyValue('--font-size-factor');
      newFactor = '1';
      document.documentElement.style.setProperty('--font-size-factor', newFactor);
      document.querySelector('.font-size-control div:nth-child(2)').textContent = Math.round(newFactor * 100) + '%';
      break;

    case '+':
      currFactor = getComputedStyle(document.body).getPropertyValue('--font-size-factor');
      newFactor = currFactor < 1.25 ? parseFloat(currFactor) + 0.05 : currFactor;
      document.documentElement.style.setProperty('--font-size-factor', newFactor);
      document.querySelector('.font-size-control div:nth-child(2)').textContent = Math.round(newFactor * 100) + '%';
      break;

    default:
      break;
  }

  syncStorage('fontFactor', newFactor);
}

function checkLogin() {
  if (currentUser) {
    userSettingsBtn.style.fill = 'rgb(var(--accent-color))';
    userSettingsDiv.innerHTML =
      `
      <div class="user__info">
          <p class="user__name">${listenlist.user.username}</p>
          <p class="user__email">${listenlist.user.email}</p>
      </div>` + userSettingsDivInHTMLIndex;
    ctaDiv.innerHTML = ctaInHTML;
    ctaDiv.id = 'lista';

    const navLink = document.createElement('li');
    navLink.innerHTML = `<a href="/app.html">Mi lista</a>`;
    document.querySelector('.footer__links ul:nth-child(2)').append(navLink);

    userSettingsDiv.querySelector('#collectionsBtn').addEventListener('click', () => (location = '/app.html'));
    userSettingsDiv.querySelector('#logoutBtn').addEventListener('click', logoutUser);
  } else {
    userSettingsDiv.innerHTML = userSettingsDivOutHTMLIndex;
    ctaDiv.innerHTML = ctaOutHTML;

    const navLink1 = document.createElement('li');
    navLink1.innerHTML = `<a href="/login.html">Iniciar sesión</a>`;

    const navLink2 = document.createElement('li');
    navLink2.innerHTML = `<a href="/signup.html">Registrar</a>`;

    document.querySelector('.footer__links ul:nth-child(2)').append(navLink1, navLink2);

    userSettingsDiv.querySelector('#loginBtn').addEventListener('click', () => (location = '/login.html'));
    userSettingsDiv.querySelector('#signupBtn').addEventListener('click', () => (location = '/signup.html'));
  }
}

function logoutUser() {
  localStorage.setItem('currentUser', null);
  location.reload();
}

const openAccordion = (accordion) => {
  const content = accordion.querySelector('.accordion__content');
  const arrow = accordion.querySelector('.title__arrow');

  content.style.maxHeight = `${content.scrollHeight}px`;
  content.style.padding = `0px 0px ${content.scrollHeight + 20}px 0px`;
  content.style.opacity = 1;
  arrow.style.rotate = '180deg';
};

const closeAccordion = (accordion) => {
  const content = accordion.querySelector('.accordion__content');
  const arrow = accordion.querySelector('.title__arrow');

  content.style.maxHeight = null;
  content.style.padding = '0px';
  content.style.opacity = '0';
  arrow.style.rotate = '0deg';
};

// observer

let sectionsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
      }
    });
  },
  { threshold: '0.25' }
);

mainSections.forEach((section) => sectionsObserver.observe(section));
