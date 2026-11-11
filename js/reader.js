/* ============================================================
   reader.js — THORNFIELD READING ROOM

   Dependencies:
   1. books.js
   2. reader-texts.js
   3. app.js

   Shared APIs:
   Library.setProgress()
   Library.addBookmark()
   Library.removeBookmark()
   Prefs.get()
   Prefs.set()
   ============================================================ */

(function () {
  'use strict';


  /* ----------------------------------------------------------
     ROOT AND BOOK
  ---------------------------------------------------------- */

  const root = document.getElementById('reader-root');

  if (!root) return;

  const bookId = getQueryParam('id');
  const book = getBookById(bookId);

  if (!book) {
    document.title = 'Book Not Found — Thornfield Library';
    root.innerHTML = renderNotFound('Book', bookId);
    return;
  }

  document.title = 'Reading ' + book.title + ' — Thornfield Library';


  /* ----------------------------------------------------------
     AVAILABILITY
  ---------------------------------------------------------- */

  const source = READER_TEXTS[book.id];

  if (!book.readingAvailable || !source) {

    root.innerHTML = `
      <section class="reader-unavailable">

        <span class="reader-unavailable__icon">
          ${icon('lock')}
        </span>

        <span class="eyebrow">Reading room</span>

        <h1>Text not available</h1>

        <p>
          This title is included in the Thornfield collection
          for reference, but its reading text is not available
          for reproduction.
        </p>

        <a
          class="btn btn--primary"
          href="${url('pages/book-details.html')}?id=${encodeURIComponent(book.id)}">

          Back to book details

        </a>

      </section>
    `;

    return;
  }


  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */

  let chapters = [];

  let currentChapter = 0;

  let progressTimer = null;

  let isRestoring = false;

  let currentPrefs = Prefs.get();


  /* ----------------------------------------------------------
     BUILD READER SHELL
  ---------------------------------------------------------- */

  function renderShell() {

    root.innerHTML = `

      <section class="reader-layout" id="reader-layout">


        <!-- LEFT SIDEBAR -->

        <aside class="reader-sidebar reader-sidebar--book">

          <a
            class="reader-back"
            href="${url('pages/book-details.html')}?id=${encodeURIComponent(book.id)}">

            ${icon('arrowLeft')}

            <span>Back to book</span>

          </a>


          <div class="reader-book">

            <div class="reader-book__cover">

              ${coverMarkup(book, 'reader-book__cover-image')}

            </div>

            <h2>${escapeHtml(book.title)}</h2>

            <p>${escapeHtml(book.author)}</p>

          </div>


          <div class="reader-sidebar__divider"></div>


          <div class="reader-chapter-list">

            <span class="reader-sidebar__label">
              Contents
            </span>

            <div id="reader-chapter-list">

              <p class="reader-sidebar__loading">
                Loading chapters...
              </p>

            </div>

          </div>


          <div class="reader-sidebar__source">

            <span>Source edition</span>

            <a
              href="${source.sourcePage}"
              target="_blank"
              rel="noopener noreferrer">

              ${escapeHtml(source.sourceName)}

            </a>

          </div>

        </aside>



        <!-- MAIN READING AREA -->

        <section class="reader-center">

          <div class="reader-topbar">

            <div class="reader-topbar__title">

              <span class="eyebrow">Thornfield reading room</span>

              <h1 id="reader-book-title">
                ${escapeHtml(book.title)}
              </h1>

            </div>


            <div class="reader-topbar__actions">

              <button
                type="button"
                class="reader-icon-btn"
                id="reader-font-decrease"
                aria-label="Decrease font size"
                title="Decrease font size">

                A−

              </button>

              <button
                type="button"
                class="reader-icon-btn"
                id="reader-font-increase"
                aria-label="Increase font size"
                title="Increase font size">

                A+

              </button>

              <button
                type="button"
                class="reader-icon-btn"
                id="reader-theme-toggle"
                aria-label="Toggle reading theme"
                title="Toggle reading theme">

                ${icon('moon')}

              </button>

              <button
                type="button"
                class="reader-icon-btn"
                id="reader-bookmark"
                aria-label="Add bookmark"
                title="Add bookmark">

                ${icon('bookmark')}

              </button>

            </div>

          </div>



          <!-- PROGRESS -->

          <div class="reader-progress">

            <div class="reader-progress__top">

              <span id="reader-progress-label">
                Reading progress
              </span>

              <strong id="reader-progress-value">
                0%
              </strong>

            </div>

            <div
              class="reader-progress__track"
              role="progressbar"
              aria-label="Book reading progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="0"
              id="reader-progress-track">

              <div
                class="reader-progress__bar"
                id="reader-progress-bar">
              </div>

            </div>

          </div>



          <!-- CHAPTER CONTENT -->

          <article class="reader-paper" id="reader-paper">

            <div class="reader-paper__ornament">
              <span></span>
              <span>${icon('leaf')}</span>
              <span></span>
            </div>

            <div class="reader-paper__chapter">

              <span class="eyebrow" id="reader-chapter-number">
                Chapter 1
              </span>

              <h2 id="reader-chapter-title">
                Preparing text...
              </h2>

            </div>


            <div
              class="reader-text"
              id="reader-text"
              aria-live="polite">

              <p>Loading the original text...</p>

            </div>


            <div class="reader-paper__end">
              <span>✦</span>
            </div>

          </article>



          <!-- CHAPTER NAVIGATION -->

          <nav class="reader-pagination" aria-label="Chapter navigation">

            <button
              type="button"
              class="reader-page-btn"
              id="reader-previous">

              ${icon('arrowLeft')}

              Previous

            </button>


            <span id="reader-page-count">
              0 / 0
            </span>


            <button
              type="button"
              class="reader-page-btn"
              id="reader-next">

              Next

              ${icon('arrowRight')}

            </button>

          </nav>


          <p class="reader-source-note" id="reader-source-note">
            ${escapeHtml(source.sectionNote)}
          </p>

        </section>



        <!-- RIGHT SIDEBAR -->

        <aside class="reader-sidebar reader-sidebar--settings">

          <div class="reader-settings">

            <span class="reader-sidebar__label">
              Reading settings
            </span>


            <!-- FONT SIZE -->

            <div class="reader-setting-group">

              <h3>Font size</h3>

              <div class="reader-font-options">

                <button
                  type="button"
                  data-font-size="17"
                  aria-label="Small font">

                  A

                </button>

                <button
                  type="button"
                  data-font-size="21"
                  aria-label="Medium font">

                  A

                </button>

                <button
                  type="button"
                  data-font-size="26"
                  aria-label="Large font">

                  A

                </button>

              </div>

              <p id="reader-font-label">
                ${currentPrefs.fontSize}px
              </p>

            </div>


            <!-- THEME -->

            <div class="reader-setting-group">

              <h3>Theme</h3>

              <div class="reader-theme-options">

                <button
                  type="button"
                  data-theme="light"
                  aria-pressed="true">

                  ${icon('sun')}

                  Light

                </button>

                <button
                  type="button"
                  data-theme="dark"
                  aria-pressed="false">

                  ${icon('moon')}

                  Dark

                </button>

              </div>

            </div>


            <!-- PROGRESS -->

            <div class="reader-setting-group">

              <h3>Reading progress</h3>

              <div class="reader-mini-progress">

                <strong id="reader-side-progress">
                  0%
                </strong>

                <div class="reader-mini-progress__track">

                  <div
                    id="reader-side-progress-bar"
                    class="reader-mini-progress__bar">
                  </div>

                </div>

              </div>

              <p id="reader-side-chapter">
                Chapter 1
              </p>

            </div>

          </div>


          <div class="reader-sidebar__divider"></div>


          <!-- BOOKMARKS -->

          <div class="reader-bookmarks">

            <div class="reader-bookmarks__head">

              <span class="reader-sidebar__label">
                Bookmarks
              </span>

              <span id="reader-bookmark-count">0</span>

            </div>


            <button
              type="button"
              class="reader-add-bookmark"
              id="reader-add-bookmark">

              ${icon('plus')}

              Add bookmark

            </button>


            <div
              id="reader-bookmark-list"
              class="reader-bookmark-list">

              <p class="reader-bookmark-empty">
                No bookmarks yet.
              </p>

            </div>

          </div>

        </aside>

      </section>

    `;
  }


  /* ----------------------------------------------------------
     DOM REFERENCES
  ---------------------------------------------------------- */

  function getElements() {
    return {

      paper: document.getElementById('reader-paper'),

      text: document.getElementById('reader-text'),

      chapterTitle: document.getElementById('reader-chapter-title'),

      chapterNumber: document.getElementById('reader-chapter-number'),

      chapterList: document.getElementById('reader-chapter-list'),

      pageCount: document.getElementById('reader-page-count'),

      previous: document.getElementById('reader-previous'),

      next: document.getElementById('reader-next'),

      progressLabel: document.getElementById('reader-progress-label'),

      progressValue: document.getElementById('reader-progress-value'),

      progressTrack: document.getElementById('reader-progress-track'),

      progressBar: document.getElementById('reader-progress-bar'),

      sideProgress: document.getElementById('reader-side-progress'),

      sideProgressBar: document.getElementById('reader-side-progress-bar'),

      sideChapter: document.getElementById('reader-side-chapter'),

      bookmarkList: document.getElementById('reader-bookmark-list'),

      bookmarkCount: document.getElementById('reader-bookmark-count'),

      fontLabel: document.getElementById('reader-font-label')

    };
  }


  /* ----------------------------------------------------------
     NORMALIZE HEADING
  ---------------------------------------------------------- */

  function normalizeHeading(value) {

    return String(value || '')
      .replace(/\s+/g, ' ')
      .replace(/\u00a0/g, ' ')
      .trim()
      .replace(/[.:]+$/, '');

  }


  /* ----------------------------------------------------------
     EXTRACT PARAGRAPHS FROM A RANGE
  ---------------------------------------------------------- */

  function extractParagraphs(range) {

    const fragment = range.cloneContents();

    const container = document.createElement('div');

    container.appendChild(fragment);

    const paragraphs = Array.from(
      container.querySelectorAll('p')
    )
      .map(function (paragraph) {
        return paragraph.textContent
          .replace(/\s+/g, ' ')
          .trim();
      })
      .filter(Boolean);

    if (paragraphs.length) {
      return paragraphs;
    }

    const plainText = container.textContent
      .replace(/\s+/g, ' ')
      .trim();

    return plainText ? [plainText] : [];

  }


  /* ----------------------------------------------------------
     EXTRACT CHAPTERS FROM GUTENBERG HTML
  ---------------------------------------------------------- */

  function extractChapters(html) {

    const parser = new DOMParser();

    const documentSource = parser.parseFromString(
      html,
      'text/html'
    );

    const headings = Array.from(
      documentSource.querySelectorAll('h1, h2, h3, h4, h5, h6')
    );

    const matched = headings.filter(function (heading) {

      const title = normalizeHeading(heading.textContent);

      return source.headingPattern.test(title);

    });


    const selected = matched.slice(0, source.sectionLimit);

    const extracted = selected.map(function (heading, index) {

      const nextHeading = selected[index + 1];

      const range = documentSource.createRange();

      range.setStartAfter(heading);

      if (nextHeading) {

        range.setEndBefore(nextHeading);

      } else {

        range.setEndAfter(documentSource.body.lastChild);

      }


      const paragraphs = extractParagraphs(range);

      return {

        title: normalizeHeading(heading.textContent),

        paragraphs: paragraphs

      };

    }).filter(function (chapter) {

      return chapter.paragraphs.length > 0;

    });


    return extracted;

  }


  /* ----------------------------------------------------------
     FETCH SOURCE TEXT
  ---------------------------------------------------------- */

  async function loadSourceText() {

    const response = await fetch(source.sourceUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'force-cache'
    });

    if (!response.ok) {
      throw new Error('The source could not be reached.');
    }

    const html = await response.text();

    const extracted = extractChapters(html);

    if (!extracted.length) {
      throw new Error('No matching chapter headings were found.');
    }

    return extracted;

  }


  /* ----------------------------------------------------------
     SOURCE ERROR
  ---------------------------------------------------------- */

  function renderSourceError() {

    const elements = getElements();

    elements.chapterNumber.textContent = 'Source unavailable';

    elements.chapterTitle.textContent = 'Unable to load the reading text';

    elements.text.innerHTML = `

      <div class="reader-error">

        <span class="reader-error__icon">
          ${icon('info')}
        </span>

        <h3>The original text could not be loaded.</h3>

        <p>
          This may happen because of a network problem
          or a browser cross-origin restriction.
        </p>

        <p>
          You can still open the original edition directly
          from Project Gutenberg.
        </p>

        <a
          class="btn btn--primary"
          href="${source.sourcePage}"
          target="_blank"
          rel="noopener noreferrer">

          Open original source

          ${icon('arrowRight')}

        </a>

        <button
          type="button"
          class="btn btn--ghost"
          id="reader-retry">

          Try again

        </button>

      </div>

    `;

    document.getElementById('reader-retry')
      .addEventListener('click', initializeReader);

    elements.previous.disabled = true;
    elements.next.disabled = true;

  }


  /* ----------------------------------------------------------
     RENDER CHAPTER NAVIGATION
  ---------------------------------------------------------- */

  function renderChapterList() {

    const elements = getElements();

    elements.chapterList.innerHTML = chapters
      .map(function (chapter, index) {

        return `

          <button
            type="button"
            class="reader-chapter-link ${index === currentChapter ? 'is-active' : ''}"
            data-chapter-index="${index}"
            aria-current="${index === currentChapter ? 'true' : 'false'}">

            <span>${String(index + 1).padStart(2, '0')}</span>

            <strong>${escapeHtml(chapter.title)}</strong>

          </button>

        `;

      })
      .join('');

  }


  /* ----------------------------------------------------------
     CHAPTER PROGRESS
  ---------------------------------------------------------- */

  function getChapterScroll() {

    const paper = document.getElementById('reader-paper');

    if (!paper) return 0;

    const rect = paper.getBoundingClientRect();

    const total = Math.max(
      1,
      paper.offsetHeight - window.innerHeight
    );

    const passed = Math.max(0, -rect.top);

    return clamp(passed / total, 0, 1);

  }


  function calculateProgress(scroll) {

    if (!chapters.length) return 0;

    const fraction = currentChapter + scroll;

    return clamp(
      Math.round((fraction / chapters.length) * 100),
      0,
      100
    );

  }


  /* ----------------------------------------------------------
     SAVE READING POSITION
  ---------------------------------------------------------- */

  function saveProgress() {

    if (!chapters.length || isRestoring) return;

    const scroll = getChapterScroll();

    const percent = calculateProgress(scroll);

    Library.setProgress(
      book.id,
      currentChapter,
      scroll,
      percent
    );

    updateProgressUI(percent);

  }


  function scheduleProgressSave() {

    if (isRestoring || !chapters.length) return;

    window.clearTimeout(progressTimer);

    progressTimer = window.setTimeout(function () {
      saveProgress();
    }, 650);

  }


  /* ----------------------------------------------------------
     UPDATE PROGRESS UI
  ---------------------------------------------------------- */

  function updateProgressUI(percent) {

    const elements = getElements();

    elements.progressValue.textContent = percent + '%';

    elements.progressBar.style.width = percent + '%';

    elements.progressTrack.setAttribute(
      'aria-valuenow',
      String(percent)
    );

    elements.sideProgress.textContent = percent + '%';

    elements.sideProgressBar.style.width = percent + '%';

    elements.progressLabel.textContent =
      'Chapter ' + (currentChapter + 1) + ' of ' + chapters.length;

    elements.sideChapter.textContent =
      'Chapter ' + (currentChapter + 1);

  }


  /* ----------------------------------------------------------
     RENDER CURRENT CHAPTER
  ---------------------------------------------------------- */

  function renderCurrentChapter(scrollPosition) {

    if (!chapters.length) return;

    const elements = getElements();

    const chapter = chapters[currentChapter];

    elements.chapterNumber.textContent =
      'Chapter ' + (currentChapter + 1);

    elements.chapterTitle.textContent = chapter.title;

    elements.text.innerHTML = chapter.paragraphs
      .map(function (paragraph) {

        return '<p>' + escapeHtml(paragraph) + '</p>';

      })
      .join('');


    elements.pageCount.textContent =
      (currentChapter + 1) + ' / ' + chapters.length;


    elements.previous.disabled = currentChapter === 0;

    elements.next.disabled =
      currentChapter === chapters.length - 1;


    renderChapterList();

    updateProgressUI(
      calculateProgress(scrollPosition || 0)
    );


    if (typeof scrollPosition === 'number') {

      requestAnimationFrame(function () {

        const paper = document.getElementById('reader-paper');

        const maxScroll = Math.max(
          0,
          paper.offsetHeight - window.innerHeight
        );

        const target = paper.getBoundingClientRect().top +
          window.scrollY +
          (maxScroll * scrollPosition);

        window.scrollTo({
          top: Math.max(0, target),
          behavior: 'auto'
        });

        window.setTimeout(function () {
          isRestoring = false;
          saveProgress();
        }, 120);

      });

    }

  }


  /* ----------------------------------------------------------
     CHANGE CHAPTER
  ---------------------------------------------------------- */

  function goToChapter(index) {

    if (index < 0 || index >= chapters.length) return;

    window.clearTimeout(progressTimer);

    currentChapter = index;

    isRestoring = true;

    renderCurrentChapter(0);

  }


  /* ----------------------------------------------------------
     FONT SIZE
  ---------------------------------------------------------- */

  function applyFontSize() {

    const text = document.getElementById('reader-text');

    if (!text) return;

    text.style.fontSize = currentPrefs.fontSize + 'px';

    getElements().fontLabel.textContent =
      currentPrefs.fontSize + 'px';

    document.querySelectorAll('[data-font-size]').forEach(function (button) {

      const selected =
        Number(button.dataset.fontSize) === currentPrefs.fontSize;

      button.classList.toggle('is-active', selected);

    });

  }


  function changeFontSize(amount) {

    currentPrefs = Prefs.set({
      fontSize: currentPrefs.fontSize + amount
    });

    applyFontSize();

  }


  /* ----------------------------------------------------------
     THEME
  ---------------------------------------------------------- */

  function applyTheme() {

    const layout = document.getElementById('reader-layout');

    if (!layout) return;

    layout.dataset.theme = currentPrefs.theme;

    document.querySelectorAll('[data-theme]').forEach(function (button) {

      button.setAttribute(
        'aria-pressed',
        String(button.dataset.theme === currentPrefs.theme)
      );

    });

    const toggle = document.getElementById('reader-theme-toggle');

    toggle.innerHTML = icon(
      currentPrefs.theme === 'dark' ? 'sun' : 'moon'
    );

    toggle.setAttribute(
      'aria-label',
      currentPrefs.theme === 'dark'
        ? 'Switch to light theme'
        : 'Switch to dark theme'
    );

  }


  function changeTheme(theme) {

    currentPrefs = Prefs.set({
      theme: theme
    });

    applyTheme();

  }


  /* ----------------------------------------------------------
     BOOKMARKS
  ---------------------------------------------------------- */

  function getBookmarks() {

    const entry = Library.get(book.id);

    return entry && Array.isArray(entry.bookmarks)
      ? entry.bookmarks
      : [];

  }


  function renderBookmarks() {

    const elements = getElements();

    const bookmarks = getBookmarks();

    elements.bookmarkCount.textContent = bookmarks.length;

    if (!bookmarks.length) {

      elements.bookmarkList.innerHTML = `
        <p class="reader-bookmark-empty">
          No bookmarks yet.
        </p>
      `;

      return;

    }


    elements.bookmarkList.innerHTML = bookmarks
      .map(function (bookmark) {

        const label = bookmark.label ||
          'Chapter ' + (bookmark.chapter + 1);

        return `

          <div class="reader-bookmark-item">

            <button
              type="button"
              class="reader-bookmark-item__open"
              data-open-bookmark="${escapeHtml(bookmark.createdAt)}">

              <span>${icon('bookmark')}</span>

              <span>
                <strong>${escapeHtml(label)}</strong>
                <small>Saved position</small>
              </span>

            </button>


            <button
              type="button"
              class="reader-bookmark-item__remove"
              data-remove-bookmark="${escapeHtml(bookmark.createdAt)}"
              aria-label="Remove bookmark">

              ${icon('close')}

            </button>

          </div>

        `;

      })
      .join('');

  }


  function addCurrentBookmark() {

    const scroll = getChapterScroll();

    const bookmark = {

      chapter: currentChapter,

      scroll: scroll,

      label: chapters[currentChapter].title

    };

    const added = Library.addBookmark(book.id, bookmark);

    if (added) {

      toast('Bookmark added.', 'bookmark');

    } else {

      toast('A bookmark already exists near this position.', 'info');

    }

    renderBookmarks();

  }


  function openBookmark(createdAt) {

    const bookmark = getBookmarks().find(function (item) {
      return item.createdAt === createdAt;
    });

    if (!bookmark) return;

    currentChapter = clamp(
      Number(bookmark.chapter) || 0,
      0,
      chapters.length - 1
    );

    isRestoring = true;

    renderCurrentChapter(
      clamp(Number(bookmark.scroll) || 0, 0, 1)
    );

  }


  /* ----------------------------------------------------------
     RESTORE LAST READING POSITION
  ---------------------------------------------------------- */

  function restoreProgress() {

    const entry = Library.get(book.id);

    if (!entry || !entry.progress) {

      currentChapter = 0;

      isRestoring = true;

      renderCurrentChapter(0);

      return;

    }


    const savedChapter = clamp(
      Number(entry.progress.chapter) || 0,
      0,
      chapters.length - 1
    );

    const savedScroll = clamp(
      Number(entry.progress.scroll) || 0,
      0,
      1
    );


    currentChapter = savedChapter;

    isRestoring = true;

    renderCurrentChapter(savedScroll);

  }


  /* ----------------------------------------------------------
     EVENT LISTENERS
  ---------------------------------------------------------- */

  function attachEvents() {

    const elements = getElements();


    /* Chapter navigation */

    elements.previous.addEventListener('click', function () {
      goToChapter(currentChapter - 1);
    });

    elements.next.addEventListener('click', function () {
      goToChapter(currentChapter + 1);
    });


    /* Chapter list */

    elements.chapterList.addEventListener('click', function (event) {

      const button = event.target.closest('[data-chapter-index]');

      if (!button) return;

      goToChapter(Number(button.dataset.chapterIndex));

    });


    /* Font buttons */

    document.getElementById('reader-font-decrease')
      .addEventListener('click', function () {
        changeFontSize(-1);
      });

    document.getElementById('reader-font-increase')
      .addEventListener('click', function () {
        changeFontSize(1);
      });


    document.querySelectorAll('[data-font-size]').forEach(function (button) {

      button.addEventListener('click', function () {

        currentPrefs = Prefs.set({
          fontSize: Number(button.dataset.fontSize)
        });

        applyFontSize();

      });

    });


    /* Theme buttons */

    document.getElementById('reader-theme-toggle')
      .addEventListener('click', function () {

        changeTheme(
          currentPrefs.theme === 'dark' ? 'light' : 'dark'
        );

      });


    document.querySelectorAll('[data-theme]').forEach(function (button) {

      button.addEventListener('click', function () {
        changeTheme(button.dataset.theme);
      });

    });


    /* Bookmarks */

    document.getElementById('reader-add-bookmark')
      .addEventListener('click', addCurrentBookmark);

    document.getElementById('reader-bookmark')
      .addEventListener('click', addCurrentBookmark);


    elements.bookmarkList.addEventListener('click', function (event) {

      const openButton = event.target.closest('[data-open-bookmark]');

      const removeButton = event.target.closest('[data-remove-bookmark]');


      if (openButton) {

        openBookmark(openButton.dataset.openBookmark);

        return;

      }


      if (removeButton) {

        Library.removeBookmark(
          book.id,
          removeButton.dataset.removeBookmark
        );

        renderBookmarks();

        toast('Bookmark removed.', 'check');

      }

    });


    /* Scroll progress */

    window.addEventListener(
      'scroll',
      scheduleProgressSave,
      { passive: true }
    );

    window.addEventListener('beforeunload', saveProgress);

  }


  /* ----------------------------------------------------------
     INITIALIZE READER
  ---------------------------------------------------------- */

  async function initializeReader() {

    renderShell();

    try {

      chapters = await loadSourceText();

      if (!chapters.length) {
        throw new Error('No readable sections were found.');
      }


      /* Opening the reader creates a local reading entry. */

      Library.ensure(book.id);


      renderChapterList();

      attachEvents();

      applyFontSize();

      applyTheme();

      renderBookmarks();

      restoreProgress();


    } catch (error) {

      console.error('Thornfield Reader:', error);

      renderSourceError();

    }

  }


  /* ----------------------------------------------------------
     START
  ---------------------------------------------------------- */

  initializeReader();

})();