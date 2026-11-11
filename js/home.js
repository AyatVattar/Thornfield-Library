/* ==========================================================================
   home.js — MEMBER 1 (index.html only)

   Renders the homepage from the shared data in books.js and wires the hero
   search bar. Nothing here writes to localStorage directly; favourites go
   through the shared Library API in app.js.

   Runs after books.js and app.js (see the defer order in index.html), so all
   shared helpers — url(), icon(), renderBookGrid(), searchBooks()… — exist.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------- hero reading-desk pick */
  /* The first featured book that can actually be read online. */
  var pick = getFeaturedBooks().find(function (book) { return book.readingAvailable; }) || BOOKS[0];
  var spotlight = document.getElementById('hero-spotlight');
  if (spotlight) {
    spotlight.innerHTML =
      '<div class="hero-spot">' +
        '<a class="hero-spot__cover" href="' + url('pages/book-details.html') + '?id=' + pick.id + '" tabindex="-1" aria-hidden="true">' +
          coverMarkup(pick, 'hero-spot__cover-img') +
        '</a>' +
        '<div class="hero-spot__info">' +
          '<span class="badge badge--sub">' + escapeHtml(pick.subgenre) + '</span>' +
          '<h3 class="hero-spot__title"><a href="' + url('pages/book-details.html') + '?id=' + pick.id + '">' + escapeHtml(pick.title) + '</a></h3>' +
          '<p class="hero-spot__author">' + escapeHtml(pick.author) + ' · ' + escapeHtml(pick.year) + '</p>' +
          availabilityBadge(pick) +
          '<a class="btn btn--primary btn--small" href="' + url('pages/read.html') + '?id=' + pick.id + '">Read now ' + icon('arrowRight') + '</a>' +
        '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------ catalogue card */
  /* Counts are derived from BOOKS so the card can never drift from the data. */
  var indexList = document.getElementById('home-index-list');
  if (indexList) {
    var readable = BOOKS.filter(function (book) { return book.readingAvailable; }).length;
    var rows = [
      ['Volumes', BOOKS.length],
      ['Genres', GENRES.length],
      ['Readable online', readable],
      ['Listed for reference', BOOKS.length - readable],
      ['Price', 'Free'],
      ['Account', 'None']
    ];
    indexList.innerHTML = rows.map(function (row) {
      return '<div class="home-index-card__row"><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>';
    }).join('');
  }

  /* ------------------------------------------------------- five genre doors */
  var ROMAN = ['I', 'II', 'III', 'IV', 'V'];
  var strip = document.getElementById('home-genre-strip');
  if (strip) {
    strip.innerHTML = GENRES.map(function (genre, i) {
      var count = countBooksInGenre(genre.id);
      return '<a class="genre-tile" href="' + url('pages/genre-details.html') + '?genre=' + genre.id + '">' +
        '<div class="genre-tile__art">' +
          '<span class="genre-tile__num" aria-hidden="true">' + ROMAN[i] + '</span>' +
          '<img src="' + url(genre.image) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="genre-tile__body">' +
          '<h3 class="genre-tile__name">' + escapeHtml(genre.name) + '</h3>' +
          '<span class="genre-tile__tagline">' + escapeHtml(genre.tagline) + '</span>' +
          '<span class="genre-tile__foot">' +
            '<span class="genre-tile__count">' + count + ' books</span>' +
            '<span class="genre-tile__explore">Explore ' + icon('arrowRight') + '</span>' +
          '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ------------------------------------------- featured / recent / recommended */
  var featuredHost = document.getElementById('home-featured');
  if (featuredHost) featuredHost.innerHTML = renderBookGrid(getFeaturedBooks());

  var recentHost = document.getElementById('home-recent');
  if (recentHost) recentHost.innerHTML = renderBookGrid(getRecentlyAddedBooks(5));

  var recommendedHost = document.getElementById('home-recommended');
  if (recommendedHost) {
    recommendedHost.innerHTML = getRecommendedBooks(5).map(function (book) {
      return renderBookRow(book);
    }).join('');
  }

  /* ------------------------------------------------------------ hero search */
  /* Typing shows up to six live suggestions; Enter (or the Search button)
     opens the shared full-search dialog with the same query. */
  var form = document.getElementById('home-search-form');
  var input = document.getElementById('home-search-input');
  var panel = document.getElementById('home-search-panel');
  var status = document.getElementById('home-search-status');
  var list = document.getElementById('home-search-list');
  if (!form || !input || !panel || !status || !list) return;

  var debounceTimer = null;

  function hidePanel() {
    panel.hidden = true;
  }

  function suggestionRow(book) {
    return '<a class="home-search-result" href="' + url('pages/book-details.html') + '?id=' + book.id + '">' +
      '<span class="home-search-result__text">' +
        '<span class="home-search-result__title">' + escapeHtml(book.title) + '</span>' +
        '<span class="home-search-result__meta">' + escapeHtml(book.author) + ' · ' + escapeHtml(book.year) + ' · ' + escapeHtml(book.genre) + '</span>' +
      '</span>' +
      availabilityBadge(book) +
    '</a>';
  }

  function renderSuggestions() {
    var query = input.value.trim();
    if (!query) {
      hidePanel();
      return;
    }
    var results = searchBooks(query);
    var html = '';

    if (!results.length) {
      status.textContent = 'No books match “' + query + '”.';
      html = '<p class="home-search-panel__empty">Nothing on that shelf. The collection holds exactly fifteen books — try an author’s surname, a shorter phrase, or a genre.</p>' +
        '<button type="button" class="home-search-panel__more" data-open-full>Open the full search</button>';
    } else {
      status.textContent = results.length + (results.length === 1 ? ' book' : ' books') + ' match “' + query + '” — press Enter for the full search.';
      html = results.slice(0, 6).map(suggestionRow).join('');
      if (results.length > 6) {
        html += '<button type="button" class="home-search-panel__more" data-open-full>See all ' + results.length + ' results</button>';
      }
    }
    list.innerHTML = html;
    panel.hidden = false;
  }

  input.addEventListener('input', function () {
    /* Small debounce so fast typists do not re-render on every keystroke. */
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(renderSuggestions, 120);
  });

  input.addEventListener('focus', function () {
    if (input.value.trim()) renderSuggestions();
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') hidePanel();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hidePanel();
    openSearch(input.value.trim());
  });

  list.addEventListener('click', function (event) {
    if (event.target.closest('[data-open-full]')) {
      hidePanel();
      openSearch(input.value.trim());
    }
  });

  /* Clicking anywhere outside the search closes the suggestion panel. */
  document.addEventListener('click', function (event) {
    if (!form.contains(event.target)) hidePanel();
  });
})();