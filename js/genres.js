/* ==========================================================================
   genres.js — MEMBER 2 (pages/genres.html + pages/genre-details.html)

   One script, two views:
     · #genre-directory exists  → render the five portals (genres.html)
     · #genre-root exists       → render one genre room (genre-details.html),
                                  chosen by ?genre=<id> in the URL

   The room view keeps its filter state (subgenre, search text, sort order)
   in a small object and re-renders only the collection grid, so typing in
   the search box never loses focus. The active subgenre is written back to
   the URL with history.replaceState so filtered shelves stay shareable.
   ========================================================================== */

(function () {
  'use strict';

  var ROMAN = ['I', 'II', 'III', 'IV', 'V'];

  /* Each room gets one engraved emblem from the shared icon set. */
  var MOTIF_ICONS = {
    'dark-fiction': 'moon',
    'romance': 'feather',
    'fantasy': 'leaf',
    'mystery-crime': 'search',
    'adventure-historical': 'compass'
  };

  var directory = document.getElementById('genre-directory');
  if (directory) renderDirectory(directory);

  var roomRoot = document.getElementById('genre-root');
  if (roomRoot) initGenreRoom(roomRoot);

  /* ======================================================== DIRECTORY VIEW */
  function renderDirectory(host) {
    host.innerHTML = GENRES.map(function (genre, i) {
      var books = getBooksByGenre(genre.id);
      var readable = books.filter(function (b) { return b.readingAvailable; }).length;
      var roomUrl = url('pages/genre-details.html') + '?genre=' + genre.id;

      var subChips = genre.subgenres.map(function (sub) {
        var count = books.filter(function (b) { return b.subgenre === sub; }).length;
        return '<a class="chip" href="' + roomUrl + '&sub=' + encodeURIComponent(sub) + '">' +
          escapeHtml(sub) + '<span class="chip__count">' + count + '</span></a>';
      }).join('');

      var minis = books.map(function (book) {
        return '<a class="genre-portal__mini" href="' + url('pages/book-details.html') + '?id=' + book.id + '" ' +
          'title="' + escapeHtml(book.title) + ' — ' + escapeHtml(book.author) + '" ' +
          'aria-label="' + escapeHtml(book.title) + ' by ' + escapeHtml(book.author) + '">' +
          coverMarkup(book, 'genre-portal__mini-img') + '</a>';
      }).join('');

      return '<article class="genre-portal' + (i % 2 === 1 ? ' genre-portal--flip' : '') + '">' +
        '<a class="genre-portal__art" href="' + roomUrl + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + url(genre.image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
          '<span class="genre-portal__num">' + ROMAN[i] + '</span>' +
        '</a>' +
        '<div class="genre-portal__body">' +
          '<span class="eyebrow">Portal ' + ROMAN[i] + ' · ' + readable + ' of ' + books.length + ' readable online</span>' +
          '<h2 class="genre-portal__title"><a href="' + roomUrl + '">' + escapeHtml(genre.name) + '</a></h2>' +
          '<p class="genre-portal__tagline">' + escapeHtml(genre.tagline) + '</p>' +
          '<p class="genre-portal__desc">' + escapeHtml(genre.description) + '</p>' +
          '<div class="genre-portal__subs"><span class="genre-portal__subs-label">Subgenres</span>' + subChips + '</div>' +
          '<div class="genre-portal__shelf"><span class="genre-portal__shelf-label">On this shelf</span><span class="genre-portal__minis">' + minis + '</span></div>' +
          '<div class="genre-portal__foot">' +
            '<a class="btn btn--primary" href="' + roomUrl + '">Explore the room ' + icon('arrowRight') + '</a>' +
            '<span class="genre-portal__count">' + books.length + ' volumes</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ============================================================= ROOM VIEW */
  function initGenreRoom(root) {
    var genreId = getQueryParam('genre');
    var genre = getGenreById(genreId);

    if (!genre) {
      document.title = 'Genre not found — Thornfield Library';
      root.innerHTML = renderNotFound('Genre', genreId);
      return;
    }

    document.title = genre.name + ' — Thornfield Library';

    var books = getBooksByGenre(genre.id);
    var readable = books.filter(function (b) { return b.readingAvailable; }).length;
    var index = GENRES.indexOf(genre);

    /* ?sub= is honoured only when it is a real subgenre of this room. */
    var requestedSub = getQueryParam('sub');
    var state = {
      sub: genre.subgenres.indexOf(requestedSub) !== -1 ? requestedSub : '',
      query: '',
      sort: 'title-asc'
    };

    root.innerHTML = buildHero(genre, index, books.length, readable) +
      buildSubnav(genre, books, state.sub) +
      buildFeatured(genre, books) +
      buildCollection() +
      buildRelated(genre);

    var chips = Array.prototype.slice.call(root.querySelectorAll('[data-sub]'));
    var searchInput = document.getElementById('genre-search');
    var sortSelect = document.getElementById('genre-sort');
    var gridHost = document.getElementById('genre-grid');
    var emptyHost = document.getElementById('genre-empty');
    var countEl = document.getElementById('genre-shelf-count');
    var searchTimer = null;

    /* ---------------------------------------------------------- rendering */
    function filteredBooks() {
      var pool = books;
      if (state.sub) {
        pool = pool.filter(function (b) { return b.subgenre === state.sub; });
      }
      var query = state.query.trim();
      if (query) {
        /* Reuse the shared search so title/author matching behaves exactly
           like the global dialog, then keep only this room's books. */
        var matchedIds = searchBooks(query, genre.id).map(function (b) {
    return b.id;
});

pool = pool.filter(function (b) {
    return matchedIds.indexOf(b.id) !== -1;
});
}
      var sorted = pool.slice();
      switch (state.sort) {
        case 'title-desc':
          sorted.sort(function (a, b) { return b.title.localeCompare(a.title); });
          break;
        case 'year-asc':
          sorted.sort(function (a, b) { return a.firstPublished - b.firstPublished || a.title.localeCompare(b.title); });
          break;
        case 'year-desc':
          sorted.sort(function (a, b) { return b.firstPublished - a.firstPublished || a.title.localeCompare(b.title); });
          break;
        case 'author-asc':
          sorted.sort(function (a, b) { return a.author.localeCompare(b.author) || a.title.localeCompare(b.title); });
          break;
        default:
          sorted.sort(function (a, b) { return a.title.localeCompare(b.title); });
      }
      return sorted;
    }

    function renderCollection() {
      var result = filteredBooks();
      countEl.textContent = 'Showing ' + result.length + ' of ' + books.length + ' books' +
        (state.sub ? ' in ' + state.sub : '');

      if (!result.length) {
        gridHost.innerHTML = '';
        emptyHost.innerHTML =
          '<div class="empty-state">' +
            '<span class="empty-state__icon">' + icon('search') + '</span>' +
            '<h3>No books on this shelf</h3>' +
            '<p>Nothing matches ' + (state.query.trim() ? '“' + escapeHtml(state.query.trim()) + '”' : 'the current filters') +
              (state.sub ? ' in ' + escapeHtml(state.sub) : '') +
              '. This room holds exactly three books — try a shorter phrase or another subgenre.</p>' +
            '<button type="button" class="btn btn--ghost btn--small" id="genre-reset">Clear search and filters</button>' +
          '</div>';
        document.getElementById('genre-reset').addEventListener('click', function () {
          state.query = '';
          state.sub = '';
          state.sort = 'title-asc';
          searchInput.value = '';
          sortSelect.value = 'title-asc';
          syncChips();
          syncUrl();
          renderCollection();
          searchInput.focus();
        });
        return;
      }

      emptyHost.innerHTML = '';
      gridHost.innerHTML = renderBookGrid(result);
    }

    function syncChips() {
      chips.forEach(function (chip) {
        chip.setAttribute('aria-pressed', String(chip.dataset.sub === state.sub));
      });
    }

    /* Keep ?genre= and ?sub= in the address bar without adding history entries. */
    function syncUrl() {
      var params = new URLSearchParams();
      params.set('genre', genre.id);
      if (state.sub) params.set('sub', state.sub);
      window.history.replaceState(null, '', window.location.pathname + '?' + params.toString());
    }

    /* ------------------------------------------------------------- events */
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.sub = chip.dataset.sub;
        syncChips();
        syncUrl();
        renderCollection();
      });
    });

    searchInput.addEventListener('input', function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        state.query = searchInput.value;
        renderCollection();
      }, 120);
    });

    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      renderCollection();
    });

    syncChips();
    renderCollection();
  }

  /* --------------------------------------------------------- room markup */
  function buildHero(genre, index, total, readable) {
    return '<section class="genre-hero" data-genre="' + genre.id + '" aria-labelledby="genre-title">' +
      '<img class="genre-hero__art" src="' + url(genre.image) + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'">' +
      '<div class="genre-hero__overlay" aria-hidden="true"></div>' +
      '<div class="wrap genre-hero__inner">' +
        '<div class="genre-hero__content">' +
          '<nav aria-label="Breadcrumb"><ol class="breadcrumb">' +
            '<li><a href="' + url('index.html') + '">Home</a></li>' +
            '<li class="breadcrumb__sep" aria-hidden="true">/</li>' +
            '<li><a href="' + url('pages/genres.html') + '">Genres</a></li>' +
            '<li class="breadcrumb__sep" aria-hidden="true">/</li>' +
            '<li aria-current="page">' + escapeHtml(genre.name) + '</li>' +
          '</ol></nav>' +
          '<span class="eyebrow eyebrow--on-dark">Genre portal ' + ROMAN[index] + '</span>' +
          '<h1 id="genre-title">' + escapeHtml(genre.name) + '</h1>' +
          '<p class="genre-hero__tagline">' + escapeHtml(genre.tagline) + '</p>' +
          '<p class="genre-hero__desc">' + escapeHtml(genre.description) + '</p>' +
          '<p class="genre-hero__stats">' +
            '<span><strong>' + total + '</strong> volumes</span>' +
            '<span><strong>' + readable + '</strong> readable online</span>' +
            '<span><strong>' + genre.subgenres.length + '</strong> subgenres</span>' +
          '</p>' +
        '</div>' +
        '<span class="genre-hero__emblem" aria-hidden="true">' + icon(MOTIF_ICONS[genre.id] || 'book') + '</span>' +
      '</div>' +
    '</section>';
  }

  function buildSubnav(genre, books, activeSub) {
    var chips = '<button type="button" class="chip" data-sub="" aria-pressed="' + (activeSub === '') + '">All' +
      '<span class="chip__count">' + books.length + '</span></button>';
    chips += genre.subgenres.map(function (sub) {
      var count = books.filter(function (b) { return b.subgenre === sub; }).length;
      return '<button type="button" class="chip" data-sub="' + escapeHtml(sub) + '" aria-pressed="' + (activeSub === sub) + '">' +
        escapeHtml(sub) + '<span class="chip__count">' + count + '</span></button>';
    }).join('');

    return '<div class="genre-subnav">' +
      '<div class="wrap genre-subnav__inner" role="group" aria-labelledby="genre-subnav-label">' +
        '<span class="genre-subnav__label" id="genre-subnav-label">Filter by subgenre</span>' + chips +
      '</div>' +
    '</div>';
  }

  function buildFeatured(genre, books) {
    var cards = books.map(function (book) {
      var actions = '<a class="btn btn--ghost btn--small" href="' + url('pages/book-details.html') + '?id=' + book.id + '">Details</a>' +
        (book.readingAvailable
          ? '<a class="btn btn--primary btn--small" href="' + url('pages/read.html') + '?id=' + book.id + '">Read now ' + icon('openBook') + '</a>'
          : availabilityBadge(book));
      return '<article class="genre-spotlight">' +
        '<a class="genre-spotlight__cover" href="' + url('pages/book-details.html') + '?id=' + book.id + '" tabindex="-1" aria-hidden="true">' +
          coverMarkup(book, 'genre-spotlight__cover-img') +
        '</a>' +
        '<div class="genre-spotlight__body">' +
          '<span class="badge badge--sub">' + escapeHtml(book.subgenre) + '</span>' +
          '<h3 class="genre-spotlight__title"><a href="' + url('pages/book-details.html') + '?id=' + book.id + '">' + escapeHtml(book.title) + '</a></h3>' +
          '<p class="genre-spotlight__author">' + escapeHtml(book.author) + ' · ' + escapeHtml(book.year) + '</p>' +
          '<p class="genre-spotlight__desc">' + escapeHtml(book.description) + '</p>' +
          '<div class="genre-spotlight__actions">' + actions + '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    return '<section class="section" aria-labelledby="genre-featured-title">' +
      '<div class="wrap">' +
        '<div class="section-head">' +
          '<div class="section-head__text">' +
            '<span class="eyebrow">The three volumes of this room</span>' +
            '<h2 id="genre-featured-title">Featured in ' + escapeHtml(genre.name) + '</h2>' +
            '<p>Every book in this genre, given room to breathe.</p>' +
          '</div>' +
        '</div>' +
        '<div class="genre-featured">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

  function buildCollection() {
    return '<section class="section section--surface genre-collection" aria-labelledby="genre-collection-title">' +
      '<div class="wrap">' +
        '<div class="section-head">' +
          '<div class="section-head__text">' +
            '<span class="eyebrow">Search, sort, filter</span>' +
            '<h2 id="genre-collection-title">The complete shelf</h2>' +
          '</div>' +
        '</div>' +
        '<div class="filter-bar">' +
          '<div class="filter-bar__group">' +
            '<div class="field">' +
              '<label class="field__label" for="genre-search">Search this genre</label>' +
              '<div class="search-field">' + icon('search') +
                '<input class="input" id="genre-search" type="search" maxlength="120" autocomplete="off" placeholder="Title or author — try “Dumas”">' +
              '</div>' +
            '</div>' +
            '<div class="field">' +
              '<label class="field__label" for="genre-sort">Sort by</label>' +
              '<select class="select" id="genre-sort">' +
                '<option value="title-asc">Title (A–Z)</option>' +
                '<option value="title-desc">Title (Z–A)</option>' +
                '<option value="year-asc">Year (oldest first)</option>' +
                '<option value="year-desc">Year (newest first)</option>' +
                '<option value="author-asc">Author (A–Z)</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<p class="filter-bar__count" id="genre-shelf-count" role="status" aria-live="polite"></p>' +
        '</div>' +
        '<div id="genre-grid"></div>' +
        '<div id="genre-empty" class="genre-collection__empty"></div>' +
      '</div>' +
    '</section>';
  }

  function buildRelated(genre) {
    var cards = genre.related.map(function (id) {
      var other = getGenreById(id);
      if (!other) return '';
      return '<a class="genre-related__card" href="' + url('pages/genre-details.html') + '?genre=' + other.id + '">' +
        '<div class="genre-related__art"><img src="' + url(other.image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>' +
        '<div class="genre-related__body">' +
          '<h3 class="genre-related__name">' + escapeHtml(other.name) + icon('arrowRight') + '</h3>' +
          '<span class="genre-related__tagline">' + escapeHtml(other.tagline) + '</span>' +
          '<span class="genre-related__count">' + countBooksInGenre(other.id) + ' books</span>' +
        '</div>' +
      '</a>';
    }).join('');

    return '<section class="section" aria-labelledby="genre-related-title">' +
      '<div class="wrap">' +
        '<div class="section-head">' +
          '<div class="section-head__text">' +
            '<span class="eyebrow">Adjacent rooms</span>' +
            '<h2 id="genre-related-title">Related genres</h2>' +
            '<p>Two doors that share a wall with this one.</p>' +
          '</div>' +
        '</div>' +
        '<div class="genre-related">' + cards + '</div>' +
        '<div class="btn-row genre-back">' +
          '<a class="btn btn--ghost" href="' + url('pages/genres.html') + '">' + icon('arrowLeft') + ' Back to the directory</a>' +
        '</div>' +
      '</div>' +
    '</section>';
  }
})();