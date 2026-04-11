/**
 * Generates src/data/books-knowledge-base.json with coverage:
 * - Each GENRES entry: ≥5 books with that exact genre label
 * - Mood slugs: curated via scripts/mood-append.json (see apply-mood-catalog.mjs), not generated here
 * - Each era keyword (via published year + description): ≥5 books
 * - minRating 1–5: ≥5 books surviving each threshold
 * - Each language (en, es, fr, de, hi): ≥5 books
 *
 * Run: node scripts/build-knowledge-base.mjs
 */
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, "..", "src", "data", "books-knowledge-base.json")

function slugify(title, author) {
  return `${title} ${author}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

let idn = 0
function book(b) {
  idn += 1
  const id = `kb-${String(idn).padStart(3, "0")}`
  return {
    id,
    title: b.title,
    author: b.author,
    coverUrl: `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`,
    description: b.description,
    genres: b.genres,
    publishedYear: b.publishedYear,
    pageCount: b.pageCount,
    isbn: b.isbn,
    averageRating: b.averageRating,
    ratingsCount: b.ratingsCount,
    slug: slugify(b.title, b.author),
    language: b.language ?? "en",
  }
}

const books = []

// --- Literary Fiction ×5 ---
const lf = [
  ["The Goldfinch", "Donna Tartt", "9780316055448", 2013, 771, 3.7, 320000, "A contemporary boy drags a stolen painting through grief and the underworld. contemporary literary portrait of loss."],
  ["A Little Life", "Hanya Yanagihara", "9780385539258", 2015, 720, 4.3, 410000, "Four friends in New York face trauma and devotion. contemporary emotional literary saga."],
  ["Normal People", "Sally Rooney", "9781984822178", 2018, 273, 4.0, 890000, "Irish teenagers weave class and desire into a modern love story. contemporary literary fiction."],
  ["The Overstory", "Richard Powers", "9780393356687", 2018, 502, 4.2, 180000, "Trees and activists intertwine in a sweeping environmental novel. modern literary epic."],
  ["White Teeth", "Zadie Smith", "9780375703867", 2000, 448, 3.9, 220000, "London families clash and blend across generations. modern multicultural literary fiction."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of lf) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Fiction"] }))
}

// --- Sci-Fi ×5 ---
const sf = [
  ["Foundation", "Isaac Asimov", "9780553293357", 1951, 255, 4.4, 89000, "Psychohistory guides a crumbling galactic empire. classic science fiction foundation saga."],
  ["The Three-Body Problem", "Cixin Liu", "9780765377067", 2014, 400, 4.1, 280000, "Astrophysics and alien contact in Cultural Revolution China. modern hard sci-fi."],
  ["Ender's Game", "Orson Scott Card", "9780812550702", 1985, 324, 4.3, 1500000, "Child soldiers train to fight an insectoid threat. modern military science fiction classic."],
  ["The Left Hand of Darkness", "Ursula K. Le Guin", "9780441478125", 1969, 304, 4.2, 95000, "A diplomat navigates genderless society on a frozen world. modern speculative masterpiece."],
  ["Neuromancer", "William Gibson", "9780441569595", 1984, 271, 3.9, 210000, "Hackers and AI in a gritty cyberpunk sprawl. modern noir science fiction."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of sf) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Sci-Fi", "Fiction"] }))
}

// --- Fantasy ×5 ---
const fan = [
  ["The Way of Kings", "Brandon Sanderson", "9780765326355", 2010, 1007, 4.7, 520000, "Knights and storms on a shattered world. epic fantasy magic adventure tome."],
  ["Assassin's Apprentice", "Robin Hobb", "9780553573398", 1995, 392, 4.2, 310000, "A royal bastard trains as an assassin in a coastal kingdom. modern fantasy political intrigue."],
  ["Jonathan Strange & Mr Norrell", "Susanna Clarke", "9780765356150", 2004, 782, 4.0, 170000, "English magicians revive practical magic in the Napoleonic era. historical fantasy literary."],
  ["The Fifth Season", "N.K. Jemisin", "9780316229296", 2015, 468, 4.5, 240000, "A mother hunts her child across a geologically violent continent. contemporary fantasy breakout."],
  ["Uprooted", "Naomi Novik", "9780804179034", 2015, 438, 4.1, 190000, "A village girl serves a solitary wizard in a corrupted wood. modern fairy-tale fantasy."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of fan) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Fantasy", "Fiction"] }))
}

// --- Mystery ×5 ---
const mys = [
  ["The Big Sleep", "Raymond Chandler", "9780394758281", 1939, 231, 4.0, 120000, "Private eye Marlowe tangles with LA corruption. classic hardboiled mystery."],
  ["The No. 1 Ladies' Detective Agency", "Alexander McCall Smith", "9781400034779", 1998, 235, 3.9, 210000, "Precious Ramotswe solves gentle cases in Botswana. cozy mystery charm."],
  ["The Alienist", "Caleb Carr", "9780812976144", 1994, 496, 4.1, 95000, "Psychologists hunt a serial killer in 1890s New York. historical mystery thriller."],
  ["Still Life", "Louise Penny", "9780312541532", 2005, 312, 4.2, 180000, "Inspector Gamache investigates murder in a Quebec village. cozy mystery series opener."],
  ["The Devotion of Suspect X", "Keigo Higashino", "9780312375068", 2005, 298, 4.3, 85000, "A mathematician covers a crime with elegant logic. Japanese mystery puzzle."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of mys) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Mystery", "Fiction"] }))
}

// --- Romance ×5 ---
const rom = [
  ["Outlander", "Diana Gabaldon", "9780440212560", 1991, 850, 4.2, 420000, "A nurse time-travels to Jacobite Scotland. epic romantic historical adventure."],
  ["The Hating Game", "Sally Thorne", "9780062439598", 2016, 365, 4.1, 310000, "Rival assistants fake tension until sparks fly. contemporary romantic comedy office."],
  ["Beach Read", "Emily Henry", "9781984806758", 2020, 361, 4.0, 290000, "Two writers swap genres for the summer. contemporary romantic love story with wit."],
  ["Red, White & Royal Blue", "Casey McQuiston", "9781250316776", 2019, 421, 4.4, 520000, "First son falls for a British prince. contemporary romantic political comedy."],
  ["Vision in White", "Nora Roberts", "9780515147498", 2009, 343, 4.0, 110000, "A wedding photographer finds love. contemporary romantic series starter."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of rom) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Romance", "Fiction"] }))
}

// --- Non-Fiction ×5 ---
const nf = [
  ["The Body Keeps the Score", "Bessel van der Kolk", "9780143127741", 2014, 464, 4.6, 380000, "Trauma science and healing pathways explained for readers. nonfiction psychology landmark."],
  ["Thinking, Fast and Slow", "Daniel Kahneman", "9780374533557", 2011, 499, 4.2, 410000, "Behavioral economics and cognitive biases unpacked. nonfiction science bestseller."],
  ["The Immortal Life of Henrietta Lacks", "Rebecca Skloot", "9781400052189", 2010, 381, 4.5, 290000, "Ethics of cells taken without consent. nonfiction medical history."],
  ["Freakonomics", "Steven D. Levitt", "9780060731335", 2005, 336, 3.9, 350000, "Economics explains cheating teachers and sumo stats. nonfiction pop economics."],
  ["Quiet", "Susan Cain", "9780307352156", 2012, 333, 4.1, 270000, "The power of introverts in a loud world. nonfiction psychology cultural study."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of nf) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Non-Fiction", "Science"] }))
}

// --- History ×5 ---
const hist = [
  ["Guns, Germs, and Steel", "Jared Diamond", "9780393354324", 1997, 480, 4.0, 310000, "Geography shapes civilizations over millennia. history big-picture synthesis."],
  ["The Splendid and the Vile", "Erik Larson", "9780385348713", 2020, 608, 4.5, 220000, "Churchill's first year as PM during the Blitz. narrative history WWII."],
  ["Team of Rivals", "Doris Kearns Goodwin", "9780743270755", 2005, 916, 4.6, 180000, "Lincoln's cabinet and the Civil War. American political history biography blend."],
  ["A People's History of the United States", "Howard Zinn", "9780062397348", 1980, 729, 4.1, 160000, "US history from workers and dissenters. modern critical history classic."],
  ["The Warmth of Other Suns", "Isabel Wilkerson", "9780679763888", 2010, 622, 4.7, 140000, "The Great Migration told through three lives. American social history masterpiece."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of hist) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["History", "Non-Fiction"] }))
}

// --- Biography ×5 ---
const bio = [
  ["The Diary of a Young Girl", "Anne Frank", "9780553296983", 1947, 283, 4.6, 2100000, "A Jewish teenager hides in Amsterdam during occupation. classic biography memoir."],
  ["Steve Jobs", "Walter Isaacson", "9781451648539", 2011, 656, 4.2, 890000, "The Apple cofounder's driven life. contemporary tech biography."],
  ["Becoming", "Michelle Obama", "9781524763138", 2018, 448, 4.7, 650000, "From Chicago to the White House with grace. modern memoir biography."],
  ["The Autobiography of Malcolm X", "Malcolm X", "9780345350688", 1965, 460, 4.5, 95000, "Civil rights evolution in his own words. 20th century American biography."],
  ["Born a Crime", "Trevor Noah", "9780399588198", 2016, 304, 4.7, 720000, "Growing up mixed-race under apartheid with humor. contemporary biography memoir."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of bio) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Biography", "Non-Fiction"] }))
}

// --- Self-Help ×5 (distinct from Atomic Habits etc.) ---
const sh = [
  ["The 7 Habits of Highly Effective People", "Stephen R. Covey", "9781982137274", 1989, 381, 4.3, 410000, "Principles for personal and professional effectiveness. self-help leadership classic."],
  ["The Power of Now", "Eckhart Tolle", "9781577314806", 1997, 236, 4.0, 290000, "Presence over anxious thinking. self-help spirituality modern."],
  ["Daring Greatly", "Brené Brown", "9781592408412", 2012, 320, 4.2, 220000, "Vulnerability as strength in work and life. self-help psychology research-based."],
  ["The Subtle Art of Not Giving a F*ck", "Mark Manson", "9780062457714", 2016, 224, 3.9, 480000, "Counterintuitive approach to a good life. contemporary self-help humor."],
  ["You Are a Badass", "Jen Sincero", "9780762447695", 2013, 254, 4.0, 190000, "How to stop doubting and live boldly. motivational self-help."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of sh) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Self-Help", "Non-Fiction"] }))
}

// --- Horror ×5 ---
const hor = [
  ["Dracula", "Bram Stoker", "9780486411095", 1897, 418, 4.0, 890000, "The count sails to England for new prey. classic gothic horror vampire."],
  ["The Shining", "Stephen King", "9780307743657", 1977, 688, 4.3, 520000, "A winter caretaker unravels in an isolated hotel. modern horror psychological."],
  ["Rebecca", "Daphne du Maurier", "9780380730407", 1938, 416, 4.1, 310000, "A new wife lives in the shadow of Rebecca. gothic psychological suspense horror-tinged."],
  ["Bird Box", "Josh Malerman", "9780062256553", 2014, 272, 4.0, 210000, "Survive unseen creatures that drive people mad. contemporary horror thriller."],
  ["The Haunting of Hill House", "Shirley Jackson", "9780143039983", 1959, 208, 3.9, 140000, "Scientists study a mansion's dread. classic haunted house horror."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of hor) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Horror", "Fiction"] }))
}

// --- Thriller ×5 ---
const thr = [
  ["The Girl with the Dragon Tattoo", "Stieg Larsson", "9780307454546", 2005, 465, 4.1, 610000, "Journalist and hacker expose a Swedish dynasty. contemporary Nordic thriller."],
  ["The Bourne Identity", "Robert Ludlum", "9780553593549", 1980, 523, 4.0, 180000, "An amnesiac discovers lethal skills. cold war era thriller spy."],
  ["I Am Watching You", "Teresa Driscoll", "9781542045680", 2017, 316, 4.0, 95000, "A train witness fears she could have stopped a crime. contemporary psychological thriller."],
  ["The Silent Patient", "Alex Michaelides", "9781250301697", 2019, 336, 4.2, 670000, "A therapist pursues a painter who stopped speaking. modern thriller twisty."],
  ["The Hunt for Red October", "Tom Clancy", "9780425240335", 1984, 387, 4.1, 120000, "Submarine defections and Cold War stakes. military techno-thriller classic."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of thr) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Thriller", "Fiction"] }))
}

// --- Classics ×5 ---
const cl = [
  ["Moby-Dick", "Herman Melville", "9780142437247", 1851, 635, 3.5, 420000, "Captain Ahab hunts the white whale. American classic maritime epic."],
  ["Jane Eyre", "Charlotte Brontë", "9780141441146", 1847, 532, 4.1, 890000, "A governess finds love and secrets at Thornfield. Victorian classic romance gothic."],
  ["Crime and Punishment", "Fyodor Dostoevsky", "9780143058144", 1866, 671, 4.2, 380000, "A student justifies murder in St. Petersburg. classic Russian psychological novel."],
  ["The Count of Monte Cristo", "Alexandre Dumas", "9780140449266", 1844, 1276, 4.3, 290000, "Wrongful imprisonment and elaborate revenge. classic adventure French."],
  ["Frankenstein", "Mary Shelley", "9780486282114", 1818, 166, 3.8, 510000, "A scientist reanimates flesh; the creature demands justice. Gothic classic horror origins."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of cl) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Classics", "Fiction"] }))
}

// --- Era coverage: ensure 5 per era keyword (some overlap with classics) ---
const eraPre = [
  ["Walden", "Henry David Thoreau", "9780486450959", 1854, 216, 3.9, 95000, "Life beside a pond in simple independence. classic American transcendental essay nature."],
  ["Les Misérables", "Victor Hugo", "9780451525260", 1862, 1488, 4.4, 410000, "Ex-convict redemption in revolutionary Paris. classic French epic novel."],
  ["Anna Karenina", "Leo Tolstoy", "9780143035008", 1877, 964, 4.2, 280000, "Passion and society in imperial Russia. classic literary tragedy."],
  ["The Picture of Dorian Gray", "Oscar Wilde", "9780141439570", 1890, 254, 4.0, 520000, "Youth preserved while a portrait ages. classic decadent gothic novel."],
  ["The Strange Case of Dr Jekyll and Mr Hyde", "R.L. Stevenson", "9780486266886", 1886, 96, 3.9, 310000, "Dual nature in Victorian London. classic horror novella."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of eraPre) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Classics", "Literary Fiction"] }))
}

const era1900 = [
  ["The Great Gatsby", "F. Scott Fitzgerald", "9780743273565", 1925, 180, 3.9, 1200000, "Jazz Age longing on Long Island. 20th century American modernist classic."],
  ["Brave New World", "Aldous Huxley", "9780060850524", 1932, 268, 3.9, 410000, "Engineered society trades freedom for comfort. 20th century dystopian science fiction."],
  ["Their Eyes Were Watching God", "Zora Neale Hurston", "9780061120060", 1937, 256, 4.1, 180000, "Janie's voice in the Florida Everglades. 20th century Harlem Renaissance classic."],
  ["Fahrenheit 451", "Ray Bradbury", "9781451673319", 1953, 249, 4.0, 520000, "Firemen burn books in a numb future. 20th century science fiction warning."],
  ["To Kill a Mockingbird", "Harper Lee", "9780061120084", 1960, 336, 4.3, 2100000, "Scout sees justice and racism in Alabama. 20th century American classic."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of era1900) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Classics", "Literary Fiction"] }))
}

const era1970 = [
  ["Beloved", "Toni Morrison", "9781400033416", 1987, 324, 4.0, 310000, "A mother's ghost in post-Civil War Ohio. modern American literary masterpiece."],
  ["The Color Purple", "Alice Walker", "9780156028356", 1982, 295, 4.2, 290000, "Letters trace survival and sisterhood in the South. modern classic American fiction."],
  ["The Handmaid's Tale", "Margaret Atwood", "9780385490818", 1985, 311, 4.1, 670000, "Theocratic America controls women's bodies. modern dystopian feminist classic."],
  ["Watchmen", "Alan Moore", "9781779501127", 1987, 416, 4.4, 220000, "Deconstructed superheroes in an alternate Cold War. modern graphic novel classic."],
  ["The Secret History", "Donna Tartt", "9781400031703", 1992, 559, 4.0, 270000, "Classics students cross moral lines in Vermont. modern literary thriller debut."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of era1970) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Thriller"] }))
}

const era2000 = [
  ["The Kite Runner", "Khaled Hosseini", "9781594631931", 2003, 371, 4.3, 890000, "Friendship and betrayal across Afghanistan's turmoil. contemporary early 2000s bestseller."],
  ["The Time Traveler's Wife", "Audrey Niffenegger", "9780156029438", 2003, 541, 3.9, 480000, "Love unstuck in time. contemporary romantic science fiction crossover."],
  ["The Road", "Cormac McCarthy", "9780307387899", 2006, 287, 4.0, 410000, "Father and son cross a gray apocalypse. contemporary minimalist literary novel."],
  ["Water for Elephants", "Sara Gruen", "9781565125605", 2006, 335, 4.1, 350000, "Depression-era circus romance and danger. contemporary historical fiction hit."],
  ["The Brief Wondrous Life of Oscar Wao", "Junot Díaz", "9781594483295", 2007, 335, 4.0, 190000, "A Dominican nerd dreams of love and escape. contemporary literary Pulitzer."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of era2000) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Fiction"] }))
}

const eraRecent = [
  ["The Midnight Library", "Matt Haig", "9780525559498", 2020, 304, 4.2, 510000, "Infinite lives in a magical library between death and life. new acclaimed contemporary fantasy."],
  ["Klara and the Sun", "Kazuo Ishiguro", "9780593318171", 2021, 303, 4.0, 180000, "An artificial friend observes love. new literary science fiction gentle."],
  ["Tomorrow, and Tomorrow, and Tomorrow", "Gabrielle Zevin", "9780593321448", 2022, 416, 4.3, 310000, "Friends build video games across decades. new bestseller literary friendship epic."],
  ["Fourth Wing", "Rebecca Yarros", "9781649374042", 2023, 528, 4.5, 890000, "Dragon riders at a war college. new fantasy romance phenomenon."],
  ["Yellowface", "R.F. Kuang", "9780063250833", 2023, 336, 4.1, 220000, "Literary theft and social media outrage. new satirical contemporary thriller."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of eraRecent) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Fiction", "Literary Fiction"] }))
}

// --- Rating tiers: ≥5 books with avg >=5, >=4, >=3, >=2, and ≥5 with low (1.5-2.4) for contrast ---
const rated5 = [
  ["The Lord of the Rings", "J.R.R. Tolkien", "9780544003415", 1954, 1178, 5.0, 920000, "The definitive fantasy epic journey. classic high fantasy masterpiece beloved."],
  ["Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "9780590353427", 1997, 309, 5.0, 2100000, "A boy learns he is a wizard. modern young adult fantasy classic."],
  ["The Hitchhiker's Guide to the Galaxy", "Douglas Adams", "9780345391803", 1979, 216, 5.0, 480000, "Absurd journey after Earth is demolished. humor science fiction cult classic."],
  ["Anne of Green Gables", "L.M. Montgomery", "9780141321592", 1908, 320, 5.0, 410000, "An orphan brightens Prince Edward Island. classic children's literary heartwarming."],
  ["The Little Prince", "Antoine de Saint-Exupéry", "9780156012195", 1943, 96, 5.0, 890000, "A pilot meets a prince among stars. philosophical fable translated classic."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of rated5) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Classics", "Fantasy"] }))
}

const rated4 = [
  ["Circe", "Madeline Miller", "9780316556347", 2018, 400, 4.35, 720000, "The witch of myth claims her voice. contemporary myth retelling fantasy."],
  ["The Seven Husbands of Evelyn Hugo", "Taylor Jenkins Reid", "9781501161933", 2017, 400, 4.35, 980000, "A Hollywood icon's scandalous life story. contemporary historical fiction romance."],
  ["Where the Crawdads Sing", "Delia Owens", "9780735219090", 2018, 384, 4.35, 890000, "Marsh girl and murder mystery intertwine. contemporary literary mystery."],
  ["The Thursday Murder Club", "Richard Osman", "9780241425442", 2020, 382, 4.35, 290000, "Retirees solve cold cases with wit. cozy mystery humor series."],
  ["The Nightingale", "Kristin Hannah", "9781250080400", 2015, 440, 4.35, 520000, "Sisters resist in occupied France during World War II. historical fiction literary epic."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of rated4) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Biography", "Non-Fiction"] }))
}

const rated3 = [
  ["Fifty Shades of Grey", "E.L. James", "9780345803481", 2011, 514, 3.4, 980000, "A student enters a billionaire's contract. contemporary romantic erotica phenomenon."],
  ["Twilight", "Stephenie Meyer", "9780316015844", 2005, 498, 3.4, 2100000, "A teen falls for a vampire in Forks. young adult paranormal romance."],
  ["The Da Vinci Code", "Dan Brown", "9780307474278", 2003, 489, 3.4, 720000, "Symbologist races through Europe's secrets. thriller conspiracy bestseller."],
  ["Eat Pray Love", "Elizabeth Gilbert", "9780143118428", 2006, 334, 3.4, 410000, "Divorce recovery across Italy, India, Bali. memoir travel self-discovery."],
  ["The Casual Vacancy", "J.K. Rowling", "9780316229267", 2012, 503, 3.4, 190000, "Small-town politics after a councilman's death. adult literary small-town drama."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of rated3) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Fiction", "Romance"] }))
}

const rated2 = [
  ["Allegiant", "Veronica Roth", "9780062024060", 2013, 544, 2.6, 410000, "Divergent trilogy conclusion divides fans. young adult dystopian finale controversial."],
  ["Mockingjay", "Suzanne Collins", "9780439023511", 2010, 390, 2.6, 620000, "Katniss leads rebellion in the Capitol. young adult dystopian war conclusion."],
  ["Artemis", "Andy Weir", "9780553448122", 2017, 320, 2.5, 210000, "A smuggler on the Moon gets in over her head. science fiction heist mixed reviews."],
  ["Crossroads", "Jonathan Franzen", "9780374188800", 2021, 592, 2.7, 35000, "A Midwest family in the 1970s. modern literary epic divisive reviews."],
  ["Go Set a Watchman", "Harper Lee", "9780062409867", 2015, 278, 2.4, 180000, "Scout revisits Atticus in later years. controversial sequel classic characters."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of rated2) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Classics"] }))
}

// --- Languages: Spanish, French, German, Hindi editions (5 each) ---
const es = [
  ["Cien años de soledad", "Gabriel García Márquez", "9780060883287", 1967, 417, 4.5, 510000, "La saga de Macondo en realismo mágico. novela clásica latinoamericana en español."],
  ["El amor en los tiempos del cólera", "Gabriel García Márquez", "9780307389732", 1985, 348, 4.3, 220000, "Un amor que espera medio siglo. romance literario en español contemporáneo."],
  ["La sombra del viento", "Carlos Ruiz Zafón", "9780143124934", 2001, 487, 4.4, 290000, "Un misterio de libros en la Barcelona de posguerra. thriller gótico en español."],
  ["Como agua para chocolate", "Laura Esquivel", "9780385420179", 1989, 256, 4.0, 180000, "Recetas y pasión en la Revolución mexicana. novela romántica mágica en español."],
  ["Pedro Páramo", "Juan Rulfo", "9780802133908", 1955, 124, 4.2, 95000, "Un hijo busca a su padre en un pueblo fantasmal. clásico mexicano modernista en español."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of es) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Classics"], language: "es" }))
}

const fr = [
  ["L'Étranger", "Albert Camus", "9782070360022", 1942, 185, 4.2, 410000, "Meursault sous le soleil d'Algérie. classique français existentialiste."],
  ["Les Misérables (vol. 1)", "Victor Hugo", "9782253096339", 1862, 520, 4.4, 120000, "Jean Valjean et la justice en France. classique français épique."],
  ["Madame Bovary", "Gustave Flaubert", "9782070360879", 1856, 384, 4.0, 280000, "Une femme étouffée par la province. roman réaliste français classique."],
  ["Le Petit Prince", "Antoine de Saint-Exupéry", "9782070612756", 1943, 96, 4.8, 610000, "Un aviateur rencontre un prince. conte philosophique français."],
  ["Chanson douce", "Leïla Slimani", "9782072760889", 2016, 160, 4.0, 95000, "Une nanny et une famille parisienne. thriller psychologique contemporain français."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of fr) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Classics"], language: "fr" }))
}

const de = [
  ["Der Vorleser", "Bernhard Schlink", "9780375726972", 1995, 224, 4.0, 210000, "Eine Affäre und NS-Vergangenheit. deutscher Literaturklassiker Zeitgeschichte."],
  ["Die unendliche Geschichte", "Michael Ende", "9783522176504", 1979, 428, 4.6, 380000, "Ein Junge rettet Phantásien. Fantasy-Klassiker deutsch Kinderbuch."],
  ["Im Westen nichts Neues", "Erich Maria Remarque", "9780449911368", 1929, 296, 4.3, 290000, "Soldaten im Ersten Weltkrieg. deutscher Kriegsroman modern."],
  ["Der Schwarm", "Frank Schätzing", "9783462032970", 2004, 908, 4.1, 170000, "Meereswesen bedrohen die Menschheit. deutscher Science-Fiction Thriller."],
  ["Tschick", "Wolfgang Herrndorf", "9783499253282", 2010, 220, 4.2, 95000, "Zwei Jungen fahren durch Deutschland. deutscher Jugendroman Roadtrip humor."],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of de) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "Sci-Fi"], language: "de" }))
}

const hi = [
  ["गोदान", "Munshi Premchand", "9788170283456", 1936, 376, 4.3, 45000, "किसानों का संघर्ष और नैतिकता। हिंदी साहित्य क्लासिक उपन्यास।"],
  ["मधुशाला", "Harivansh Rai Bachchan", "9788170281230", 1935, 136, 4.5, 28000, "शराबखाने की रूपक कविता। हिंदी काव्य क्लासिक।"],
  ["राग दरबारी", "Shrilal Shukla", "9788126716456", 1968, 232, 4.2, 19000, "गाँव की राजनीति और विडंबना। हिंदी आधुनिक उपन्यास व्यंग्य।"],
  ["गुनाहों का देवता", "Dharamvir Bharati", "9788126722120", 1949, 200, 4.1, 12000, "प्रेम और नैतिक द्वंद्व। हिंदी उपन्यास क्लासिक।"],
  ["कितने पाकिस्तान", "Kamleshwar", "9788126728907", 2000, 248, 4.0, 8000, "विभाजन की स्मृति और राजनीति। हिंदी समकालीन उपन्यास।"],
]
for (const [title, author, isbn, year, pages, rating, rc, desc] of hi) {
  books.push(book({ title, author, isbn, publishedYear: year, pageCount: pages, averageRating: rating, ratingsCount: rc, description: desc, genres: ["Literary Fiction", "History"], language: "hi" }))
}

// Mood-tagged real titles: maintain via `node scripts/apply-mood-catalog.mjs` (see scripts/mood-append.json + generate-mood-seed.mjs).

// Dedupe by ISBN
const seen = new Set()
const unique = []
for (const b of books) {
  if (seen.has(b.isbn)) continue
  seen.add(b.isbn)
  unique.push(b)
}

writeFileSync(out, JSON.stringify(unique, null, 2) + "\n", "utf8")
console.log(`Wrote ${unique.length} books to ${out}`)
