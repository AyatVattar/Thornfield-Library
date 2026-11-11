/* ============================================================
   reader-texts.js

   Project Gutenberg source configuration.

   This file is loaded before app.js and reader.js.

   Text is fetched from the original public-domain HTML edition.
   Only the sections listed in each book's headingPattern are
   displayed inside Thornfield's reader.
   ============================================================ */

const READER_TEXTS = {

  /* ----------------------------------------------------------
     FRANKENSTEIN
     Project Gutenberg #84

     Four opening letters + Chapter 1
  ---------------------------------------------------------- */

  'frankenstein': {

    sourceName: 'Project Gutenberg — eBook #84',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/84/pg84-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/84',

    headingPattern:
      /^(?:LETTER\s+[1-4]|CHAPTER\s+1)\.?$/i,

    sectionLimit: 5,

    sectionNote:
      'The four opening letters and Chapter 1 are included from the 1818 public-domain text.'

  },


  /* ----------------------------------------------------------
     DRACULA
     Project Gutenberg #345

     Chapters I–III
  ---------------------------------------------------------- */

  'dracula': {

    sourceName: 'Project Gutenberg — eBook #345',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/345/pg345-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/345',

    headingPattern:
      /^(?:CHAPTER\s+)?(?:I|II|III)\.?$/i,

    sectionLimit: 3,

    sectionNote:
      'Chapters I–III from the original public-domain edition.'

  },


  /* ----------------------------------------------------------
     PRIDE AND PREJUDICE
     Project Gutenberg #1342

     Chapters I–III
  ---------------------------------------------------------- */

  'pride-and-prejudice': {

    sourceName: 'Project Gutenberg — eBook #1342',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/1342/pg1342-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/1342',

    headingPattern:
      /^(?:CHAPTER\s+)?(?:I|II|III)\.?$/i,

    sectionLimit: 3,

    sectionNote:
      'Chapters I–III from the public-domain text.'

  },


  /* ----------------------------------------------------------
     WUTHERING HEIGHTS
     Project Gutenberg #768

     Chapters I–III
  ---------------------------------------------------------- */

  'wuthering-heights': {

    sourceName: 'Project Gutenberg — eBook #768',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/768/pg768-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/768',

    headingPattern:
      /^(?:CHAPTER\s+)?(?:I|II|III)\.?$/i,

    sectionLimit: 3,

    sectionNote:
      'Chapters I–III from the public-domain text.'

  },


  /* ----------------------------------------------------------
     THE HOUND OF THE BASKERVILLES
     Project Gutenberg #2852

     Chapters I–III
  ---------------------------------------------------------- */

  'the-hound-of-the-baskervilles': {

    sourceName: 'Project Gutenberg — eBook #2852',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/2852/pg2852-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/2852',

    headingPattern:
      /^(?:CHAPTER\s+)?(?:I|II|III)\.?$/i,

    sectionLimit: 3,

    sectionNote:
      'Chapters I–III from the public-domain text.'

  },


  /* ----------------------------------------------------------
     THE COUNT OF MONTE CRISTO
     Project Gutenberg #1184

     Chapters I–III
  ---------------------------------------------------------- */

  'the-count-of-monte-cristo': {

    sourceName: 'Project Gutenberg — eBook #1184',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/1184/pg1184-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/1184',

    headingPattern:
      /^(?:CHAPTER\s+)?(?:I|II|III)\.?$/i,

    sectionLimit: 3,

    sectionNote:
      'Chapters I–III from the anonymous nineteenth-century English translation.'

  },


  /* ----------------------------------------------------------
     THE THREE MUSKETEERS
     Project Gutenberg #1257

     Chapters I–III
  ---------------------------------------------------------- */

  'the-three-musketeers': {

    sourceName: 'Project Gutenberg — eBook #1257',

    sourceUrl:
      'https://www.gutenberg.org/cache/epub/1257/pg1257-images.html',

    sourcePage:
      'https://www.gutenberg.org/ebooks/1257',

    headingPattern:
      /^(?:CHAPTER\s+)?(?:I|II|III)\.?$/i,

    sectionLimit: 3,

    sectionNote:
      'Chapters I–III from the anonymous nineteenth-century English translation.'

  }

};