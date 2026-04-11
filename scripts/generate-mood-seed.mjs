/**
 * One-time generator for mood-append.json — run: node scripts/generate-mood-seed.mjs
 */
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @typedef {{ mood: string, title: string, author: string, isbn: string, publishedYear: number, pageCount: number, averageRating: number, ratingsCount: number, description: string, genres: string[] }} Row */

/** @type {Row[]} */
const rows = []

function add(
  mood,
  title,
  author,
  isbn,
  publishedYear,
  pageCount,
  averageRating,
  ratingsCount,
  description,
  genres
) {
  rows.push({
    mood,
    title,
    author,
    isbn,
    publishedYear,
    pageCount,
    averageRating,
    ratingsCount,
    description,
    genres,
  })
}

// --- dark-eerie (11) ---
add(
  "dark-eerie",
  "House of Leaves",
  "Mark Z. Danielewski",
  "9780375703761",
  2000,
  709,
  4.1,
  85000,
  "A labyrinthine haunted-house narrative with footnotes; gothic dread and uncanny architecture.",
  ["Horror", "Literary Fiction"]
)
add("dark-eerie", "Dracula", "Bram Stoker", "9780141439846", 1897, 488, 4.0, 420000, "The classic vampire novel: dark castles, atmospheric horror, and gothic dread.", [
  "Horror",
  "Classics",
])
add(
  "dark-eerie",
  "Frankenstein",
  "Mary Shelley",
  "9780141439471",
  1818,
  280,
  3.9,
  380000,
  "Scientific hubris and isolation on the Arctic ice; gothic horror and moral darkness.",
  ["Horror", "Classics"]
)
add(
  "dark-eerie",
  "We Have Always Lived in the Castle",
  "Shirley Jackson",
  "9780143131075",
  1962,
  146,
  4.2,
  210000,
  "A reclusive family and a poisoned past; unsettling small-town gothic atmosphere.",
  ["Horror", "Literary Fiction"]
)
add(
  "dark-eerie",
  "Interview with the Vampire",
  "Anne Rice",
  "9780345419645",
  1976,
  342,
  4.0,
  290000,
  "Immortal predators reflect on guilt and desire; lush atmospheric horror.",
  ["Horror", "Fantasy"]
)
add(
  "dark-eerie",
  "Mexican Gothic",
  "Silvia Moreno-Garcia",
  "9780525542979",
  2020,
  320,
  4.1,
  180000,
  "A decaying mansion in rural Mexico hides family horrors; eerie and claustrophobic.",
  ["Horror", "Literary Fiction"]
)
add(
  "dark-eerie",
  "The Woman in Black",
  "Susan Hill",
  "9780062834190",
  1983,
  208,
  4.0,
  95000,
  "A solicitor encounters a vengeful ghost on a marsh; classic atmospheric dread.",
  ["Horror", "Classics"]
)
add(
  "dark-eerie",
  "Pet Sematary",
  "Stephen King",
  "9781982115989",
  1983,
  580,
  4.2,
  520000,
  "Grief and resurrection in small-town Maine; escalating horror and dread.",
  ["Horror", "Thriller"]
)
add(
  "dark-eerie",
  "Gone Girl",
  "Gillian Flynn",
  "9780307588371",
  2012,
  432,
  4.0,
  890000,
  "Marriage turns sinister; psychological twists and a dark domestic nightmare.",
  ["Thriller", "Mystery"]
)
add(
  "dark-eerie",
  "The Only Good Indians",
  "Stephen Graham Jones",
  "9780525562945",
  2020,
  320,
  4.1,
  75000,
  "A deer hunt returns to haunt friends years later; horror rooted in place and guilt.",
  ["Horror", "Literary Fiction"]
)
add(
  "dark-eerie",
  "Bird Box",
  "Josh Malerman",
  "9780316432614",
  2014,
  272,
  4.0,
  210000,
  "Survivors navigate a world where seeing brings madness; tense atmospheric horror.",
  ["Horror", "Thriller"]
)

// --- romantic (11) ---
add(
  "romantic",
  "Pride and Prejudice",
  "Jane Austen",
  "9780141439516",
  1813,
  432,
  4.3,
  2100000,
  "Elizabeth and Darcy spar and soften; a timeless romantic love story with wit.",
  ["Romance", "Classics"]
)
add("romantic", "Emma", "Jane Austen", "9780141439585", 1815, 512, 4.2, 980000, "Matchmaking mischief in the English countryside; romantic comedy of manners.", [
  "Romance",
  "Classics",
])
add(
  "romantic",
  "The Notebook",
  "Nicholas Sparks",
  "9780446520802",
  1996,
  214,
  4.1,
  620000,
  "A lifelong romantic love story told through memory and devotion.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "The Kiss Quotient",
  "Helen Hoang",
  "9780062791394",
  2018,
  336,
  4.2,
  310000,
  "A data-driven woman hires an escort to practice intimacy; tender romantic love story.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "Book Lovers",
  "Emily Henry",
  "9780593334836",
  2022,
  400,
  4.2,
  220000,
  "Literary agents collide in a small town; sharp banter and romantic love story beats.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "Seven Days in June",
  "Tia Williams",
  "9780062990690",
  2021,
  336,
  4.3,
  95000,
  "Two authors reunite in Brooklyn; second-chance romantic love story with heat.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "The Love Hypothesis",
  "Ali Hazelwood",
  "9780593336823",
  2021,
  400,
  4.3,
  410000,
  "A fake-dating STEM rom-com; funny, warm romantic love story.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "Part of Your World",
  "Abby Jimenez",
  "9780063085421",
  2022,
  400,
  4.2,
  120000,
  "Small-town doctor meets big-city executive; heartfelt romantic love story.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "Hooked",
  "Emily McIntire",
  "9781728275889",
  2021,
  400,
  4.0,
  180000,
  "A dark romance retelling; obsession and desire drive the romantic love story.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "The Spanish Love Deception",
  "Elena Armas",
  "9781668000845",
  2021,
  496,
  4.2,
  290000,
  "Fake dating to a wedding in Spain; slow-burn romantic love story.",
  ["Romance", "Fiction"]
)
add(
  "romantic",
  "Delilah Green Doesn't Care",
  "Ashley Herring Blake",
  "9781984804877",
  2022,
  400,
  4.1,
  55000,
  "A photographer returns home and falls for her rival; queer romantic love story.",
  ["Romance", "Fiction"]
)

// --- mind-bending (11) ---
add(
  "mind-bending",
  "Shutter Island",
  "Dennis Lehane",
  "9780307276741",
  2003,
  316,
  4.1,
  410000,
  "A marshal hunts a patient on an island asylum; psychological twist after twist.",
  ["Thriller", "Mystery"]
)
add(
  "mind-bending",
  "Fight Club",
  "Chuck Palahniuk",
  "9780307454980",
  1996,
  218,
  4.1,
  520000,
  "Underground brawls and split identity; surreal psychological twist on modern life.",
  ["Fiction", "Thriller"]
)
add(
  "mind-bending",
  "Annihilation",
  "Jeff VanderMeer",
  "9780374104092",
  2014,
  208,
  4.0,
  240000,
  "A biologist enters Area X; uncanny ecology and psychological twist territory.",
  ["Sci-Fi", "Horror"]
)
add(
  "mind-bending",
  "Never Let Me Go",
  "Kazuo Ishiguro",
  "9781400078776",
  2005,
  304,
  4.0,
  310000,
  "Boarding-school friends learn the truth slowly; devastating psychological twist.",
  ["Literary Fiction", "Sci-Fi"]
)
add(
  "mind-bending",
  "The Murder of Roger Ackroyd",
  "Agatha Christie",
  "9780062073488",
  1926,
  288,
  4.2,
  280000,
  "Poirot faces a famous narrator trick; classic twist that redefined mystery.",
  ["Mystery", "Classics"]
)
add(
  "mind-bending",
  "Fingersmith",
  "Sarah Waters",
  "9781573228732",
  2002,
  592,
  4.2,
  95000,
  "Victorian con games and doubled identities; twisty psychological suspense.",
  ["Literary Fiction", "Mystery"]
)
add(
  "mind-bending",
  "Recursion",
  "Blake Crouch",
  "9781542040839",
  2019,
  336,
  4.2,
  180000,
  "False memories and looping timelines; high-concept psychological twist thriller.",
  ["Sci-Fi", "Thriller"]
)
add(
  "mind-bending",
  "I'm Thinking of Ending Things",
  "Iain Reid",
  "9780143131129",
  2016,
  224,
  3.9,
  140000,
  "A road trip unravels into dread; claustrophobic psychological twist.",
  ["Horror", "Literary Fiction"]
)
add(
  "mind-bending",
  "Motherless Brooklyn",
  "Jonathan Lethem",
  "9780306906473",
  1999,
  448,
  4.0,
  85000,
  "A detective with Tourette's probes murder; noir with surreal psychological edges.",
  ["Mystery", "Literary Fiction"]
)
add(
  "mind-bending",
  "The 7½ Deaths of Evelyn Hardcastle",
  "Stuart Turton",
  "9781492668097",
  2018,
  480,
  4.1,
  120000,
  "Relive the same day as different guests; a looped psychological twist puzzle.",
  ["Mystery", "Fantasy"]
)
add(
  "mind-bending",
  "Piranesi",
  "Susanna Clarke",
  "9781635576281",
  2020,
  272,
  4.3,
  180000,
  "Infinite halls and journals; gentle surreal psychological twist on identity.",
  ["Fantasy", "Literary Fiction"]
)

// --- epic-adventure (11) ---
add(
  "epic-adventure",
  "The Fellowship of the Ring",
  "J.R.R. Tolkien",
  "9780547953832",
  1954,
  432,
  4.4,
  1200000,
  "The quest to destroy a ring begins; foundational epic adventure in Middle-earth.",
  ["Fantasy", "Classics"]
)
add(
  "epic-adventure",
  "The Hobbit",
  "J.R.R. Tolkien",
  "9780547928227",
  1937,
  310,
  4.3,
  980000,
  "Bilbo joins dwarves to reclaim a mountain; charming epic adventure prelude.",
  ["Fantasy", "Classics"]
)
add(
  "epic-adventure",
  "The Name of the Wind",
  "Patrick Rothfuss",
  "9780756404741",
  2007,
  722,
  4.5,
  620000,
  "Kvothe's legend grows across a richly built world; lyrical epic adventure fantasy.",
  ["Fantasy", "Fiction"]
)
add(
  "epic-adventure",
  "The Lies of Locke Lamora",
  "Scott Lynch",
  "9780553804686",
  2006,
  512,
  4.4,
  210000,
  "Thieves in a canal city pull impossible heists; swaggering epic adventure fantasy.",
  ["Fantasy", "Fiction"]
)
add(
  "epic-adventure",
  "The Priory of the Orange Tree",
  "Samantha Shannon",
  "9781635574042",
  2019,
  848,
  4.3,
  140000,
  "Dragons, queendoms, and a world-spanning quest; sweeping epic adventure fantasy.",
  ["Fantasy", "Fiction"]
)
add(
  "epic-adventure",
  "Red Rising",
  "Pierce Brown",
  "9780345539786",
  2014,
  400,
  4.3,
  290000,
  "A miner infiltrates elite gladiator schools on Mars; brutal sci-fi epic adventure.",
  ["Sci-Fi", "Fiction"]
)
add(
  "epic-adventure",
  "Crown of Midnight",
  "Sarah J. Maas",
  "9781619630367",
  2013,
  448,
  4.3,
  310000,
  "An assassin takes on political contracts; fast-paced romantic epic adventure fantasy.",
  ["Fantasy", "Romance"]
)
add(
  "epic-adventure",
  "Jade City",
  "Fonda Lee",
  "9780316391248",
  2017,
  560,
  4.2,
  85000,
  "Clan families wield jade magic in a city at war; cinematic epic adventure fantasy.",
  ["Fantasy", "Fiction"]
)
add(
  "epic-adventure",
  "The Blade Itself",
  "Joe Abercrombie",
  "9780316387316",
  2007,
  544,
  4.2,
  140000,
  "Grim mercenaries and politics collide; gritty epic adventure fantasy opener.",
  ["Fantasy", "Fiction"]
)
add(
  "epic-adventure",
  "Mistborn: The Final Empire",
  "Brandon Sanderson",
  "9780760316899",
  2006,
  672,
  4.5,
  380000,
  "A thief crew topples an immortal emperor; inventive magic epic adventure fantasy.",
  ["Fantasy", "Fiction"]
)
add(
  "epic-adventure",
  "Kings of the Wyld",
  "Nicholas Eames",
  "9780316374841",
  2017,
  560,
  4.2,
  75000,
  "Retired mercenaries ride again; funny, bloody epic adventure fantasy.",
  ["Fantasy", "Fiction"]
)

// --- light-funny (11) ---
add(
  "light-funny",
  "Good Omens",
  "Neil Gaiman and Terry Pratchett",
  "9780060853983",
  1990,
  432,
  4.3,
  410000,
  "An angel and demon team up to stop Armageddon; witty humor comedy fantasy.",
  ["Fantasy", "Humor"]
)
add(
  "light-funny",
  "The Hitchhiker's Guide to the Galaxy",
  "Douglas Adams",
  "9780345418025",
  1979,
  224,
  4.2,
  520000,
  "Earth demolished for a bypass; absurd humor comedy across the galaxy.",
  ["Sci-Fi", "Humor"]
)
add(
  "light-funny",
  "Bridget Jones's Diary",
  "Helen Fielding",
  "9780330352802",
  1996,
  320,
  4.0,
  380000,
  "Diary of dating disasters in London; sharp humor comedy romance.",
  ["Romance", "Humor"]
)
add(
  "light-funny",
  "The Rosie Project",
  "Graeme Simsion",
  "9781476756890",
  2013,
  304,
  4.2,
  290000,
  "A professor seeks a wife with spreadsheets; sweet humor comedy romance.",
  ["Romance", "Humor"]
)
add(
  "light-funny",
  "The Weird Sisters",
  "Eleanor Brown",
  "9780451234947",
  2011,
  336,
  3.9,
  95000,
  "Three sisters return home; warm family humor comedy with Shakespeare quotes.",
  ["Literary Fiction", "Humor"]
)
add(
  "light-funny",
  "Where'd You Go, Bernadette",
  "Maria Semple",
  "9780316204279",
  2012,
  352,
  4.0,
  210000,
  "Emails and misadventures in Seattle; breezy humor comedy about a vanished mom.",
  ["Literary Fiction", "Humor"]
)
add(
  "light-funny",
  "Eleanor Oliphant Is Completely Fine",
  "Gail Honeyman",
  "9780735220683",
  2017,
  336,
  4.3,
  410000,
  "An awkward woman learns friendship; deadpan humor comedy with heart.",
  ["Literary Fiction", "Humor"]
)
add(
  "light-funny",
  "A Man Called Ove",
  "Fredrik Backman",
  "9781476735014",
  2012,
  352,
  4.4,
  520000,
  "A grumpy widower softens when neighbors intrude; bittersweet humor comedy.",
  ["Literary Fiction", "Humor"]
)
add(
  "light-funny",
  "Less",
  "Andrew Sean Greer",
  "9780316312532",
  2017,
  272,
  4.0,
  95000,
  "A novelist flees a wedding on a world tour; witty humor comedy Pulitzer winner.",
  ["Literary Fiction", "Humor"]
)
add(
  "light-funny",
  "The Flatshare",
  "Beth O'Leary",
  "9781250299484",
  2019,
  400,
  4.2,
  180000,
  "Two strangers share a bed on shifts; charming humor comedy romance.",
  ["Romance", "Humor"]
)
add(
  "light-funny",
  "Dial A for Aunties",
  "Jesse Q. Sutanto",
  "9780593336672",
  2021,
  320,
  4.1,
  75000,
  "A wedding, a body, and meddling aunties; madcap humor comedy mystery.",
  ["Romance", "Humor"]
)

// --- career-inspiring (11) ---
add(
  "career-inspiring",
  "Deep Work",
  "Cal Newport",
  "9781455586693",
  2016,
  304,
  4.2,
  210000,
  "Rules for focused success in a distracted world; business career leadership ideas.",
  ["Self-Help", "Non-Fiction"]
)
add(
  "career-inspiring",
  "Lean In",
  "Sheryl Sandberg",
  "9780385347149",
  2013,
  240,
  4.0,
  310000,
  "Women, work, and the will to lead; leadership success and career advice.",
  ["Non-Fiction", "Self-Help"]
)
add(
  "career-inspiring",
  "Shoe Dog",
  "Phil Knight",
  "9781501135910",
  2016,
  400,
  4.5,
  520000,
  "Nike's founder on hustle and risk; memoir of business career leadership.",
  ["Biography", "Non-Fiction"]
)
add(
  "career-inspiring",
  "Educated",
  "Tara Westover",
  "9780399590504",
  2018,
  352,
  4.5,
  620000,
  "From Idaho survivalism to Cambridge; education as escape and career path.",
  ["Biography", "Non-Fiction"]
)
add(
  "career-inspiring",
  "Outliers",
  "Malcolm Gladwell",
  "9780316017930",
  2008,
  320,
  4.1,
  410000,
  "What makes high achievers different; success patterns and leadership insight.",
  ["Non-Fiction", "Psychology"]
)
add(
  "career-inspiring",
  "Start With Why",
  "Simon Sinek",
  "9781592404831",
  2009,
  256,
  4.1,
  380000,
  "How great leaders inspire action; leadership success through purpose.",
  ["Non-Fiction", "Business"]
)
add(
  "career-inspiring",
  "Thinking, Fast and Slow",
  "Daniel Kahneman",
  "9780141033570",
  2011,
  512,
  4.2,
  290000,
  "Biases that shape decisions; psychology for better judgment at work.",
  ["Non-Fiction", "Psychology"]
)
add(
  "career-inspiring",
  "Dare to Lead",
  "Brené Brown",
  "9780399592522",
  2018,
  320,
  4.3,
  210000,
  "Brave work and tough conversations; leadership success with courage.",
  ["Non-Fiction", "Self-Help"]
)
add(
  "career-inspiring",
  "Never Split the Difference",
  "Chris Voss",
  "9780062853194",
  2016,
  288,
  4.4,
  240000,
  "FBI negotiation tactics for business; career leadership communication.",
  ["Non-Fiction", "Business"]
)
add(
  "career-inspiring",
  "Range",
  "David Epstein",
  "9780735214486",
  2019,
  352,
  4.3,
  95000,
  "Why generalists triumph in a specialized world; career success insight.",
  ["Non-Fiction", "Psychology"]
)
add(
  "career-inspiring",
  "Grit",
  "Angela Duckworth",
  "9781501111112",
  2016,
  352,
  4.2,
  180000,
  "Passion and perseverance beat talent; leadership success habits.",
  ["Non-Fiction", "Psychology"]
)

// --- fantasy-worlds (11) ---
add(
  "fantasy-worlds",
  "A Wizard of Earthsea",
  "Ursula K. Le Guin",
  "9780547851395",
  1968,
  272,
  4.2,
  210000,
  "A young mage learns names of power on island archipelagos; classic fantasy magic adventure.",
  ["Fantasy", "Classics"]
)
add(
  "fantasy-worlds",
  "The Color of Magic",
  "Terry Pratchett",
  "9780062237425",
  1983,
  288,
  4.0,
  310000,
  "A tourist on Discworld meets hapless wizards; comic fantasy magic adventure.",
  ["Fantasy", "Humor"]
)
add(
  "fantasy-worlds",
  "Six of Crows",
  "Leigh Bardugo",
  "9781250027315",
  2015,
  512,
  4.5,
  380000,
  "A heist crew in a Dutch-inspired city; gritty YA fantasy magic adventure.",
  ["Fantasy", "Fiction"]
)
add(
  "fantasy-worlds",
  "Neverwhere",
  "Neil Gaiman",
  "9780060558123",
  1997,
  400,
  4.1,
  240000,
  "London Below hides markets and monsters; urban fantasy magic adventure.",
  ["Fantasy", "Fiction"]
)
add(
  "fantasy-worlds",
  "Stardust",
  "Neil Gaiman",
  "9780061689246",
  1999,
  288,
  4.2,
  210000,
  "A wall separates village from faerie; a quest for a fallen star, fantasy magic adventure.",
  ["Fantasy", "Romance"]
)
add(
  "fantasy-worlds",
  "The Poppy War",
  "R.F. Kuang",
  "9780062662590",
  2018,
  544,
  4.3,
  140000,
  "War school in a fantasy China; brutal military fantasy magic adventure.",
  ["Fantasy", "Fiction"]
)
add(
  "fantasy-worlds",
  "Gideon the Ninth",
  "Tamsyn Muir",
  "9781250313075",
  2019,
  448,
  4.2,
  120000,
  "Lesbian necromancers in a haunted palace; gothic fantasy magic adventure.",
  ["Fantasy", "Sci-Fi"]
)
add(
  "fantasy-worlds",
  "The Bone Shard Daughter",
  "Andrea Stewart",
  "9780316541425",
  2020,
  448,
  4.1,
  65000,
  "An emperor's heir hunts rebels across islands; inventive fantasy magic adventure.",
  ["Fantasy", "Fiction"]
)
add(
  "fantasy-worlds",
  "The City of Brass",
  "S.A. Chakraborty",
  "9780062679428",
  2017,
  544,
  4.2,
  95000,
  "Cairo con artist enters djinn politics; lush historical fantasy magic adventure.",
  ["Fantasy", "Fiction"]
)
add(
  "fantasy-worlds",
  "The Ten Thousand Doors of January",
  "Alix E. Harrow",
  "9780316421998",
  2019,
  400,
  4.2,
  85000,
  "Doors between worlds open to a curious girl; lyrical fantasy magic adventure.",
  ["Fantasy", "Literary Fiction"]
)
add(
  "fantasy-worlds",
  "The Night Circus",
  "Erin Morgenstern",
  "9780385537670",
  2011,
  400,
  4.2,
  310000,
  "Rival magicians in a black-and-white circus; romantic fantasy magic adventure.",
  ["Fantasy", "Romance"]
)

// --- emotional (11) ---
add(
  "emotional",
  "A Thousand Splendid Suns",
  "Khaled Hosseini",
  "9781594483859",
  2007,
  384,
  4.4,
  520000,
  "Two women endure Kabul's wars; devastating emotional literary drama.",
  ["Literary Fiction", "Fiction"]
)
add(
  "emotional",
  "Me Before You",
  "Jojo Moyes",
  "9780143124542",
  2012,
  400,
  4.3,
  410000,
  "A caregiver falls for a quadriplegic man; tearful emotional literary drama.",
  ["Romance", "Fiction"]
)
add(
  "emotional",
  "The Book Thief",
  "Markus Zusak",
  "9780375842207",
  2005,
  576,
  4.4,
  620000,
  "Death narrates a girl stealing books in Nazi Germany; emotional literary drama.",
  ["Literary Fiction", "Classics"]
)
add(
  "emotional",
  "Norwegian Wood",
  "Haruki Murakami",
  "9780375704024",
  1987,
  304,
  4.0,
  240000,
  "Love and loss in 1960s Tokyo; melancholy emotional literary drama.",
  ["Literary Fiction", "Classics"]
)
add(
  "emotional",
  "Atonement",
  "Ian McEwan",
  "9780385721790",
  2001,
  368,
  4.0,
  310000,
  "A child's lie alters lives across decades; guilt and emotional literary drama.",
  ["Literary Fiction", "Classics"]
)
add(
  "emotional",
  "Small Great Things",
  "Jodi Picoult",
  "9780345544957",
  2016,
  512,
  4.3,
  210000,
  "A nurse faces a trial about race and birth; courtroom emotional literary drama.",
  ["Literary Fiction", "Fiction"]
)
add(
  "emotional",
  "Everything I Never Told You",
  "Celeste Ng",
  "9781594633666",
  2014,
  304,
  4.1,
  290000,
  "A family fractures after a daughter's death; intimate emotional literary drama.",
  ["Literary Fiction", "Mystery"]
)
add(
  "emotional",
  "The Light Between Oceans",
  "M.L. Stedman",
  "9781451681735",
  2012,
  352,
  4.2,
  180000,
  "A lighthouse couple makes an impossible choice; moral emotional literary drama.",
  ["Literary Fiction", "Fiction"]
)
add(
  "emotional",
  "My Sister's Keeper",
  "Jodi Picoult",
  "9780743454537",
  2004,
  432,
  4.1,
  380000,
  "A sister sues for medical emancipation; family ethical emotional literary drama.",
  ["Literary Fiction", "Fiction"]
)
add(
  "emotional",
  "Tell the Wolves I'm Home",
  "Carol Rifka Brunt",
  "9780143123874",
  2012,
  368,
  4.2,
  95000,
  "A girl grieves her uncle in the AIDS era; tender emotional literary drama.",
  ["Literary Fiction", "Fiction"]
)
add(
  "emotional",
  "The Kite Runner",
  "Khaled Hosseini",
  "9781594481773",
  2003,
  384,
  4.3,
  890000,
  "Friendship and betrayal in Afghanistan; sweeping emotional literary drama.",
  ["Literary Fiction", "Fiction"]
)

const seen = new Set()
for (const r of rows) {
  if (seen.has(r.isbn)) throw new Error(`Duplicate ISBN in seed: ${r.isbn}`)
  seen.add(r.isbn)
}

writeFileSync(join(__dirname, "mood-append.json"), JSON.stringify(rows, null, 2) + "\n", "utf8")
console.log(`Wrote ${rows.length} seed rows to mood-append.json`)
