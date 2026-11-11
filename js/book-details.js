/* ============================================================
   book-details.js — BOOK DETAILS PAGE

   Depends on:
   books.js
   app.js

   Uses shared book data and Library API.
   ============================================================ */

(function () {
  'use strict';


  /* ----------------------------------------------------------
     ROOT
  ---------------------------------------------------------- */

  const root = document.getElementById('book-details-root');

  if (!root) return;


  /* ----------------------------------------------------------
     GET BOOK FROM URL
  ---------------------------------------------------------- */

  const bookId = getQueryParam('id');
  const book = getBookById(bookId);


  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */

  function renderParagraphs(text) {
    if (!text) {
      return '<p>No information available.</p>';
    }

    return String(text)
      .split(/\n\s*\n/)
      .filter(function (paragraph) {
        return paragraph.trim().length > 0;
      })
      .map(function (paragraph) {
        return '<p>' + escapeHtml(paragraph.trim()) + '</p>';
      })
      .join('');
  }


  function renderMetadata(label, value) {
    if (!value) return '';

    return `
      <div class="book-meta">

        <span class="book-meta__label">
          ${escapeHtml(label)}
        </span>

        <span class="book-meta__value">
          ${escapeHtml(value)}
        </span>

      </div>
    `;
  }


  function getGenreLink() {
    const genre = getGenreByName(book.genre);

    if (!genre) {
      return url('pages/genres.html');
    }

    return url('pages/genre-details.html') +
      '?genre=' + encodeURIComponent(genre.id);
  }


  function getSaveButtonMarkup() {
    const saved = Library.isSaved(book.id);

    return `
      <button
        class="book-details__save ${saved ? 'is-saved' : ''}"
        id="book-save-toggle"
        type="button"
        aria-pressed="${saved}">

        ${icon(saved ? 'check' : 'plus')}

        <span>
          ${saved ? 'Saved to My Library' : 'Add to My Library'}
        </span>

      </button>
    `;
  }


  function getAvailabilityMarkup() {
    if (book.readingAvailable) {
      return `
        <div class="book-availability">

          <span class="book-availability__icon">
            ${icon('check')}
          </span>

          <div class="book-availability__content">

            <strong>Available to read online</strong>

            <p>
              This edition is available in the library's
              online reader. The reading text and its source
              are identified below.
            </p>

          </div>

        </div>
      `;
    }

    return `
      <div class="book-availability book-availability--unavailable">

        <span class="book-availability__icon">
          ${icon('info')}
        </span>

        <div class="book-availability__content">

          <strong>Reading text not available</strong>

          <p>
            This title is included for reference only.
            The library does not reproduce a protected text
            without permission.
          </p>

        </div>

      </div>
    `;
  }


  /* ----------------------------------------------------------
     NOT FOUND
  ---------------------------------------------------------- */

  if (!book) {
    document.title = 'Book Not Found — Thornfield Library';

    root.innerHTML = `
      <div class="book-details-not-found">
        ${renderNotFound('Book', bookId)}
      </div>
    `;

    return;
  }


  /* ----------------------------------------------------------
     PAGE TITLE
  ---------------------------------------------------------- */

  document.title = book.title + ' — Thornfield Library';


  /* ----------------------------------------------------------
     RELATED BOOKS
  ---------------------------------------------------------- */

  function renderRelatedBooks() {
    const relatedBooks = getRelatedBooks(book, 3);

    if (!relatedBooks.length) return '';

    return `
      <section class="details-related">

        <div class="details-related__head">

          <div>
            <span class="eyebrow">Continue exploring</span>
            <h2>From the same shelf</h2>
          </div>

          <a
            class="details-related__link"
            href="${getGenreLink()}">

            Explore ${escapeHtml(book.genre)}

            ${icon('arrowRight')}

          </a>

        </div>

        ${renderBookGrid(relatedBooks, 'details-related__grid')}

      </section>
    `;
  }


  /* ----------------------------------------------------------
     MAIN PAGE
  ---------------------------------------------------------- */

  function renderBookDetails() {

    const originalTitle = book.originalTitle
      ? `
        <p class="book-details__original">
          ${escapeHtml(book.originalTitle)}
        </p>
      `
      : '';

    const synopsis = book.synopsis
      ? renderParagraphs(book.synopsis)
      : renderParagraphs(book.description);

    const biography = renderParagraphs(book.biography);

    const publicationNote = book.publicationNote
      ? `
        <div class="details-publication">

          <span>Publication note</span>

          <p>
            ${escapeHtml(book.publicationNote)}
          </p>

        </div>
      `
      : '';

    const readingNote = book.readingNote
      ? `
        <div class="details-publication">

          <span>Edition and source note</span>

          <p>
            ${escapeHtml(book.readingNote)}
          </p>

        </div>
      `
      : '';

    const readButton = book.readingAvailable
      ? `
        <a
          class="btn btn--primary"
          href="${url('pages/read.html')}?id=${encodeURIComponent(book.id)}">

          ${icon('openBook')}

          Read online

        </a>
      `
      : `
        <button
          class="btn btn--primary"
          type="button"
          disabled
          aria-disabled="true">

          ${icon('lock')}

          Not available

        </button>
      `;


    root.innerHTML = `

      <div class="wrap book-details">


        <!-- BREADCRUMB -->

        <nav class="details-breadcrumb" aria-label="Breadcrumb">

          <a href="${url('index.html')}">
            Home
          </a>

          <span aria-hidden="true">/</span>

          <a href="${url('pages/genres.html')}">
            Genres
          </a>

          <span aria-hidden="true">/</span>

          <a href="${getGenreLink()}">
            ${escapeHtml(book.genre)}
          </a>

          <span aria-hidden="true">/</span>

          <span aria-current="page">
            ${escapeHtml(book.title)}
          </span>

        </nav>


        <!-- MAIN BOOK INFORMATION -->

        <section class="book-details__hero">


          <!-- COVER -->

          <div class="book-details__visual">

            <div class="book-details__cover">

              ${coverMarkup(book, 'book-details__cover-image')}

            </div>

            <p class="book-details__visual-note">
              A volume from the Thornfield collection
            </p>

          </div>


          <!-- INFORMATION -->

          <div class="book-details__info">

            <div class="book-details__eyebrow">

              <span>
                ${escapeHtml(book.genre)}
              </span>

              <span aria-hidden="true">·</span>

              <span>
                ${escapeHtml(book.subgenre)}
              </span>

            </div>


            <h1>
              ${escapeHtml(book.title)}
            </h1>


            ${originalTitle}


            <p class="book-details__author">
              By
              <strong>${escapeHtml(book.author)}</strong>
            </p>


            <p class="book-details__description">
              ${escapeHtml(book.description)}
            </p>


            <!-- METADATA -->

            <div class="book-details__metadata">

              ${renderMetadata('Author', book.author)}

              ${renderMetadata('Nationality', book.nationality)}

              ${renderMetadata('First published', book.year)}

              ${renderMetadata('Genre', book.genre)}

              ${renderMetadata('Subgenre', book.subgenre)}

              ${renderMetadata(
                'Reading status',
                book.readingAvailable ? 'Available online' : 'Reference only'
              )}

            </div>


            <!-- ACTIONS -->

            <div class="book-details__actions">

              ${readButton}

              ${getSaveButtonMarkup()}

              ${favoriteButtonMarkup(
                book,
                'book-details__favorite'
              )}

            </div>


            <!-- AVAILABILITY -->

            ${getAvailabilityMarkup()}

          </div>

        </section>


        <!-- SYNOPSIS -->

        <section class="details-section">

          <div class="details-section__heading">

            <span class="details-section__number">
              01
            </span>

            <h2>About the book</h2>

          </div>

          <div class="details-section__text">
            ${synopsis}
          </div>

          ${publicationNote}

        </section>


        <!-- AUTHOR -->

        <section class="details-section">

          <div class="details-section__heading">

            <span class="details-section__number">
              02
            </span>

            <h2>About the author</h2>

          </div>

          <div class="details-section__text">
            ${biography}
          </div>

        </section>


        <!-- READING NOTE -->

        <section class="details-section">

          <div class="details-section__heading">

            <span class="details-section__number">
              03
            </span>

            <h2>Reading information</h2>

          </div>

          ${getAvailabilityMarkup()}

          ${readingNote}

        </section>


        <!-- RELATED BOOKS -->

        ${renderRelatedBooks()}


      </div>

    `;


    /* Attach the save button after rendering */

    const saveButton = document.getElementById('book-save-toggle');

    saveButton.addEventListener('click', toggleSavedBook);

  }


  /* ----------------------------------------------------------
     SAVE / REMOVE BOOK
  ---------------------------------------------------------- */

  function toggleSavedBook() {

    const saved = Library.isSaved(book.id);

    if (saved) {

      const confirmed = window.confirm(
        'Remove "' + book.title + '" from your library?'
      );

      if (!confirmed) return;

      Library.remove(book.id);

      toast('Book removed from My Library.', 'check');

    } else {

      Library.save(book.id);

      toast('Book added to My Library.', 'check');

    }

    updateSaveButton();

  }


  function updateSaveButton() {

    const button = document.getElementById('book-save-toggle');

    if (!button) return;

    const saved = Library.isSaved(book.id);

    button.classList.toggle('is-saved', saved);

    button.setAttribute(
      'aria-pressed',
      String(saved)
    );

    button.innerHTML =
      icon(saved ? 'check' : 'plus') +
      '<span>' +
      (saved ? 'Saved to My Library' : 'Add to My Library') +
      '</span>';

  }


  /* ----------------------------------------------------------
     SHARED LIBRARY EVENTS
  ---------------------------------------------------------- */

  document.addEventListener('library:changed', function () {
    updateSaveButton();
  });


  /* ----------------------------------------------------------
     INITIAL RENDER
  ---------------------------------------------------------- */

  renderBookDetails();

})();