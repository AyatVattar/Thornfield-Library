/* ==========================================================================
   books.js — the single source of truth for the whole website.

   Every page reads from BOOKS and GENRES. No page may keep its own copy of
   the collection. If a fact changes, change it here and it changes everywhere.

   Fields on a book
     id              unique kebab-case key, used in every URL (?id=...)
     title           full title as printed on the first edition
     subtitle        optional, shown smaller under the title
     originalTitle   title in the original language, when it is not English
     author          author name exactly as credited
     nationality     author's nationality
     year            display string for the first publication
     firstPublished  number used for sorting (earliest year of a serialisation)
     publicationNote clarifies serialisation vs. book publication
     genre           one of the five GENRES names
     subgenre        one of that genre's three subgenres
     cover           local image path; replace the file to change the artwork
     description     one or two sentences, used on cards and search results
     synopsis        accurate plot summary, used on the details page
     biography       short verified author biography
     readingAvailable  true only when a legal text is shipped in reader-texts.js
     readingSource   "public-domain" | "not-available"
     readingNote     why the text is or is not available
     featured        curatorial flag for the home page (not a sales metric)
     dateAdded       date the book entered THIS collection, for "Recently added"
   ========================================================================== */

const GENRES = [
  {
    id: 'dark-fiction',
    name: 'Dark Fiction',
    tagline: 'Where the mind keeps its locked rooms',
    description: 'Literature exploring psychological struggles, fear, isolation, moral conflict, gothic atmosphere, and darker aspects of human nature.',
    subgenres: ['Gothic Fiction', 'Psychological Fiction', 'Horror Fiction'],
    image: 'assets/images/genres/dark-fiction.jpg',
    motif: 'arch',
    related: ['romance', 'mystery-crime'],
    ornament: 'Pointed arches, fog and candle smoke'
  },
  {
    id: 'romance',
    name: 'Romance',
    tagline: 'Letters kept longer than they should have been',
    description: 'Stories centered on emotional relationships, love, attachment, separation, and human connection.',
    subgenres: ['Classic Romance', 'Gothic Romance', 'Contemporary Romance'],
    image: 'assets/images/genres/romance.jpg',
    motif: 'rose',
    related: ['dark-fiction', 'adventure-historical'],
    ornament: 'Pressed roses, ribbon and old handwriting'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    tagline: 'Maps that admit the world is larger than it looks',
    description: 'Imaginative stories involving magical worlds, supernatural elements, unusual realities, and extraordinary adventures.',
    subgenres: ['High Fantasy', 'Magical Fantasy', 'Magical Realism'],
    image: 'assets/images/genres/fantasy.jpg',
    motif: 'tower',
    related: ['adventure-historical', 'dark-fiction'],
    ornament: 'Enchanted woodland, towers and star charts'
  },
  {
    id: 'mystery-crime',
    name: 'Mystery & Crime',
    tagline: 'Every detail is evidence of something',
    description: 'Stories involving mysteries, investigations, crimes, hidden truths, and psychological suspense.',
    subgenres: ['Detective Fiction', 'Crime Thriller', 'Psychological Mystery'],
    image: 'assets/images/genres/mystery-crime.jpg',
    motif: 'lens',
    related: ['dark-fiction', 'adventure-historical'],
    ornament: 'Magnifying glass, case notes and lamplight'
  },
  {
    id: 'adventure-historical',
    name: 'Adventure & Historical',
    tagline: 'The past, travelled at walking pace',
    description: 'Stories about journeys, exploration, historical settings, legendary characters, and important events from the past.',
    subgenres: ['Historical Fiction', 'Adventure Fiction', 'Historical Epic'],
    image: 'assets/images/genres/adventure-historical.jpg',
    motif: 'compass',
    related: ['fantasy', 'mystery-crime'],
    ornament: 'Sea charts, compass roses and rigging'
  }
];

const BOOKS = [
  /* ---------------------------------------------------------- DARK FICTION */
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    subtitle: 'or, The Modern Prometheus',
    author: 'Mary Shelley',
    nationality: 'English',
    year: '1818',
    firstPublished: 1818,
    publicationNote: 'First published anonymously in London in 1818. The 1831 revision is a later, substantially altered text.',
    genre: 'Dark Fiction',
    subgenre: 'Gothic Fiction',
    cover: 'assets/images/books/frankenstein.jpg',
    description: 'A young scientist creates life, abandons it, and spends the rest of his existence pursued by the consequences.',
    synopsis: 'The novel opens as a frame narrative: Captain Robert Walton, writing to his sister from an expedition bound for the North Pole, records that his ship has taken in a starving stranger drifting on the ice. The stranger is Victor Frankenstein, and he tells Walton his history.\n\nAs a student at Ingolstadt, Victor becomes consumed by the question of what animates matter. Working in secret, he assembles a living creature and brings it to life — then flees from it in horror. The creature, left to learn language and society alone, discovers that it is regarded as a monster wherever it goes. It asks Victor for one thing: a companion. What follows is a chain of refusals, deaths and retaliations that carries both of them to the polar ice.\n\nShelley structures the story as nested first-person accounts — Walton, then Victor, then the creature itself — so that each narrator is heard at length before being judged.',
    biography: 'Mary Shelley (1797–1851) was an English novelist, the daughter of the philosopher William Godwin and the writer Mary Wollstonecraft, and the wife of the poet Percy Bysshe Shelley. She began Frankenstein at eighteen during the cold, wet summer of 1816 near Geneva, when the volcanic "year without a summer" kept her party indoors and led to a ghost-story competition. It was published anonymously when she was twenty. Her later novels include Valperga (1823) and The Last Man (1826), and she edited her husband\'s poetry after his death in 1822.',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'The 1818 text is in the public domain. This reader reproduces the four opening letters and Chapter 1 verbatim from Project Gutenberg eBook #84.',
    featured: true,
    dateAdded: '2026-11-02'
  },
  {
    id: 'dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    nationality: 'Irish',
    year: '1897',
    firstPublished: 1897,
    publicationNote: 'Published in London by Archibald Constable and Company in May 1897.',
    genre: 'Dark Fiction',
    subgenre: 'Horror Fiction',
    cover: 'assets/images/books/dracula.jpg',
    description: 'An epistolary novel assembled from journals, letters and telegrams, tracking a Transylvanian count\'s arrival in England.',
    synopsis: 'Jonathan Harker, an English solicitor, travels to Castle Dracula in the Carpathians to finalise a London property purchase for his client. His journal records the journey, the warnings of the local people, and his growing realisation that he is a prisoner in a house whose master is not what he appears to be.\n\nThe narrative then widens. Dracula reaches England aboard a ship whose crew has vanished, and the story passes between Harker\'s fiancée Mina Murray, her friend Lucy Westenra, the doctors who attend Lucy, and Professor Abraham Van Helsing, who is willing to believe what the others will not.\n\nStoker tells the whole novel through documents — shorthand journals, letters, newspaper cuttings, a ship\'s log, phonograph transcripts — so the reader pieces the events together alongside the characters.',
    biography: 'Bram Stoker (1847–1912) was an Irish author born in Dublin. He worked in the Irish civil service before becoming business manager of the Lyceum Theatre in London, a post he held for twenty-seven years under the actor Henry Irving. Dracula (1897) was not his first book but became by far his most enduring. His other fiction includes The Snake\'s Pass (1890), The Jewel of Seven Stars (1903) and The Lair of the White Worm (1911).',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'Public domain. This reader reproduces Chapters I–III (Jonathan Harker\'s journal) verbatim from Project Gutenberg eBook #345.',
    featured: false,
    dateAdded: '2026-11-04'
  },
  {
    id: 'no-longer-human',
    title: 'No Longer Human',
    originalTitle: '人間失格 (Ningen Shikkaku)',
    author: 'Osamu Dazai',
    nationality: 'Japanese',
    year: '1948',
    firstPublished: 1948,
    publicationNote: 'Serialised in 1948 and published in book form the same year.',
    genre: 'Dark Fiction',
    subgenre: 'Psychological Fiction',
    cover: 'assets/images/books/no-longer-human.jpg',
    description: 'Three notebooks left behind by a man who has concluded that he does not qualify as a human being.',
    synopsis: 'The novel is presented as a posthumous collection: three photographs of Ōba Yōzō at different ages, three notebooks written in his own hand, and a brief afterword from a woman who knew him.\n\nThe notebooks follow Yōzō from childhood in northern Japan through school, Tokyo, alcoholism, drug addiction, a series of relationships and a suicide attempt. He describes a lifelong inability to understand other people, and his strategy of clowning to conceal it. The title refers to his eventual conviction that he has lost the qualification to be counted among human beings.\n\nIt is a first-person account of alienation rather than a plot-driven novel, and is widely read as the most autobiographical of Dazai\'s works.',
    biography: 'Osamu Dazai (1909–1948) was the pen name of Shūji Tsushima, a Japanese novelist born into a wealthy landowning family in Aomori Prefecture. He became a central figure of the Buraiha, or "decadent school", of postwar Japanese literature. His best-known works are The Setting Sun (Shayō, 1947) and No Longer Human (Ningen Shikkaku, 1948). He died in June 1948, shortly after the latter was serialised.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'No text is offered. Dazai\'s Japanese original entered the public domain in Japan in 2019, but the standard English translation by Donald Keene (1958) is still under copyright, and the original\'s status in other jurisdictions differs. A licensed English edition would be required.',
    featured: false,
    dateAdded: '2026-11-08'
  },

  /* -------------------------------------------------------------- ROMANCE */
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    nationality: 'English',
    year: '1813',
    firstPublished: 1813,
    publicationNote: 'Published in three volumes in January 1813, credited only as "By the author of Sense and Sensibility".',
    genre: 'Romance',
    subgenre: 'Classic Romance',
    cover: 'assets/images/books/pride-and-prejudice.jpg',
    description: 'Elizabeth Bennet and Mr Darcy misread each other thoroughly, and then have to correct the record.',
    synopsis: 'The Bennet family of Longbourn has five unmarried daughters and an estate entailed away from them, so marriage is a matter of security as much as affection. When the wealthy Mr Bingley takes nearby Netherfield Park, Mrs Bennet sets her hopes on the eldest, Jane.\n\nBingley\'s friend Fitzwilliam Darcy is richer still, and dismissive of the neighbourhood. Elizabeth Bennet overhears the dismissal and forms a judgement of him that the rest of the novel slowly dismantles — while Darcy, against his own intentions, comes to admire her. Misinformation from the charming militia officer Wickham, the interference of Darcy\'s aunt Lady Catherine de Bourgh, and a family scandal involving the youngest sister Lydia all test the two of them.\n\nAusten\'s subject is not only courtship but the cost of first impressions, and the social pressure on women who have no independent income.',
    biography: 'Jane Austen (1775–1817) was an English novelist born in Steventon, Hampshire, the daughter of a clergyman. She wrote throughout her adult life while living with her family, and published anonymously during her lifetime. Her six major novels are Sense and Sensibility (1811), Pride and Prejudice (1813), Mansfield Park (1814), Emma (1815), and Northanger Abbey and Persuasion, both published posthumously in late 1817. She died at forty-one and is buried in Winchester Cathedral.',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'Public domain. This reader reproduces Chapters I–III verbatim from Project Gutenberg eBook #1342.',
    featured: true,
    dateAdded: '2026-11-01'
  },
  {
    id: 'wuthering-heights',
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    nationality: 'English',
    year: '1847',
    firstPublished: 1847,
    publicationNote: 'Published in December 1847 under the pen name Ellis Bell, in a three-volume set with Anne Brontë\'s Agnes Grey.',
    genre: 'Romance',
    subgenre: 'Gothic Romance',
    cover: 'assets/images/books/wuthering-heights.jpg',
    description: 'A foundling brought to a Yorkshire farmhouse loves one person absolutely, and destroys two households over it.',
    synopsis: 'Mr Lockwood, renting Thrushcross Grange, visits his landlord at the isolated farmhouse of Wuthering Heights and is kept there overnight by snow. He encounters a hostile household and an apparition at the window, and asks his housekeeper Nelly Dean to explain.\n\nNelly\'s account forms the body of the novel. Years earlier Mr Earnshaw brought home a destitute boy, Heathcliff, and favoured him over his own son Hindley. Heathcliff and Earnshaw\'s daughter Catherine grow up inseparable; Catherine\'s decision to marry the neighbouring Edgar Linton instead sets off Heathcliff\'s long, deliberate revenge, which reaches into the next generation through his own sickly son and Catherine\'s daughter.\n\nThe story is told by two unreliable narrators at one remove from the events, and the moor itself is treated as a force in the book.',
    biography: 'Emily Brontë (1818–1848) was an English novelist and poet, born in Thornton, Yorkshire, and raised from childhood at the parsonage in Haworth where her father was curate. She was the sister of Charlotte and Anne Brontë; the three published a joint volume of poetry in 1846 under the pseudonyms Currer, Ellis and Acton Bell. Wuthering Heights is her only novel. She died of tuberculosis in December 1848, aged thirty.',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'Public domain. This reader reproduces Chapters I–III verbatim from Project Gutenberg eBook #768.',
    featured: false,
    dateAdded: '2026-11-05'
  },
  {
    id: 'the-notebook',
    title: 'The Notebook',
    author: 'Nicholas Sparks',
    nationality: 'American',
    year: '1996',
    firstPublished: 1996,
    publicationNote: 'Published in October 1996; it was the author\'s first released novel.',
    genre: 'Romance',
    subgenre: 'Contemporary Romance',
    cover: 'assets/images/books/the-notebook.jpg',
    description: 'An old man reads a love story aloud to a woman who no longer remembers that it is hers.',
    synopsis: 'In a North Carolina nursing home in 1946, an elderly man reads from a notebook to a fellow patient who has lost her memory. The notebook tells the story of Noah Calhoun, returned from the Second World War to restore a plantation house, and Allie Hamilton, the summer love he was separated from by her parents\' objections and by the war.\n\nYears after their separation, Allie — now engaged to another man — sees a newspaper photograph of Noah and the finished house, and returns to settle what was left unfinished. The reading sessions in the nursing home frame the romance and gradually reveal why the man keeps reading.\n\nIt is a short novel about memory, class difference and the persistence of a single attachment.',
    biography: 'Nicholas Sparks (born 1965) is an American novelist. The Notebook, published in 1996, was his first released novel; he has said it was inspired by the relationship of his wife\'s grandparents. He has since written more than twenty novels, a large number of which have been adapted into feature films, including A Walk to Remember, Dear John and The Last Song.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Still under copyright. No text or sample is reproduced here without permission from the rights holder.',
    featured: false,
    dateAdded: '2026-11-09'
  },

  /* -------------------------------------------------------------- FANTASY */
  {
    id: 'the-hobbit',
    title: 'The Hobbit',
    subtitle: 'or, There and Back Again',
    author: 'J. R. R. Tolkien',
    nationality: 'English',
    year: '1937',
    firstPublished: 1937,
    publicationNote: 'Published by George Allen & Unwin on 21 September 1937.',
    genre: 'Fantasy',
    subgenre: 'High Fantasy',
    cover: 'assets/images/books/the-hobbit.jpg',
    description: 'A comfortable hobbit is talked into a journey he did not plan, and comes back changed by it.',
    synopsis: 'Bilbo Baggins of Bag End is recruited by the wizard Gandalf as burglar to a company of thirteen dwarves led by Thorin Oakenshield. Their purpose is to travel east and reclaim the Lonely Mountain and its treasure from the dragon Smaug.\n\nThe journey passes through troll country, the elven refuge of Rivendell, the goblin tunnels of the Misty Mountains — where Bilbo, lost in the dark, meets Gollum and acquires a ring — the forest of Mirkwood and the elven king\'s halls, and finally the human town of Esgaroth on the Long Lake.\n\nTolkien wrote it as a story for his own children, and its narrative voice addresses the reader directly. It is set in the same world as his later The Lord of the Rings.',
    biography: 'J. R. R. Tolkien (1892–1973) was an English writer, poet and philologist. Born in Bloemfontein in what is now South Africa, he was brought to England as a small child. He held the chairs of Anglo-Saxon and of English Language and Literature at Oxford, and was a member of the Inklings alongside C. S. Lewis. The Hobbit (1937) grew out of stories told to his children; The Lord of the Rings followed in 1954–55. His scholarly work included an edition of Sir Gawain and the Green Knight and the essay "Beowulf: The Monsters and the Critics".',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Still under copyright. Tolkien died in 1973, so the work remains protected in life-plus-seventy jurisdictions until 2044, and United States copyright in the 1937 edition runs to the end of 2032. No text is reproduced.',
    featured: true,
    dateAdded: '2026-11-03'
  },
  {
    id: 'harry-potter-and-the-philosophers-stone',
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J. K. Rowling',
    nationality: 'British',
    year: '1997',
    firstPublished: 1997,
    publicationNote: 'Published by Bloomsbury on 26 June 1997. Released in the United States in 1998 as Harry Potter and the Sorcerer\'s Stone.',
    genre: 'Fantasy',
    subgenre: 'Magical Fantasy',
    cover: 'assets/images/books/harry-potter-and-the-philosophers-stone.jpg',
    description: 'On his eleventh birthday an orphan discovers that the world he was hidden from has been waiting for him.',
    synopsis: 'Harry Potter has spent ten years sleeping in a cupboard at number four, Privet Drive, with the aunt and uncle who took him in after his parents died. On his eleventh birthday letters begin to arrive, and the gamekeeper Hagrid delivers the one that gets through: Harry is a wizard, and has a place at Hogwarts School of Witchcraft and Wizardry.\n\nAt Hogwarts he is sorted into Gryffindor, finds friends in Ron Weasley and Hermione Granger, discovers an aptitude for flying, and learns that his parents were murdered by the dark wizard Lord Voldemort — who failed to kill Harry and has not been seen since.\n\nThe three of them come to suspect that someone is trying to steal the Philosopher\'s Stone, an object hidden in the school that can produce the Elixir of Life, and that the theft is connected to Voldemort\'s return.',
    biography: 'J. K. Rowling (born 1965) is a British author born in Yate, Gloucestershire. She has said the idea for Harry Potter came to her in 1990 during a delayed train journey from Manchester to London. The seven-book series began with Harry Potter and the Philosopher\'s Stone in 1997 and concluded with Harry Potter and the Deathly Hallows in 2007. She has also written fiction for adults, including The Casual Vacancy (2012) and, under the name Robert Galbraith, the Cormoran Strike novels.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Still under copyright. No text, chapter or sample is reproduced here without permission from the rights holder.',
    featured: false,
    dateAdded: '2026-11-06'
  },
  {
    id: 'kafka-on-the-shore',
    title: 'Kafka on the Shore',
    originalTitle: '海辺のカフカ (Umibe no Kafuka)',
    author: 'Haruki Murakami',
    nationality: 'Japanese',
    year: '2002',
    firstPublished: 2002,
    publicationNote: 'Published in Japanese by Shinchosha in 2002. The English translation by Philip Gabriel appeared in 2005.',
    genre: 'Fantasy',
    subgenre: 'Magical Realism',
    cover: 'assets/images/books/kafka-on-the-shore.jpg',
    description: 'A runaway teenager and an old man who can speak to cats move toward the same place on alternating chapters.',
    synopsis: 'Kafka Tamura, fifteen, leaves his father\'s house in Tokyo on the night of his birthday and travels to Takamatsu on the island of Shikoku. He is fleeing a prophecy his father laid on him, and looking for the mother and sister who left when he was four. He finds a room in a private library run by the composed Miss Saeki and the youthful Ōshima.\n\nThe odd-numbered chapters follow Kafka; the even-numbered chapters follow Nakata, an elderly man in Tokyo\'s Nakano ward who lost his memory and his ability to read in a wartime incident, and who can converse with cats. A search for a missing cat draws Nakata into a killing and then onto the road south, following a stone that must be returned to its place.\n\nThe two narratives converge through objects, dreams and a pair of crows, in a version of contemporary Japan where the impossible is treated as ordinary.',
    biography: 'Haruki Murakami (born 1949) is a Japanese novelist and translator, born in Kyoto and raised in Kobe. He ran a jazz bar in Tokyo before beginning to write, and debuted with Hear the Wind Sing (1979). His novels include A Wild Sheep Chase (1982), Norwegian Wood (1987), The Wind-Up Bird Chronicle (1994–95), Kafka on the Shore (2002) and 1Q84 (2009–10). Kafka on the Shore received the World Fantasy Award for Best Novel in 2006. He has also translated works by F. Scott Fitzgerald, Raymond Carver and J. D. Salinger into Japanese.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Still under copyright in the original Japanese and in Philip Gabriel\'s English translation. No text is reproduced.',
    featured: false,
    dateAdded: '2026-11-07'
  },

  /* ------------------------------------------------------- MYSTERY & CRIME */
  {
    id: 'the-hound-of-the-baskervilles',
    title: 'The Hound of the Baskervilles',
    subtitle: 'Another Adventure of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    nationality: 'Scottish',
    year: '1902',
    firstPublished: 1901,
    publicationNote: 'Serialised in The Strand Magazine from August 1901 to April 1902; first published in book form in 1902. The story is set before Holmes\'s apparent death in "The Final Problem".',
    genre: 'Mystery & Crime',
    subgenre: 'Detective Fiction',
    cover: 'assets/images/books/the-hound-of-the-baskervilles.jpg',
    description: 'A death on Dartmoor, a family curse written in an old manuscript, and a hound that may or may not exist.',
    synopsis: 'Dr James Mortimer brings Sherlock Holmes a walking stick left behind by a visitor, a manuscript dated 1742 describing the curse of the Baskervilles, and a newspaper report of the death of Sir Charles Baskerville on the moor outside his hall. Sir Charles\'s face was distorted, and there were the footprints of a gigantic hound nearby.\n\nThe heir, Sir Henry Baskerville, arrives from Canada and receives an anonymous warning assembled from newspaper print. Holmes sends Watson to Devonshire with Sir Henry while he remains in London, and the investigation proceeds through Watson\'s letters and reports: the neighbours, the escaped convict on the moor, the mysterious figures on the tor, and the naturalist Jack Stapleton and his sister.\n\nDoyle balances a rational detective method against a landscape and a legend that seem to argue for the supernatural.',
    biography: 'Arthur Conan Doyle (1859–1930) was a British writer born in Edinburgh and trained as a physician at the University of Edinburgh, where he studied under Joseph Bell, whose diagnostic habit of close observation informed Sherlock Holmes. He introduced the detective in A Study in Scarlet (1887) and wrote four novels and fifty-six short stories about him. He also wrote historical fiction such as The White Company (1891), served as a volunteer doctor in the Boer War, and campaigned publicly for the reform of wrongful convictions.',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'Public domain. This reader reproduces Chapters 1–3 verbatim from Project Gutenberg eBook #2852.',
    featured: true,
    dateAdded: '2026-11-02'
  },
  {
    id: 'murder-on-the-orient-express',
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    nationality: 'English',
    year: '1934',
    firstPublished: 1934,
    publicationNote: 'Published by the Collins Crime Club on 1 January 1934. Issued in the United States the same year as Murder in the Calais Coach.',
    genre: 'Mystery & Crime',
    subgenre: 'Detective Fiction',
    cover: 'assets/images/books/murder-on-the-orient-express.jpg',
    description: 'A train stopped by snow, a passenger stabbed in a locked compartment, and thirteen people with reasons to be there.',
    synopsis: 'Hercule Poirot, travelling from Syria toward London, boards the Simplon Orient Express at Istanbul and is given a berth in the Calais coach through the intervention of his friend M. Bouc, a director of the railway line. Among the passengers is Samuel Ratchett, an American who tries to hire Poirot\'s protection because he has received threatening letters. Poirot refuses.\n\nThe train is blocked by a snowdrift in Yugoslavia during the night. In the morning Ratchett is found dead in his locked compartment, stabbed twelve times, and the window open. Nothing has been taken; a burned letter and a monogrammed handkerchief are among the few traces.\n\nPoirot interviews each passenger and reconstructs a timeline in which the physical evidence contradicts itself — some wounds appear to have been struck by a left-handed person, some by a right, some before death and some after. He eventually offers two solutions and leaves the choice of which to present to the authorities with M. Bouc and Dr Constantine.',
    biography: 'Agatha Christie (1890–1976) was an English crime writer born in Torquay, Devon. She created Hercule Poirot, who first appeared in The Mysterious Affair at Styles (1920), and Jane Marple, who first appeared in short stories in 1927 and in the novel The Murder at the Vicarage (1930). Her play The Mousetrap opened in London in 1952 and became the longest-running show in theatre history. Guinness World Records has listed her as the best-selling novelist of all time.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Not yet public domain. United States copyright in the 1934 edition runs through the end of 2029, and Christie died in 1976, so protection continues in life-plus-seventy jurisdictions until 2047. No text is reproduced.',
    featured: false,
    dateAdded: '2026-11-04'
  },
  {
    id: 'the-devotion-of-suspect-x',
    title: 'The Devotion of Suspect X',
    originalTitle: '容疑者Xの献身 (Yōgisha X no Kenshin)',
    author: 'Keigo Higashino',
    nationality: 'Japanese',
    year: '2005',
    firstPublished: 2005,
    publicationNote: 'Published in Japanese by Bungeishunjū in 2005. It belongs to the Detective Galileo series. The English translation by Alexander O. Smith appeared in 2011.',
    genre: 'Mystery & Crime',
    subgenre: 'Psychological Mystery',
    cover: 'assets/images/books/the-devotion-of-suspect-x.jpg',
    description: 'A mathematics teacher builds a perfect cover for the woman next door — and an old classmate is asked to break it.',
    synopsis: 'Yasuko Hanaoka, who runs a small restaurant in Tokyo, and her daughter Misato kill Yasuko\'s abusive ex-husband Togashi when he forces his way into their apartment. Their neighbour Ishigami, a high-school mathematics teacher who has quietly admired Yasuko for months, offers to handle everything and constructs an alibi for them.\n\nThe police find the body but cannot break the alibi. Detective Kusanagi turns to his friend Manabu Yukawa, a physics professor known as Detective Galileo — who discovers that the suspect he is being asked to consider is Ishigami, his own former university classmate and a mathematician he once regarded as a genius.\n\nThe novel is told largely from the investigators\' and Ishigami\'s points of view rather than as a whodunit: the question is not who did it but how the alibi works, and what Ishigami is willing to do.',
    biography: 'Keigo Higashino (born 1958) is a Japanese novelist born in Osaka. He graduated in electrical engineering and worked as an engineer before writing full-time, debuting in 1985 with After School (Hōkago), which won the Edogawa Rampo Prize. The Devotion of Suspect X (2005), from his Detective Galileo series, won both the Naoki Prize and the Honkaku Mystery Award, and was adapted into Japanese and Korean films. His other novels in English translation include Malice and Newcomer.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Still under copyright in the original Japanese and in Alexander O. Smith\'s English translation. No text is reproduced.',
    featured: false,
    dateAdded: '2026-11-08'
  },

  /* ----------------------------------------------- ADVENTURE & HISTORICAL */
  {
    id: 'the-count-of-monte-cristo',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    nationality: 'French',
    year: '1844–1846',
    firstPublished: 1844,
    publicationNote: 'Serialised in the Journal des Débats from August 1844 to January 1846, then published in eighteen volumes. Written with the collaborator Auguste Maquet.',
    genre: 'Adventure & Historical',
    subgenre: 'Historical Fiction',
    cover: 'assets/images/books/the-count-of-monte-cristo.jpg',
    description: 'A sailor is imprisoned on the day of his betrothal, learns everything in the dark, and returns as someone else.',
    synopsis: 'In February 1815 Edmond Dantès, first mate of the Pharaon, returns to Marseille to marry Mercédès and to be made captain. A jealous colleague, Danglars, and Mercédès\'s suitor Fernand Mondego denounce him as a Bonapartist agent; the deputy procureur Villefort, protecting his own family\'s connection to the letter Dantès carries, imprisons him without trial in the Château d\'If.\n\nIn prison he meets the Abbé Faria, an Italian scholar who educates him in languages, science and history, works out who betrayed him, and tells him of a treasure hidden on the island of Monte Cristo. After Faria\'s death Dantès escapes, finds the treasure, and spends years preparing his return.\n\nThe second half of the novel follows that return as the Count, the Abbé Busoni and Lord Wilmore, through the households of the three men who destroyed him — now powerful in Paris under the July Monarchy — and asks how far retribution can be carried before it becomes the thing it punishes.',
    biography: 'Alexandre Dumas père (1802–1870) was a French novelist and playwright, born in Villers-Cotterêts, the son of General Thomas-Alexandre Dumas, who was himself the son of a French marquis and Marie-Cessette Dumas, an enslaved woman of African descent in Saint-Domingue. Dumas moved to Paris and found work through his handwriting, then became one of the most prolific writers of the century, producing travel books, plays and historical novels, often with collaborators. His best-known works are The Three Musketeers (1844), The Count of Monte Cristo (1844–46) and La Reine Margot (1845).',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'The French original is public domain, and this reader uses the anonymous nineteenth-century English translation carried by Project Gutenberg eBook #1184, which is itself public domain. Modern translations may still be protected. Chapters 1–3 are reproduced verbatim.',
    featured: true,
    dateAdded: '2026-11-01'
  },
  {
    id: 'the-three-musketeers',
    title: 'The Three Musketeers',
    originalTitle: 'Les Trois Mousquetaires',
    author: 'Alexandre Dumas',
    nationality: 'French',
    year: '1844',
    firstPublished: 1844,
    publicationNote: 'Serialised in the newspaper Le Siècle from March to July 1844. The story is set between 1625 and 1628.',
    genre: 'Adventure & Historical',
    subgenre: 'Adventure Fiction',
    cover: 'assets/images/books/the-three-musketeers.jpg',
    description: 'A Gascon youth with a lame horse and three letters of introduction arrives in Paris and picks four fights.',
    synopsis: 'In April 1625 the young d\'Artagnan leaves Gascony for Paris to join the King\'s Musketeers. Within a single afternoon he contrives duels with three of them — Athos, Porthos and Aramis — and when the Cardinal\'s guards arrive to arrest the illegal duelists he sides with the musketeers instead. The four become inseparable.\n\nThe plot turns on Queen Anne of Austria\'s secret gift of twelve diamond studs to the Duke of Buckingham in London, and on Cardinal Richelieu\'s determination to expose it. D\'Artagnan and his three friends must cross the Channel and return before the Queen\'s ball, pursued by the Cardinal\'s agents, above all the resourceful Milady de Winter.\n\nDumas draws on the apocryphal Mémoires de M. d\'Artagnan and on his own reading in seventeenth-century chronicles, mixing recorded events — the siege of La Rochelle, the assassination of Buckingham — with invented ones.',
    biography: 'Alexandre Dumas père (1802–1870) was a French novelist and playwright, born in Villers-Cotterêts, the son of General Thomas-Alexandre Dumas. He moved to Paris as a young man and became one of the most prolific and popular writers of his century, working in drama, travel writing and the historical novel, frequently with collaborators such as Auguste Maquet. The Three Musketeers (1844) is the first of the d\'Artagnan romances, followed by Twenty Years After (1845) and The Vicomte of Bragelonne (1847–50).',
    readingAvailable: true,
    readingSource: 'public-domain',
    readingNote: 'The French original is public domain, and this reader uses the anonymous nineteenth-century English translation carried by Project Gutenberg eBook #1257, which is itself public domain. Chapters I–III are reproduced verbatim.',
    featured: false,
    dateAdded: '2026-11-05'
  },
  {
    id: 'musashi',
    title: 'Musashi',
    subtitle: 'An Epic Novel of the Samurai Era',
    author: 'Eiji Yoshikawa',
    nationality: 'Japanese',
    year: '1935–1939',
    firstPublished: 1935,
    publicationNote: 'Serialised in the Asahi Shimbun from 1935 to 1939; later published in book form. The English translation by Charles S. Terry appeared in 1981.',
    genre: 'Adventure & Historical',
    subgenre: 'Historical Epic',
    cover: 'assets/images/books/musashi.jpg',
    description: 'A violent young survivor of Sekigahara spends a lifetime learning what a sword is actually for.',
    synopsis: 'In 1600 Takezō, a peasant youth from Mimasaka, survives the Battle of Sekigahara on the losing side and returns home as a hunted, brutalised man. The Zen priest Takuan confines him in a room of books for three years; he emerges as Miyamoto Musashi, a swordsman who has begun to understand that skill without discipline is only violence.\n\nThe novel follows his wandering across Japan: the duel with the Yoshioka school in Kyoto, his encounters with the spear-master Hōzōin In\'ei and the chain-and-sickle fighter Shishido Baiken, his relationship with Otsū, who follows him for years, and his long approach to the duel with Sasaki Kojirō on the island of Funajima.\n\nYoshikawa compresses and rearranges the historical record freely; the book is a novel about the formation of a swordsman\'s character rather than a biography.',
    biography: 'Eiji Yoshikawa (1892–1962) was a Japanese novelist born in Yokohama. He left school young and worked at a series of jobs before establishing himself as a writer of popular historical fiction. His novels retelling Japanese history and legend include Musashi (serialised 1935–39), Taiko and a prose rendering of the Heike Monogatari. He received the Order of Culture in 1960.',
    readingAvailable: false,
    readingSource: 'not-available',
    readingNote: 'Not available. Yoshikawa died in 1962, so the Japanese original remains protected in Japan until 2033, and Charles S. Terry\'s 1981 English translation is under its own copyright. No text is reproduced.',
    featured: false,
    dateAdded: '2026-11-09'
  }
];

/* ------------------------------------------------------------ pure lookups
   These functions never touch the DOM. Pages use them instead of writing
   their own .filter() logic, so the collection stays consistent. */

function getBookById(id) {
  return BOOKS.find(function (book) { return book.id === id; }) || null;
}

function getGenreById(id) {
  return GENRES.find(function (genre) { return genre.id === id; }) || null;
}

function getGenreByName(name) {
  return GENRES.find(function (genre) { return genre.name === name; }) || null;
}

function getBooksByGenre(genreId) {
  const genre = getGenreById(genreId);
  if (!genre) return [];
  return BOOKS.filter(function (book) { return book.genre === genre.name; });
}

function getBooksBySubgenre(genreId, subgenre) {
  return getBooksByGenre(genreId).filter(function (book) { return book.subgenre === subgenre; });
}

/* Books in the same genre, excluding the one being viewed. */
function getRelatedBooks(book, limit) {
  return getBooksByGenre(getGenreByName(book.genre).id)
    .filter(function (other) { return other.id !== book.id; })
    .slice(0, limit || 3);
}

/* The five curatorial picks, one per genre, in genre order. */
function getFeaturedBooks() {
  return GENRES.map(function (genre) {
    return getBooksByGenre(genre.id).find(function (book) { return book.featured; });
  }).filter(Boolean);
}

function getRecentlyAddedBooks(limit) {
  return BOOKS.slice().sort(function (a, b) {
    return b.dateAdded.localeCompare(a.dateAdded);
  }).slice(0, limit || 6);
}

/* Recommended, not "popular": there are no usage statistics in this project. */
function getRecommendedBooks(limit) {
  const featured = getFeaturedBooks().map(function (book) { return book.id; });
  return BOOKS.filter(function (book) { return featured.indexOf(book.id) === -1; })
    .slice(0, limit || 6);
}

function countBooksInGenre(genreId) {
  return getBooksByGenre(genreId).length;
}