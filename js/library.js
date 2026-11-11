/* ============================================================
   library.js — MY LIBRARY PAGE

   Depends on:
   books.js
   app.js

   Uses the shared Library API.
   Does not access localStorage directly.
   ============================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('library-grid');

  if (!grid) return;


  /* ----------------------------------------------------------
     ELEMENTS
  ---------------------------------------------------------- */

  const emptyState = document.getElementById('library-empty');
  const emptyTitle = document.getElementById('library-empty-title');
  const emptyText = document.getElementById('library-empty-text');

  const searchInput = document.getElementById('library-search');
  const sortSelect = document.getElementById('library-sort');
  const resultCount = document.getElementById('library-result-count');

  const statTotal = document.getElementById('stat-total');
  const statReading = document.getElementById('stat-reading');
  const statCompleted = document.getElementById('stat-completed');
  const statFavorites = document.getElementById('stat-favorites');

  const filterButtons = Array.from(
    document.querySelectorAll('[data-filter]')
  );


  /* ----------------------------------------------------------
     PAGE STATE
  ---------------------------------------------------------- */

  const state = {
    filter: 'all',
    query: '',
    sort: 'recent'
  };


  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */

  function getSavedBooks() {
    const savedData = Library.all();

    return Object.keys(savedData)
      .map(function (id) {
        const book = getBookById(id);

        if (!book) return null;

        return {
          book: book,
          entry: savedData[id]
        };
      })
      .filter(Boolean);
  }


  function getProgress(entry) {
    const percent = Number(
      entry.progress && entry.progress.percent
    );

    if (!Number.isFinite(percent)) return 0;

    return Math.max(0, Math.min(100, Math.round(percent)));
  }


  function getStatusText(status) {
    return statusLabel(status || 'not-started');
  }


  function getEmptyMessage() {
    if (state.query.trim()) {
      return {
        title: 'No matching books',
        text: 'Try another title or author name.'
      };
    }

    switch (state.filter) {
      case 'favorites':
        return {
          title: 'No favourites yet',
          text: 'Books you mark with a heart will appear on this shelf.'
        };

      case 'reading':
        return {
          title: 'No books in progress',
          text: 'When you start reading a book, it will appear here.'
        };

      case 'completed':
        return {
          title: 'No completed books',
          text: 'Finished books will be collected here.'
        };

      case 'not-started':
        return {
          title: 'No unread books',
          text: 'There are no saved books waiting to be read.'
        };

      default:
        return {
          title: 'Your shelf is empty',
          text: 'Explore the collection and save your first book.'
        };
    }
  }


  /* ----------------------------------------------------------
     STATISTICS
  ---------------------------------------------------------- */

  function renderStatistics() {
    const saved = getSavedBooks();

    const total = saved.length;

    const reading = saved.filter(function (item) {
      return item.entry.status === 'reading';
    }).length;

    const completed = saved.filter(function (item) {
      return item.entry.status === 'completed';
    }).length;

    const favorites = saved.filter(function (item) {
      return item.entry.favorite;
    }).length;

    statTotal.textContent = total;
    statReading.textContent = reading;
    statCompleted.textContent = completed;
    statFavorites.textContent = favorites;
  }


  /* ----------------------------------------------------------
     FILTERING
  ---------------------------------------------------------- */

  function getFilteredBooks() {
    let books = getSavedBooks();

    /* Filter by category */

    switch (state.filter) {
      case 'favorites':
        books = books.filter(function (item) {
          return item.entry.favorite;
        });
        break;

      case 'reading':
        books = books.filter(function (item) {
          return item.entry.status === 'reading';
        });
        break;

      case 'completed':
        books = books.filter(function (item) {
          return item.entry.status === 'completed';
        });
        break;

      case 'not-started':
        books = books.filter(function (item) {
          return item.entry.status === 'not-started';
        });
        break;
    }


    /* Search by title, author or genre */

    const query = foldText(state.query).trim();

    if (query) {
      books = books.filter(function (item) {
        const book = item.book;

        const searchable = foldText([
          book.title,
          book.subtitle,
          book.originalTitle,
          book.author,
          book.genre,
          book.subgenre
        ].join(' '));

        return searchable.includes(query);
      });
    }


    /* Sorting */

    switch (state.sort) {
      case 'title':
        books.sort(function (a, b) {
          return a.book.title.localeCompare(b.book.title);
        });
        break;

      case 'author':
        books.sort(function (a, b) {
          return a.book.author.localeCompare(b.book.author);
        });
        break;

      case 'progress':
        books.sort(function (a, b) {
          return getProgress(b.entry) - getProgress(a.entry);
        });
        break;

      default:
        books.sort(function (a, b) {
          const dateA = new Date(a.entry.savedAt || 0).getTime();
          const dateB = new Date(b.entry.savedAt || 0).getTime();

          return dateB - dateA;
        });
    }

    return books;
  }


  /* ----------------------------------------------------------
     BOOK CARD
  ---------------------------------------------------------- */

  function renderLibraryBook(item) {
    const book = item.book;
    const entry = item.entry;

    const progress = getProgress(entry);
    const status = entry.status || 'not-started';

    const cover = coverMarkup(
      book,
      'library-book__cover'
    );

    const favoriteButton = favoriteButtonMarkup(
      book,
      'library-book__favorite'
    );

    const progressMarkup = `
      <div class="library-progress">

        <div class="library-progress__top">
          <span>Reading progress</span>
          <span>${progress}%</span>
        </div>

        <div
          class="library-progress__track"
          role="progressbar"
          aria-label="Reading progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${progress}">

          <div
            class="library-progress__bar"
            style="width: ${progress}%">
          </div>

        </div>

      </div>
    `;


    return `
      <article class="library-book" data-book-id="${escapeHtml(book.id)}">

        <a
          class="library-book__cover-link"
          href="${url('pages/book-details.html')}?id=${encodeURIComponent(book.id)}"
          aria-label="View ${escapeHtml(book.title)}">

          ${cover}

        </a>


        <div class="library-book__body">

          <span class="library-book__genre">
            ${escapeHtml(book.subgenre)}
          </span>

          <h3 class="library-book__title">

            <a href="${url('pages/book-details.html')}?id=${encodeURIComponent(book.id)}">
              ${escapeHtml(book.title)}
            </a>

          </h3>

          <p class="library-book__author">
            ${escapeHtml(book.author)} · ${escapeHtml(book.year)}
          </p>


          <div class="library-book__status">

            <span
              class="library-status-label"
              data-status="${escapeHtml(status)}">

              ${escapeHtml(getStatusText(status))}

            </span>

            ${availabilityBadge(book)}

          </div>


          ${progressMarkup}


          <div class="library-book__actions">

            <label class="sr-only" for="status-${escapeHtml(book.id)}">
              Reading status for ${escapeHtml(book.title)}
            </label>

            <select
              class="library-book__status-select"
              id="status-${escapeHtml(book.id)}"
              data-status-id="${escapeHtml(book.id)}">

              <option value="not-started" ${status === 'not-started' ? 'selected' : ''}>
                Not Started
              </option>

              <option value="reading" ${status === 'reading' ? 'selected' : ''}>
                Currently Reading
              </option>

              <option value="completed" ${status === 'completed' ? 'selected' : ''}>
                Completed
              </option>

            </select>


            ${favoriteButton}


            <button
              class="library-book__remove"
              type="button"
              data-remove-id="${escapeHtml(book.id)}"
              aria-label="Remove ${escapeHtml(book.title)} from your library"
              title="Remove from library">

              ${icon('trash')}

            </button>

          </div>

        </div>

      </article>
    `;
  }


  /* ----------------------------------------------------------
     EMPTY STATE
  ---------------------------------------------------------- */

  function renderEmptyState() {
    const message = getEmptyMessage();

    grid.innerHTML = '';

    emptyTitle.textContent = message.title;
    emptyText.textContent = message.text;

    emptyState.hidden = false;
  }


  /* ----------------------------------------------------------
     MAIN RENDER
  ---------------------------------------------------------- */

  function renderLibrary() {
    renderStatistics();

    const books = getFilteredBooks();

    resultCount.textContent =
      books.length +
      (books.length === 1
        ? ' book on your shelf'
        : ' books on your shelf');


    if (!books.length) {
      renderEmptyState();
      return;
    }

    emptyState.hidden = true;

    grid.innerHTML = books
      .map(renderLibraryBook)
      .join('');
  }


  /* ----------------------------------------------------------
     FILTER BUTTONS
  ---------------------------------------------------------- */

  filterButtons.forEach(function (button) {

    button.addEventListener('click', function () {

      state.filter = button.dataset.filter;

      filterButtons.forEach(function (other) {
        const active = other === button;

        other.classList.toggle('is-active', active);

        other.setAttribute(
          'aria-pressed',
          String(active)
        );
      });

      renderLibrary();

    });

  });


  /* ----------------------------------------------------------
     SEARCH
  ---------------------------------------------------------- */

  searchInput.addEventListener('input', function () {

    state.query = searchInput.value;

    renderLibrary();

  });


  /* ----------------------------------------------------------
     SORT
  ---------------------------------------------------------- */

  sortSelect.addEventListener('change', function () {

    state.sort = sortSelect.value;

    renderLibrary();

  });


  /* ----------------------------------------------------------
     STATUS CHANGE
  ---------------------------------------------------------- */

  grid.addEventListener('change', function (event) {

    const select = event.target.closest('[data-status-id]');

    if (!select) return;

    const bookId = select.dataset.statusId;
    const newStatus = select.value;

    Library.setStatus(bookId, newStatus);

    toast('Reading status updated.', 'check');

    renderLibrary();

  });


  /* ----------------------------------------------------------
     REMOVE BOOK
  ---------------------------------------------------------- */

  grid.addEventListener('click', function (event) {

    const removeButton = event.target.closest('[data-remove-id]');

    if (!removeButton) return;

    const bookId = removeButton.dataset.removeId;
    const book = getBookById(bookId);

    if (!book) return;

    const confirmed = window.confirm(
      'Remove "' + book.title + '" from your library?'
    );

    if (!confirmed) return;

    Library.remove(bookId);

    toast('Book removed from your library.', 'check');

    renderLibrary();

  });


  /* ----------------------------------------------------------
     URL FILTER
  ---------------------------------------------------------- */

  const requestedView = getQueryParam('view');

  if (requestedView === 'favorites') {

    state.filter = 'favorites';

    filterButtons.forEach(function (button) {

      const active = button.dataset.filter === 'favorites';

      button.classList.toggle('is-active', active);

      button.setAttribute(
        'aria-pressed',
        String(active)
      );

    });

  }


  /* ----------------------------------------------------------
     SHARED LIBRARY EVENTS
  ---------------------------------------------------------- */

  document.addEventListener('library:changed', function () {
    renderLibrary();
  });


  /* ----------------------------------------------------------
     INITIAL RENDER
  ---------------------------------------------------------- */

  renderLibrary();

})();