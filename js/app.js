const searchBar = document.querySelector('#search');
const clearSearchBtn = document.querySelector('#clear-search');

const themePickerBtn = document.querySelector('.theme-button');

const settingsBox = document.querySelector('.settings__box');
const userSettingsBtn = document.querySelector('#userSettings svg');
const userSettingsDiv = document.querySelector('.user__settings');

const topWrapper = document.querySelector('.top__wrapper');
const searchContainer = document.querySelector('#search-container');
const resultContainer = document.querySelector('#result-container');
const searchDiv = document.querySelector('.search__results');
const searchQuery = document.querySelector('#searchQuery');

const albumsColumn = searchDiv.querySelector('.search__albums');
const artistsColumn = searchDiv.querySelector('.search__artists');
const tracksColumn = searchDiv.querySelector('.search__tracks');

const collectionsBtn = document.querySelector('.colecciones__title');
const newTagForm = document.querySelector('.newTagForm');
const mainContainer = document.querySelector('.collection');
const tagDropdown = mainContainer.querySelector('.colecciones__dropdown');
const sortBtn = mainContainer.querySelector('.ordenar__btn');
const sortDropdown = mainContainer.querySelector('.ordenar__dropdown');
const collectionContainer = document.querySelector('.card__group');

import { client_id, client_secret } from './config.js';
let access_token;
let currentCollection;

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let listenlist = JSON.parse(localStorage.getItem(currentUser)) || { user: {}, list: [] };
let selectedTheme = listenlist.user.selectedTheme || JSON.parse(localStorage.getItem('selectedTheme')) || 'dark';
let firstLogin = JSON.parse(localStorage.getItem('firstLogin'));
let fontFactor = JSON.parse(localStorage.getItem('fontFactor')) || 1;

// events
document.addEventListener('DOMContentLoaded', () => {
  authorize();
  selectTheme();
  checkLogin();
  showCollectionItems(listenlist.list);

  document.querySelector('.font-size-control div:nth-child(2)').textContent = fontFactor * 100 + '%';
  document
    .querySelectorAll('.font-size-control > div')
    .forEach((btn) => btn.addEventListener('click', (e) => changeFontSize(e)));
});

clearSearchBtn.addEventListener('click', clearSearch);

userSettingsBtn.addEventListener('click', () => {
  userSettingsDiv.classList.contains('active-dropdown')
    ? userSettingsDiv.classList.remove('active-dropdown')
    : userSettingsDiv.classList.add('active-dropdown');
  settingsBox.style.display === 'block' ? (settingsBox.style.display = 'none') : (settingsBox.style.display = 'block');
});

collectionsBtn.addEventListener('click', () => {
  tagDropdown.classList.contains('active-dropdown')
    ? tagDropdown.classList.remove('active-dropdown')
    : tagDropdown.classList.add('active-dropdown');
  settingsBox.style.display === 'block' ? (settingsBox.style.display = 'none') : (settingsBox.style.display = 'block');
});

sortBtn.addEventListener('click', () => {
  sortDropdown.classList.contains('active-dropdown')
    ? sortDropdown.classList.remove('active-dropdown')
    : sortDropdown.classList.add('active-dropdown');
  settingsBox.style.display === 'block' ? (settingsBox.style.display = 'none') : (settingsBox.style.display = 'block');
});

document
  .querySelectorAll('.sort__item')
  .forEach((btn) => btn.addEventListener('click', () => sortCollection(btn.textContent)));

['mousedown', 'touchstart'].forEach((e) => {
  window.addEventListener(e, (e) => {
    if (e.target === settingsBox) {
      userSettingsDiv.classList.remove('active-dropdown');
      tagDropdown.classList.remove('active-dropdown');
      sortDropdown.classList.remove('active-dropdown');
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

newTagForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (currentUser) {
    let tag = newTagForm.newTag.value.trim();

    if (!tag) return showMessage('No puede estar vacio!', 'error');
    addCollection(tag);
    newTagForm.reset();
    showCollectionItems(listenlist.list);
  } else {
    showMessage('Debes iniciar sesión!', 'error');
  }
});

document.querySelector('.collection h1').addEventListener('click', () => showCollectionItems(listenlist.list));

// functions
function showMessage(msg, type) {
  const msgContainer = document.querySelector('.mensaje__container');
  msgContainer.className = 'mensaje__container';
  msgContainer.textContent = msg;
  type === 'error' ? msgContainer.classList.add('mensaje-error') : msgContainer.classList.add('mensaje-success');

  msgContainer.classList.add('mensaje-active');
  setTimeout(() => {
    msgContainer.classList.remove('mensaje-active');
  }, 5000);
}

function syncStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
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

// search event
let delayTimer;
searchBar.addEventListener('input', (e) => {
  clearTimeout(delayTimer);
  delayTimer = setTimeout(() => {
    if (e.target.value.trim()) {
      callAPI(e.target.value.trim(), 'search');
    } else {
      clearSearch();
    }
  }, 750);
});

function checkLogin() {
  if (currentUser) {
    if (firstLogin) {
      showMessage(`Bienvenido, ${currentUser}`, 'success');
      localStorage.setItem('firstLogin', JSON.stringify(false));
    }
    userSettingsBtn.style.fill = 'rgb(var(--accent-color))';
    userSettingsDiv.innerHTML =
      `
      <div class="user__info">
          <p class="user__name">${listenlist.user.username}</p>
          <p class="user__email">${listenlist.user.email}</p>
      </div>` + userSettingsDivInHTML;

    userSettingsDiv.querySelector('#logoutBtn').addEventListener('click', logoutUser);
  } else {
    userSettingsDiv.innerHTML = userSettingsDivOutHTML;

    userSettingsDiv.querySelector('#loginBtn').addEventListener('click', () => (location = '/login.html'));
    userSettingsDiv.querySelector('#signupBtn').addEventListener('click', () => (location = '/signup.html'));
  }
}

function logoutUser() {
  localStorage.setItem('currentUser', null);
  location = '/index.html';
}

function selectTheme() {
  selectedTheme === 'dark'
    ? document.documentElement.classList.remove('light-mode')
    : document.documentElement.classList.add('light-mode');
  if (fontFactor) document.documentElement.style.setProperty('--font-size-factor', fontFactor);
}

function clearSearch() {
  searchBar.value = '';
  hideSearchDiv();
  setTimeout(() => emptySearches, 300);
}

function emptySearches() {
  albumsColumn.innerHTML = '';
  artistsColumn.innerHTML = '';
  tracksColumn.innerHTML = '';
}

function showSearchResults(query, res) {
  searchQuery.textContent = `Resultados para: "${query}"`;

  emptySearches();

  if (res.albums.items.length === 0) {
    albumsColumn.innerHTML = `<p class="search__empty search__title-type">No se encontraron</p>`;
  }
  if (res.artists.items.length === 0) {
    artistsColumn.innerHTML = `<p class="search__empty search__title-type">No se encontraron</p>`;
  }
  if (res.tracks.items.length === 0) {
    tracksColumn.innerHTML = `<p class="search__empty search__title-type">No se encontraron</p>`;
  }

  res.albums.items.forEach((album) => {
    const albumCard = document.createElement('div');

    albumCard.className = 'search-card d-flex align-center';

    albumCard.innerHTML = `
      <img class="search__album-cover" 
        src="${album.images[2]?.url || '/images/artist-default.png'}" 
        alt="Portada de ${album.name}">
      <div class="search__info">
          <p class="search__title">${album.name}</p>
          <p class="search__subtitle">${album.artists.map((a) => a.name).join(', ')}</p>
      </div>
    `;

    albumCard.addEventListener('click', () => callAPI(album.id, 'album'));
    albumsColumn.append(albumCard);
  });

  res.artists.items.forEach((artist) => {
    const artistCard = document.createElement('div');

    artistCard.className = 'search-card d-flex align-center';

    artistCard.innerHTML = `
      <img class="search__artist-img" 
        src="${artist.images[2]?.url || '/images/artist-default.png'}" 
        alt="${artist.name} cover">
      <div class="search__info">
          <p class="search__title">${artist.name}</p>
      </div>
    `;

    artistCard.addEventListener('click', () => callAPI(artist.id, 'artist'));
    artistsColumn.append(artistCard);
  });

  res.tracks.items.forEach((track) => {
    const trackCard = document.createElement('div');

    trackCard.className = 'search-card d-flex align-center';

    trackCard.innerHTML = `
      <img class="search__album-cover" 
        src="${track.album.images[2]?.url || '/images/artist-default.png'}" 
        alt="Portada de ${track.name}">
      <div class="search__album-info">
          <p class="search__title">${track.name}</p>
          <p class="search__subtitle">${track.artists.map((a) => a.name).join(', ')}</p>
      </div>
    `;

    trackCard.addEventListener('click', () => callAPI(track.id, 'track'));
    tracksColumn.append(trackCard);
  });

  showSearchDiv();
}

async function fillResultDiv(full_item, image_url, subtitle, release_date, duration, genres, recs, spotify_url) {
  resultContainer.querySelector('.info__info').innerHTML = '';

  resultContainer.querySelector('.info__img').setAttribute('src', image_url);
  resultContainer.querySelector('.info__img').setAttribute('alt', full_item.name);
  resultContainer.querySelector('.info__type').textContent =
    full_item.type === 'track' ? 'Canción' : full_item.type === 'artist' ? 'Artista' : 'Album';
  resultContainer.querySelector('.info__title').textContent = full_item.name;
  resultContainer.querySelector('.info__subtitle').textContent = subtitle;

  const resultInfo = document.createElement('p');

  switch (full_item.type) {
    case 'track':
    case 'album':
      resultInfo.innerHTML = `
      <p class="info__text">
        ${formatDate(release_date)}
      </p>
      <p class="info__text">
        ${msToTime(duration)}
      </p>
      <p class="info__text">Popularidad: ${full_item.popularity / 10}</p>
    `;
      break;

    case 'artist':
      resultInfo.innerHTML = `
        <p class="info__text">Generos: ${genres}</p>
        <p class="info__text">Popularidad: ${full_item.popularity / 10}</p>
      `;
      break;

    default:
      break;
  }

  resultContainer.querySelector('.info__info').append(resultInfo);

  resultContainer.querySelector('#openSpotify').onclick = () => window.open(`${spotify_url}`, '_blank');
  resultContainer.querySelector('#addToCollection').onclick = () => saveToCollection(full_item);

  let recommendations = null;
  resultContainer.querySelector('.info__recs')?.remove();
  if (full_item.type === 'track' || full_item.type === 'artist') {
    recommendations = await callAPI({ seed_tracks: [recs.seed_tracks], seed_artists: [recs.seed_artists] }, 'recs');

    if (recommendations) {
      const recDiv = showRecommendations(recommendations);
      resultContainer.querySelector('.results__info').append(recDiv);
    }
  }

  if (listenlist.list.some((i) => i.id === full_item.id)) {
    resultContainer.querySelector('#addToCollection').textContent = 'Eliminar de colección';
    resultContainer.querySelector('#addToCollection').onclick = () =>
      confirm(`Confirme para eliminar de la colección`) ? removeFromCollection(full_item) : false;
  } else {
    resultContainer.querySelector('#addToCollection').textContent = 'Agregar a colección';
    resultContainer.querySelector('#addToCollection').onclick = () => saveToCollection(full_item);
  }

  showResultDiv();
}

function showRecommendations(recommendations) {
  const recDiv = document.createElement('div');
  recDiv.className = 'info__recs';
  recDiv.innerHTML = `<p class="small-type-text">Recomendaciones</p>`;

  recommendations.tracks.forEach((track) => {
    const recCard = document.createElement('div');
    recCard.className = 'search-card d-flex align-center';

    recCard.innerHTML = `
        <img class="search__album-cover"
          src="${track.album.images[2]?.url || '/images/artist-default.png'}"
          alt="Portada de ${track.name}">
        <div class="search__album-info">
            <p class="search__title">${track.name}</p>
            <p class="search__subtitle">${track.artists.map((a) => a.name).join(', ')}</p>
        </div>
      `;

    recCard.addEventListener('click', () => callAPI(track.id, 'track'));
    recDiv.append(recCard);
  });

  return recDiv;
}

function saveToCollection(item) {
  if (currentUser) {
    resultContainer.querySelector('#addToCollection').textContent = 'Eliminar de colección';
    resultContainer.querySelector('#addToCollection').onclick = () =>
      confirm(`Confirme para eliminar de la colección`) ? removeFromCollection(item) : false;
    listenlist.list.unshift(item);
    syncStorage(currentUser, listenlist);
    showCollectionItems(listenlist.list);
  } else {
    showMessage('Debes iniciar sesión!', 'error');
  }
}

function removeFromCollection(item) {
  resultContainer.querySelector('#addToCollection').textContent = 'Agregar a colección';
  resultContainer.querySelector('#addToCollection').onclick = () => saveToCollection(item);
  listenlist.list = listenlist.list.filter((i) => i.id !== item.id);
  syncStorage(currentUser, listenlist);
  showCollectionItems(listenlist.list);
}

function showCollectionItems(list) {
  fillTagsDropdown();
  currentCollection = list;

  const tagTitle = document.querySelector('.colecciones__subtitle');
  tagTitle.textContent = '';
  collectionContainer.innerHTML = '';

  if (list.length) {
    document.querySelector('.empty__group')?.remove();

    list.forEach((item, index) => {
      const newCard = document.createElement('div');
      newCard.className = 'main__card';

      const newCardImg = document.createElement('div');

      newCardImg.innerHTML = showCollectionCardImgHTML;

      switch (item.type) {
        case 'album':
          newCardImg.querySelector('img').setAttribute('src', item.images[1].url);
          newCardImg.querySelector('img').setAttribute('alt', item.name);
          newCard.innerHTML = `
          <p class="maincard__type small-type-text">Album</p>
          <p class="maincard__title">${item.name}</p>
          <p class="maincard__subtitle">${item.artists.map((a) => a.name).join(', ')}</p>
        `;
          break;

        case 'track':
          newCardImg.querySelector('img').setAttribute('src', item.album.images[1].url);
          newCardImg.querySelector('img').setAttribute('alt', item.album.name);
          newCard.innerHTML = `
          <p class="maincard__type small-type-text">Canción</p>
          <p class="maincard__title">${item.name}</p>
          <p class="maincard__subtitle">${item.artists.map((a) => a.name).join(', ')}</p>
        `;
          break;

        case 'artist':
          newCardImg.querySelector('img').setAttribute('src', item.images[1].url);
          newCardImg.querySelector('img').setAttribute('alt', item.name);
          newCard.innerHTML = `
          <p class="maincard__type small-type-text">Artista</p>
          <p class="maincard__title">${item.name}</p>
        `;
          break;

        default:
          break;
      }

      newCard.prepend(newCardImg);
      showTags(newCard, item);

      newCard.style.animationDelay = `${300 + 250 * index}ms`;
      newCard.querySelector('#openSpotifyCard').onclick = () => window.open(`${item.external_urls.spotify}`, '_blank');
      newCard.querySelector('#removeFromCollectionCard').onclick = () =>
        confirm(`Confirme para eliminar de la colección`) ? removeFromCollection(item) : false;
      newCard.querySelector('.maincard__title').onclick = () => callAPI(item.id, item.type);

      collectionContainer.append(newCard);
    });
  } else {
    document.querySelector('.empty__group')?.remove();
    const emptyGroup = document.createElement('div');
    emptyGroup.className = 'empty__group';
    emptyGroup.innerHTML = currentUser ? emptyGroupInHTML : emptyGroupOutHTML;
    collectionContainer.insertAdjacentElement('afterend', emptyGroup);
  }
}

function fillTagsDropdown() {
  tagDropdown.querySelector('.tags__dropdown').innerHTML = '';

  getAvailableTags().forEach((tag) => {
    const tagItem = document.createElement('div');
    tagItem.className = 'tag__dropdown d-flex align-center';
    tagItem.textContent = `${tag} (${listenlist.list.filter((item) => item.tags?.includes(tag)).length})`;

    const removeTag = document.createElement('button');
    removeTag.className = 'remove__tag';
    removeTag.textContent = 'x';

    removeTag.addEventListener('click', () =>
      confirm(`Confirme para eliminar la colección "${tag}"`) ? removeCollection(tag) : false
    );
    tagItem.addEventListener('click', (e) => filterByCollection(e, tag));

    tagItem.append(removeTag);

    tagDropdown.querySelector('.tags__dropdown').append(tagItem);
  });
}

function filterByCollection(e, filterRule) {
  if (!currentUser) return showMessage('Debes iniciar sesión!', 'error');
  if (e.target?.classList.contains('tag__dropdown') || e === 'key') {
    let filteredList = listenlist.list.filter((i) => i.tags?.includes(filterRule));
    showCollectionItems(filteredList);
    showRemoveTag(filterRule, tagDropdown);
  }
}

function sortCollection(key) {
  if (!currentUser) return showMessage('Debes iniciar sesión!', 'error');
  let filteredCollection;
  switch (key) {
    case 'Titulo':
      filteredCollection = [...currentCollection].sort((a, b) => a.name.localeCompare(b.name));
      showCollectionItems(filteredCollection);
      break;

    case 'Artista':
      filteredCollection = [...currentCollection].sort((a, b) => {
        let aName = a.type === 'artist' ? a.name : a.artists[0].name;
        let bName = b.type === 'artist' ? b.name : b.artists[0].name;
        return aName.localeCompare(bName);
      });
      showCollectionItems(filteredCollection);
      break;

    case 'Fecha de lanzamiento':
      filteredCollection = [...currentCollection]
        .filter((i) => i.type !== 'artist')
        .sort((a, b) => {
          let aDate = a.type === 'album' ? a.release_date : a.album.release_date;
          let bDate = b.type === 'album' ? b.release_date : b.album.release_date;
          return new Date(bDate) - new Date(aDate);
        });
      showCollectionItems(filteredCollection);
      break;

    case 'Duración':
      filteredCollection = [...currentCollection]
        .filter((i) => i.type !== 'artist')
        .sort((a, b) => {
          let aDate = a.type === 'album' ? a.tracks.items.reduce((p, c) => p + c.duration_ms, 0) : a.duration_ms;
          let bDate = b.type === 'album' ? b.tracks.items.reduce((p, c) => p + c.duration_ms, 0) : b.duration_ms;
          return new Date(bDate) - new Date(aDate);
        });
      showCollectionItems(filteredCollection);
      break;

    case 'Popularidad':
      filteredCollection = [...currentCollection].sort((a, b) => b.popularity - a.popularity);
      showCollectionItems(filteredCollection);
      break;

    default:
      break;
  }

  showRemoveTag(`Ordenado por ${key}`, sortDropdown);
}

function showRemoveTag(text, itemToClose) {
  const tagTitle = document.querySelector('.colecciones__subtitle');
  tagTitle.classList.add('d-flex', 'align-center');
  tagTitle.textContent = text;

  const removeTag = document.createElement('button');
  removeTag.className = 'remove__tag';
  removeTag.textContent = 'x';

  removeTag.addEventListener('click', () => showCollectionItems(listenlist.list));

  tagTitle.append(removeTag);

  itemToClose.classList.remove('active-dropdown');
  settingsBox.style.display = 'none';
}

function addCollection(tag) {
  if (!listenlist.user.collections) listenlist.user.collections = [];

  if (!listenlist.user.collections.includes(tag) && tag) {
    listenlist.user.collections.push(tag);
    syncStorage(currentUser, listenlist);
  }
}

function removeCollection(tag) {
  listenlist.user.collections = listenlist.user.collections.filter((t) => t !== tag);
  listenlist.list.forEach((item) => {
    item.tags = item.tags?.filter((t) => t !== tag);
  });
  syncStorage(currentUser, listenlist);
  showCollectionItems(listenlist.list);
}

function showTags(card, item) {
  card.querySelector('.tags__container')?.remove();

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'tags__container d-flex align-center flex-wrap';

  item.tags?.forEach((tag) => {
    const tagItem = document.createElement('p');
    tagItem.className = 'tag__item';
    tagItem.textContent = tag;

    const removeTag = document.createElement('button');
    removeTag.className = 'remove__tag';
    removeTag.textContent = 'x';

    removeTag.addEventListener('click', () => deleteTag(tag, item, card));

    tagItem.append(removeTag);
    tagsDiv.append(tagItem);
  });

  const addDiv = document.createElement('div');
  addDiv.className = 'add__tag';
  const addTag = document.createElement('button');
  addTag.textContent = '+';

  const tagTooltip = document.createElement('div');
  tagTooltip.className = 'tag__tooltip';

  addDiv.append(addTag, tagTooltip);
  tagsDiv.append(addDiv);
  card.append(tagsDiv);
  showAvailableTags(item, card);
}

function getAvailableTags() {
  let availableTags = [];
  listenlist.user.collections?.map((t) => availableTags.push(t));
  return availableTags;
}

function showAvailableTags(item, card) {
  const tagTooltip = card.querySelector('.tag__tooltip');
  getAvailableTags().forEach((tag) => {
    if (!item.tags?.includes(tag)) {
      const tagItem = document.createElement('div');
      tagItem.className = 'popup__tags';
      tagItem.textContent = tag;

      tagItem.addEventListener('click', () => addNewTag(tag, item, card));

      tagTooltip.append(tagItem);
    }
  });

  if (!tagTooltip.children[0]) {
    const tagItem = document.createElement('div');
    tagItem.className = 'popup__tags';
    tagItem.textContent = 'No hay colecciones';

    tagTooltip.append(tagItem);
  }
}

function addNewTag(tag, item, card) {
  if (!item.tags) item.tags = [];
  item.tags.push(tag);
  syncStorage(currentUser, listenlist);
  showTags(card, item);
  fillTagsDropdown();
}

function deleteTag(tag, item, card) {
  item.tags = item.tags.filter((t) => t !== tag);
  syncStorage(currentUser, listenlist);
  showTags(card, item);
  fillTagsDropdown();

  const tagTitle = document.querySelector('.colecciones__subtitle');
  if (tagTitle.textContent) {
    filterByCollection('key', tagTitle.textContent.substring(0, tagTitle.textContent.length - 1).trim());
  }
}

// search bar animations
function showSearchDiv() {
  if (resultContainer.style.display === 'block') hideResultDiv();

  clearSearchBtn.classList.add('active-dropdown');
  topWrapper.style.display = 'block';
  searchContainer.style.display = 'block';
  topWrapper.style.height = `${topWrapper.scrollHeight}px`;

  setTimeout(() => {
    searchContainer.style.opacity = '1';
    searchContainer.scrollIntoView({ behavior: 'smooth' });
    topWrapper.style.height = 'auto';
  }, 500);
}

function showResultDiv() {
  clearSearchBtn.classList.add('active-dropdown');
  topWrapper.style.display = 'block';
  resultContainer.style.display = 'block';
  topWrapper.style.height = `${topWrapper.scrollHeight}px`;
  setTimeout(() => {
    resultContainer.style.opacity = '1';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
    topWrapper.style.height = 'auto';
  }, 500);
}

function hideSearchDiv() {
  clearSearchBtn.classList.remove('active-dropdown');
  topWrapper.style.height = `${topWrapper.scrollHeight}px`;
  searchContainer.style.opacity = '0';
  hideResultDiv();
  setTimeout(() => (topWrapper.style.height = '0'), 251);
  setTimeout(() => {
    topWrapper.style.display = 'none';
    searchContainer.style.display = 'none';
  }, 750);
}

function hideResultDiv() {
  clearSearchBtn.classList.remove('active-dropdown');
  topWrapper.style.height = `${topWrapper.scrollHeight}px`;
  resultContainer.style.opacity = '0';
  setTimeout(() => {
    resultContainer.style.display = 'none';
  }, 750);
}

// helper functions
function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(new Date(date));
}

function msToTime(ms) {
  let s = ms / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;

  if (hrs) {
    return `${parseInt(hrs)} hr ${parseInt(mins)} min`;
  } else {
    return `${parseInt(mins)} min ${parseInt(secs)} sec`;
  }
}

// API calls
async function callAPI(query, endpoint) {
  let myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${access_token}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  let FETCH_URL, res, data;

  try {
    switch (endpoint) {
      case 'search':
        FETCH_URL = `https://api.spotify.com/v1/search?q=${query}&type=album,artist,track&limit=5`;
        res = await fetch(FETCH_URL, requestOptions);
        handleAPIErrors(res);
        return showSearchResults(query, await res.json());

      case 'album':
        FETCH_URL = `https://api.spotify.com/v1/albums/${query}`;
        res = await fetch(FETCH_URL, requestOptions);
        handleAPIErrors(res);
        data = await res.json();
        return fillResultDiv(
          data,
          data.images[1].url,
          data.artists.map((a) => a.name).join(', '),
          data.release_date,
          data.tracks.items.reduce((p, c) => p + c.duration_ms, 0),
          '',
          '',
          data.external_urls.spotify
        );

      case 'track':
        params = new URLSearchParams();
        params.append('market', 'VE');

        FETCH_URL = `https://api.spotify.com/v1/tracks/${query}?`;
        res = await fetch(FETCH_URL + params, requestOptions);
        handleAPIErrors(res);
        data = await res.json();
        return fillResultDiv(
          data,
          data.album.images[1].url,
          data.artists.map((a) => a.name).join(', '),
          data.album.release_date,
          data.duration_ms,
          '',
          { seed_tracks: data.id, seed_artists: data.artists[0].id },
          data.external_urls.spotify
        );

      case 'artist':
        FETCH_URL = `https://api.spotify.com/v1/artists/${query}`;
        res = await fetch(FETCH_URL, requestOptions);
        handleAPIErrors(res);
        data = await res.json();
        return fillResultDiv(
          data,
          data.images[1].url,
          '',
          '',
          '',
          data.genres.join(', '),
          { seed_artists: data.id },
          data.external_urls.spotify
        );

      case 'recs':
        params = new URLSearchParams();
        if (query.seed_tracks) params.append('seed_tracks', query.seed_tracks.join(','));
        if (query.seed_artists) params.append('seed_artists', query.seed_artists.join(','));

        FETCH_URL = `https://api.spotify.com/v1/recommendations?limit=5&`;
        res = await fetch(FETCH_URL + params, requestOptions);
        handleAPIErrors(res);
        return await res.json();

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function handleAPIErrors(res) {
  if (!res.ok) {
    showMessage('Algo salió mal', 'error');
    throw Error(res.statusText);
  }
}

// generate an access token for queries
async function authorize() {
  let myHeaders = new Headers();
  myHeaders.append('Authorization', `Basic ${btoa(client_id + ':' + client_secret)}`);
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  let params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: params,
  };

  try {
    let res = await fetch('https://accounts.spotify.com/api/token', requestOptions);
    handleAPIErrors(res);
    access_token = (await res.json()).access_token;

    setTimeout(() => authorize, 999 * 60 * 60);
  } catch (error) {
    console.log(error);
    return showMessage('Algo salió mal', 'error');
  }
}
