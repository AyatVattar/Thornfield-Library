/* ==========================================================================
   app.js — SHARED RUNTIME  (frozen shared file: coordinate before editing)

   Owns everything that more than one page needs:
     · the header, navigation, mobile menu and footer (injected, one copy)
     · the search dialog
     · the book-card renderer
     · the localStorage layer (Library and Prefs)
     · small helpers: icons, escaping, URLs, toasts, image fallbacks

   Page scripts (home.js, genres.js, ...) call these. They must not redefine
   them and must not write to localStorage directly.

   All scripts are loaded with `defer`, in this order:
     books.js  →  [reader-texts.js on the reading page]  →  app.js  →  page.js
   ========================================================================== */

/* Every page declares <body data-root="./"> or <body data-root="../"> so the
   same link builder works from the site root and from inside /pages/. */
const ROOT = document.body.dataset.root || './';

function url(path) {
  return ROOT + path;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* --------------------------------------------------------------- escaping */
/* Book data is trusted, but anything typed by a user is not. Always escape
   before putting a string into innerHTML. */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ------------------------------------------------------------------ icons */
/* Inline SVG so there are no icon-font or network dependencies. */
const ICON_PATHS = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4L21 21"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v18H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M4 17.5h15"/>',
  openBook: '<path d="M12 6.5C10.5 5 8 4.5 4 4.8v13c4-.3 6.5.2 8 1.7 1.5-1.5 4-2 8-1.7v-13c-4-.3-6.5.2-8 1.7z"/><path d="M12 6.5v13"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M5 5l14 14M19 5L5 19"/>',
  chevronLeft: '<path d="M15 4l-8 8 8 8"/>',
  chevronRight: '<path d="M9 4l8 8-8 8"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  bookmark: '<path d="M6 3h12v18l-6-4.5L6 21z"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.4"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  leaf: '<path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s2-9 15-12"/><path d="M5 20c8 0 15-5 15-16"/>',
  shelves: '<path d="M3 4h18v16H3z"/><path d="M3 12h18M7 4v8M11 4v8M15 12v8M18 12v8"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  feather: '<path d="M20 4c-8 0-14 5-14 12l-2 4"/><path d="M20 4c0 8-5 14-12 14"/><path d="M9 12h6"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>',
  sort: '<path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/>'
};

function icon(name, className) {
  const path = ICON_PATHS[name];
  if (!path) return '';
  return '<svg class="icon' + (className ? ' ' + className : '') + '" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true" focusable="false">' + path + '</svg>';
}

/* Static HTML can use <span data-icon="search"></span>; this fills them in. */
function hydrateIcons(scope) {
  (scope || document).querySelectorAll('[data-icon]').forEach(function (node) {
    node.innerHTML = icon(node.dataset.icon, node.dataset.iconClass || '');
    node.removeAttribute('data-icon');
  });
}

/* ------------------------------------------------------- header and footer */
const NAV_ITEMS = [
  { label: 'Home', href: 'index.html', match: ['index.html', ''] },
  { label: 'Genres', href: 'pages/genres.html', match: ['genres.html', 'genre-details.html', 'book-details.html', 'read.html'] },
  { label: 'My Library', href: 'pages/my-library.html', match: ['my-library.html'] },
  { label: 'About', href: 'pages/about.html', match: ['about.html'] }
];

function currentPageFile() {
  const file = window.location.pathname.split('/').pop();
  return file || 'index.html';
}

function brandMarkup() {
  /* Thorn sprig over an open book — the library's own mark, drawn inline. */
  return '<span class="brand__mark" aria-hidden="true">' +
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M24 12c-3.4-2.6-7.6-3.4-13-3v22c5.4-.4 9.6.4 13 3 3.4-2.6 7.6-3.4 13-3V9c-5.4-.4-9.6.4-13 3z"/>' +
    '<path d="M24 12v22"/>' +
    '<path d="M24 9.5V3M24 5.6l3-2.2M24 7.4l-3.2-2.4"/>' +
    '<path d="M17 17.5c2 .6 3.6 1.6 4.6 2.8M31 17.5c-2 .6-3.6 1.6-4.6 2.8"/>' +
    '</svg></span>' +
    '<span class="brand__text"><span class="brand__name">Thornfield Library</span>' +
    '<span class="brand__sub">Free · No account · Est. MMXXVI</span></span>';
}

function renderHeader() {
  const host = document.getElementById('site-header');
  if (!host) return;
  const current = currentPageFile();

  const links = NAV_ITEMS.map(function (item) {
    const active = item.match.indexOf(current) !== -1;
    return '<li><a class="site-nav__link" href="' + url(item.href) + '"' +
      (active ? ' aria-current="page"' : '') + '>' + escapeHtml(item.label) + '</a></li>';
  }).join('');

  host.innerHTML =
    '<header class="site-header"><div class="wrap site-header__inner">' +
      '<a class="brand" href="' + url('index.html') + '">' + brandMarkup() + '</a>' +
      '<nav class="site-nav" id="site-nav" aria-label="Main navigation"><ul class="site-nav__list">' + links + '</ul></nav>' +
      '<div class="header-actions">' +
        '<button class="icon-btn" type="button" id="search-open" aria-label="Search the collection" aria-haspopup="dialog">' + icon('search') + '</button>' +
        '<a class="icon-btn" id="favorites-shortcut" href="' + url('pages/my-library.html') + '?view=favorites" aria-label="Favourites">' +
          icon('heart') + '<span class="icon-btn__count" id="favorites-count" hidden>0</span></a>' +
        '<button class="icon-btn nav-toggle" type="button" id="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">' +
          icon('menu') + '</button>' +
      '</div>' +
    '</div></header>';

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  toggle.addEventListener('click', function () {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    toggle.innerHTML = icon(open ? 'menu' : 'close');
    nav.classList.toggle('is-open', !open);
    host.querySelector('.site-header').classList.toggle('is-menu-open', !open);
  });

  /* Close the mobile menu after following a link or pressing Escape. */
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = icon('menu');
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) toggle.click();
  });

  document.getElementById('search-open').addEventListener('click', function () { openSearch(''); });
  updateFavoritesCount();
}

function renderFooter() {
  const host = document.getElementById('site-footer');
  if (!host) return;

  const genreLinks = GENRES.map(function (genre) {
    return '<li><a href="' + url('pages/genre-details.html') + '?genre=' + genre.id + '">' + escapeHtml(genre.name) + '</a></li>';
  }).join('');

  host.innerHTML =
    '<footer class="site-footer"><div class="wrap site-footer__inner">' +
      '<div class="site-footer__grid">' +
        '<div class="site-footer__about">' +
          '<a class="brand" href="' + url('index.html') + '">' + brandMarkup() + '</a>' +
          '<p>A free reading room for world literature. Fifteen books, five genres, no prices, no accounts and nothing to borrow. Read what the law allows, and keep your own shelf in this browser.</p>' +
        '</div>' +
        '<div><h3>Explore</h3><ul class="site-footer__list">' +
          '<li><a href="' + url('index.html') + '">Home</a></li>' +
          '<li><a href="' + url('pages/genres.html') + '">Genres</a></li>' +
          '<li><a href="' + url('pages/my-library.html') + '">My Library</a></li>' +
          '<li><a href="' + url('pages/about.html') + '">About</a></li>' +
        '</ul></div>' +
        '<div><h3>Genres</h3><ul class="site-footer__list">' + genreLinks + '</ul></div>' +
        '<div><h3>Good to know</h3><p class="site-footer__note">' +
          'Your favourites, reading statuses and bookmarks are stored only in this browser using localStorage. They are not an online account and will not follow you to another device.' +
        '</p><p class="site-footer__note">Reading texts are limited to works that are public domain in the source edition. Eight titles are listed for reference only.</p></div>' +
      '</div>' +
      '<div class="site-footer__bottom">' +
        '<span>Thornfield Library — an educational group project.</span>' +
        '<span>HTML5 · CSS3 · Vanilla JavaScript</span>' +
      '</div>' +
    '</div></footer>';
}

/* ------------------------------------------------------------- book cards */
/* The styled placeholder sits underneath the image. If the file is missing
   the image hides itself and the placeholder shows through, so a renamed or
   deleted asset never produces a broken-image icon. Students can replace any
   cover by dropping a new file at the same path (or editing books.js). */
function coverMarkup(book, className) {
  const title = escapeHtml(book.title);
  const author = escapeHtml(book.author);
  return '<span class="cover ' + (className || 'book-card__cover') + '">' +
    '<span class="cover-fallback" aria-hidden="true">' +
      '<span class="cover-fallback__title">' + title + '</span>' +
      '<span class="cover-fallback__author">' + author + '</span>' +
    '</span>' +
    '<img src="' + url(book.cover) + '" alt="Cover of ' + title + ' by ' + author + '" loading="lazy" ' +
      'onerror="this.style.display=\'none\'">' +
    '</span>';
}

function availabilityBadge(book) {
  return book.readingAvailable
    ? '<span class="badge badge--available">Read online</span>'
    : '<span class="badge badge--unavailable">Not available</span>';
}

function favoriteButtonMarkup(book, extraClass) {
  const pressed = Library.isFavorite(book.id);
  return '<button type="button" class="fav-btn ' + (extraClass || '') + '" data-fav-id="' + book.id + '" ' +
    'aria-pressed="' + pressed + '" aria-label="' + (pressed ? 'Remove ' : 'Add ') + escapeHtml(book.title) +
    ' ' + (pressed ? 'from' : 'to') + ' favourites">' + icon('heart') + '</button>';
}

function renderBookCard(book) {
  return '<article class="book-card" data-book-id="' + book.id + '">' +
    '<a class="book-card__cover-link" href="' + url('pages/book-details.html') + '?id=' + book.id + '" tabindex="-1" aria-hidden="true">' +
      coverMarkup(book) + '</a>' +
    '<div class="book-card__fav">' + favoriteButtonMarkup(book) + '</div>' +
    '<div class="book-card__body">' +
      '<span class="book-card__genre">' + escapeHtml(book.subgenre) + '</span>' +
      '<h3 class="book-card__title"><a href="' + url('pages/book-details.html') + '?id=' + book.id + '">' + escapeHtml(book.title) + '</a></h3>' +
      '<p class="book-card__author">' + escapeHtml(book.author) + ' · ' + escapeHtml(book.year) + '</p>' +
      '<div class="book-card__meta">' + availabilityBadge(book) + '</div>' +
    '</div>' +
  '</article>';
}

function renderBookGrid(books, extraClass) {
  if (!books.length) return '';
  return '<div class="book-grid ' + (extraClass || '') + '">' + books.map(renderBookCard).join('') + '</div>';
}

function renderBookRow(book, trailingHtml) {
  return '<article class="book-row" data-book-id="' + book.id + '">' +
    '<a class="book-row__cover" href="' + url('pages/book-details.html') + '?id=' + book.id + '" tabindex="-1" aria-hidden="true">' +
      coverMarkup(book, 'book-row__cover-img') + '</a>' +
    '<div><h3 class="book-row__title"><a href="' + url('pages/book-details.html') + '?id=' + book.id + '">' + escapeHtml(book.title) + '</a></h3>' +
      '<p class="book-row__meta">' + escapeHtml(book.author) + ' · ' + escapeHtml(book.year) + ' · ' + escapeHtml(book.genre) + '</p>' +
      '<div class="book-row__tags">' + availabilityBadge(book) + '</div>' +
    '</div>' +
    '<div class="book-row__actions">' + (trailingHtml || favoriteButtonMarkup(book)) + '</div>' +
  '</article>';
}

/* ---------------------------------------------------------- localStorage */
/* Two versioned keys. Bump the version if the shape ever changes. */
const STORAGE_KEYS = {
  library: 'thornfield.library.v1',
  prefs: 'thornfield.prefs.v1'
};

const READING_STATUSES = [
  { id: 'not-started', label: 'Not Started' },
  { id: 'reading', label: 'Currently Reading' },
  { id: 'completed', label: 'Completed' }
];

function statusLabel(statusId) {
  const found = READING_STATUSES.find(function (s) { return s.id === statusId; });
  return found ? found.label : 'Not Started';
}

function readStore(key) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    /* Private browsing or a corrupted value: fall back to an empty store
       rather than breaking every page. */
    return {};
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    toast('This browser is not allowing local storage, so changes will not be kept.', 'info');
    return false;
  }
}

function notifyLibraryChanged() {
  document.dispatchEvent(new CustomEvent('library:changed'));
  updateFavoritesCount();
}

const Library = {
  all: function () { return readStore(STORAGE_KEYS.library); },

  get: function (bookId) { return this.all()[bookId] || null; },

  isSaved: function (bookId) { return Boolean(this.get(bookId)); },

  /* Create the entry if it does not exist yet, then hand it back. */
  ensure: function (bookId) {
    const data = this.all();
    if (!data[bookId]) {
      data[bookId] = {
        favorite: false,
        status: 'not-started',
        savedAt: new Date().toISOString(),
        lastRead: null,
        progress: { chapter: 0, scroll: 0, percent: 0, updatedAt: null },
        bookmarks: []
      };
      writeStore(STORAGE_KEYS.library, data);
    }
    return data[bookId];
  },

  save: function (bookId) {
    this.ensure(bookId);
    notifyLibraryChanged();
    return this.get(bookId);
  },

  remove: function (bookId) {
    const data = this.all();
    delete data[bookId];
    writeStore(STORAGE_KEYS.library, data);
    notifyLibraryChanged();
  },

  patch: function (bookId, changes) {
    const entry = this.ensure(bookId);
    Object.assign(entry, changes);
    const data = this.all();
    data[bookId] = entry;
    writeStore(STORAGE_KEYS.library, data);
    notifyLibraryChanged();
    return entry;
  },

  isFavorite: function (bookId) {
    const entry = this.get(bookId);
    return Boolean(entry && entry.favorite);
  },

  toggleFavorite: function (bookId) {
    const entry = this.ensure(bookId);
    const next = !entry.favorite;
    this.patch(bookId, { favorite: next });
    return next;
  },

  favoriteIds: function () {
    const data = this.all();
    return Object.keys(data).filter(function (id) { return data[id].favorite; });
  },

  setStatus: function (bookId, status) {
    const valid = READING_STATUSES.some(function (s) { return s.id === status; });
    if (!valid) return null;
    return this.patch(bookId, { status: status });
  },

  statusOf: function (bookId) {
    const entry = this.get(bookId);
    return entry ? entry.status : 'not-started';
  },

  /* Called by the reader. `scroll` is 0–1 within the current chapter. */
  setProgress: function (bookId, chapter, scroll, percent) {
    const entry = this.ensure(bookId);
    const changes = {
      lastRead: new Date().toISOString(),
      progress: { chapter: chapter, scroll: scroll, percent: percent, updatedAt: new Date().toISOString() }
    };
    if (entry.status === 'not-started') changes.status = 'reading';
    return this.patch(bookId, changes);
  },

  addBookmark: function (bookId, bookmark) {
    const entry = this.ensure(bookId);
    const list = entry.bookmarks || [];
    const exists = list.some(function (b) { return b.chapter === bookmark.chapter && Math.abs(b.scroll - bookmark.scroll) < 0.01; });
    if (exists) return false;
    list.push(Object.assign({ createdAt: new Date().toISOString() }, bookmark));
    this.patch(bookId, { bookmarks: list });
    return true;
  },

  removeBookmark: function (bookId, createdAt) {
    const entry = this.ensure(bookId);
    this.patch(bookId, {
      bookmarks: (entry.bookmarks || []).filter(function (b) { return b.createdAt !== createdAt; })
    });
  },

  savedIds: function () { return Object.keys(this.all()); },

  idsByStatus: function (status) {
    const data = this.all();
    return Object.keys(data).filter(function (id) { return data[id].status === status; });
  }
};

const Prefs = {
  defaults: { fontSize: 19, theme: 'light' },
  get: function () {
    const stored = readStore(STORAGE_KEYS.prefs);
    return {
      fontSize: clamp(Number(stored.fontSize) || this.defaults.fontSize, 15, 30),
      theme: stored.theme === 'dark' ? 'dark' : 'light'
    };
  },
  set: function (changes) {
    const next = Object.assign(this.get(), changes);
    next.fontSize = clamp(next.fontSize, 15, 30);
    writeStore(STORAGE_KEYS.prefs, next);
    return next;
  }
};

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function updateFavoritesCount() {
  const node = document.getElementById('favorites-count');
  if (!node) return;
  const count = Library.favoriteIds().length;
  node.textContent = String(count);
  node.hidden = count === 0;
  const link = document.getElementById('favorites-shortcut');
  if (link) link.setAttribute('aria-label', count === 1 ? 'Favourites, 1 book' : 'Favourites, ' + count + ' books');
}

/* ------------------------------------------------------------------ toast */
function toast(message, iconName) {
  let region = document.getElementById('toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }
  const node = document.createElement('div');
  node.className = 'toast';
  node.innerHTML = icon(iconName || 'check') + '<span>' + escapeHtml(message) + '</span>';
  region.appendChild(node);
  window.setTimeout(function () {
    node.classList.add('is-leaving');
    window.setTimeout(function () { node.remove(); }, 260);
  }, 2600);
}

/* ----------------------------------------------------------------- search */
/* Fold accents so "Bronte" finds "Brontë" and "Dantes" finds "Dantès". */
function foldText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function searchBooks(query, genreId) {
  const needle = foldText(query).trim();
  let pool = BOOKS;
  if (genreId) {
    const genre = getGenreById(genreId);
    if (genre) pool = pool.filter(function (b) { return b.genre === genre.name; });
  }
  if (!needle) return pool;
  return pool.filter(function (book) {
    const haystack = foldText([book.title, book.subtitle, book.originalTitle, book.author, book.genre, book.subgenre].join(' '));
    return haystack.indexOf(needle) !== -1;
  });
}

let searchState = { query: '', genre: '' };

function buildSearchDialog() {
  if (document.getElementById('search-dialog')) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'search-dialog';
  dialog.className = 'search-dialog';
  dialog.setAttribute('aria-labelledby', 'search-dialog-title');

  const chips = ['<button type="button" class="chip" data-search-genre="" aria-pressed="true">All genres</button>']
    .concat(GENRES.map(function (genre) {
      return '<button type="button" class="chip" data-search-genre="' + genre.id + '" aria-pressed="false">' + escapeHtml(genre.name) + '</button>';
    })).join('');

  dialog.innerHTML =
    '<div class="search-dialog__head">' +
      '<div class="search-dialog__top">' +
        '<h2 class="search-dialog__title" id="search-dialog-title">Search the collection</h2>' +
        '<button type="button" class="search-dialog__close" id="search-close" aria-label="Close search">' + icon('close') + '</button>' +
      '</div>' +
      '<div class="search-field">' + icon('search') +
        '<label class="sr-only" for="search-input">Search by title, author or genre</label>' +
        '<input class="input" id="search-input" type="search" maxlength="120" autocomplete="off" placeholder="Title, author or genre — try “Austen” or “gothic”">' +
        '<button type="button" class="search-field__clear" id="search-clear" aria-label="Clear search" hidden>' + icon('close') + '</button>' +
      '</div>' +
      '<div class="search-dialog__filters" role="group" aria-label="Filter results by genre">' + chips + '</div>' +
    '</div>' +
    '<div class="search-dialog__body" id="search-body"></div>' +
    '<div class="search-dialog__foot"><span>Fifteen books · seven readable online</span><span><kbd>Esc</kbd> to close</span></div>';

  document.body.appendChild(dialog);

  const input = document.getElementById('search-input');
  const clear = document.getElementById('search-clear');

  input.addEventListener('input', function () {
    searchState.query = input.value;
    clear.hidden = input.value.length === 0;
    renderSearchResults();
  });
  clear.addEventListener('click', function () {
    input.value = '';
    searchState.query = '';
    clear.hidden = true;
    input.focus();
    renderSearchResults();
  });
  document.getElementById('search-close').addEventListener('click', function () { dialog.close(); });

  dialog.querySelectorAll('[data-search-genre]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      searchState.genre = chip.dataset.searchGenre;
      dialog.querySelectorAll('[data-search-genre]').forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === chip));
      });
      renderSearchResults();
    });
  });

  /* Clicking the backdrop closes the dialog. */
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
}

function renderSearchResults() {
  const body = document.getElementById('search-body');
  if (!body) return;
  const query = searchState.query.trim();
  const results = searchBooks(query, searchState.genre);
  const genre = searchState.genre ? getGenreById(searchState.genre) : null;

  let status;
  if (!query && !genre) {
    body.innerHTML = '<p class="search-dialog__hint">Type a title, an author or a genre. All fifteen books are listed below.</p>' +
      '<div class="search-results">' + BOOKS.map(function (b) { return renderBookRow(b); }).join('') + '</div>';
    return;
  }
  if (!results.length) {
    status = 'No books match “' + escapeHtml(query) + '”' + (genre ? ' in ' + escapeHtml(genre.name) : '') + '.';
  } else {
    status = results.length + (results.length === 1 ? ' book' : ' books') +
      (query ? ' matching “' + escapeHtml(query) + '”' : '') + (genre ? ' in ' + escapeHtml(genre.name) : '');
  }

  if (!results.length) {
    body.innerHTML = '<p class="search-dialog__status">' + status + '</p>' +
      '<div class="empty-state">' +
        '<span class="empty-state__icon">' + icon('search') + '</span>' +
        '<h3>Nothing on that shelf</h3>' +
        '<p>Try an author’s surname, a shorter phrase, or clear the genre filter. The collection holds exactly fifteen books.</p>' +
        '<button type="button" class="btn btn--ghost btn--small" id="search-reset">Clear search and filters</button>' +
      '</div>';
    const reset = document.getElementById('search-reset');
    if (reset) reset.addEventListener('click', function () {
      searchState = { query: '', genre: '' };
      const input = document.getElementById('search-input');
      input.value = '';
      document.getElementById('search-clear').hidden = true;
      document.querySelectorAll('[data-search-genre]').forEach(function (chip) {
        chip.setAttribute('aria-pressed', String(chip.dataset.searchGenre === ''));
      });
      renderSearchResults();
      input.focus();
    });
    return;
  }

  body.innerHTML = '<p class="search-dialog__status">' + status + '</p>' +
    '<div class="search-results">' + results.map(function (b) { return renderBookRow(b); }).join('') + '</div>';
}

function openSearch(initialQuery) {
  buildSearchDialog();
  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  searchState.query = initialQuery || '';
  input.value = searchState.query;
  document.getElementById('search-clear').hidden = !searchState.query;
  renderSearchResults();
  if (!dialog.open) dialog.showModal();
  input.focus();
  input.select();
}

/* ------------------------------------------------- favourite button wiring */
/* One delegated listener handles every favourite button on the page,
   including ones rendered later. */
function wireFavoriteButtons() {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-fav-id]');
    if (!button) return;
    event.preventDefault();
    const bookId = button.dataset.favId;
    const book = getBookById(bookId);
    if (!book) return;
    const added = Library.toggleFavorite(bookId);
    syncFavoriteButtons(bookId);
    toast(added ? 'Added to favourites: ' + book.title : 'Removed from favourites: ' + book.title, 'heart');
  });

  document.addEventListener('library:changed', function () {
    document.querySelectorAll('[data-fav-id]').forEach(function (button) {
      applyFavoriteState(button, Library.isFavorite(button.dataset.favId));
    });
    updateFavoritesCount();
  });
}

function applyFavoriteState(button, pressed) {
  const book = getBookById(button.dataset.favId);
  button.setAttribute('aria-pressed', String(pressed));
  if (book) {
    button.setAttribute('aria-label', (pressed ? 'Remove ' : 'Add ') + book.title + (pressed ? ' from' : ' to') + ' favourites');
  }
  const label = button.querySelector('[data-fav-label]');
  if (label) label.textContent = pressed ? 'Favourited' : 'Add to favourites';
}

function syncFavoriteButtons(bookId) {
  document.querySelectorAll('[data-fav-id="' + bookId + '"]').forEach(function (button) {
    applyFavoriteState(button, Library.isFavorite(bookId));
  });
}

/* --------------------------------------------------------------- formatting */
function formatDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function authorInitials(name) {
  return name.split(/\s+/).filter(function (part) { return /[A-Za-zÀ-ÿ]/.test(part[0]); })
    .map(function (part) { return part[0].toUpperCase(); }).slice(0, 2).join('');
}

/* A shared "book not found" panel for the details and reading pages. */
function renderNotFound(kind, requestedId) {
  return '<div class="wrap section"><div class="empty-state">' +
    '<span class="empty-state__icon">' + icon('book') + '</span>' +
    '<h1>' + escapeHtml(kind) + ' not found</h1>' +
    '<p>' + (requestedId ? 'Nothing in this collection matches “' + escapeHtml(requestedId) + '”. ' : '') +
    'The library holds fifteen books across five genres.</p>' +
    '<div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn--primary" href="' + url('pages/genres.html') + '">Browse the genres</a>' +
      '<a class="btn btn--ghost" href="' + url('index.html') + '">Back to home</a>' +
    '</div></div></div>';
}

/* ------------------------------------------------------------------- boot */
function initShared() {
  renderHeader();
  renderFooter();
  hydrateIcons(document);
  wireFavoriteButtons();
  buildSearchDialog();

  /* "/" or Ctrl/Cmd+K opens search, unless the user is already typing. */
  document.addEventListener('keydown', function (event) {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((event.key === '/' && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      openSearch('');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}