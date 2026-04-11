/**
 * Strips synthetic "Mood Shelf:" rows and appends real books until each mood has ≥10
 * tagged entries (explicit `mood: [slug]`). Run: node scripts/apply-mood-catalog.mjs
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const kbPath = join(__dirname, "..", "src", "data", "books-knowledge-base.json")
const seedPath = join(__dirname, "mood-append.json")

const MOODS = [
  "dark-eerie",
  "romantic",
  "mind-bending",
  "epic-adventure",
  "light-funny",
  "career-inspiring",
  "fantasy-worlds",
  "emotional",
]

function slugify(title, author) {
  return `${title} ${author}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const raw = JSON.parse(readFileSync(kbPath, "utf8"))
const kept = raw.filter((b) => !String(b.title ?? "").startsWith("Mood Shelf:"))
const isbnSet = new Set(kept.map((b) => b.isbn))

let maxId = 0
for (const b of kept) {
  const m = /^kb-(\d+)$/.exec(b.id ?? "")
  if (m) maxId = Math.max(maxId, +m[1])
}

/** @type {Array<{ mood: string, title: string, author: string, isbn: string, publishedYear: number, pageCount: number, averageRating: number, ratingsCount: number, description: string, genres: string[] }>} */
const seeds = JSON.parse(readFileSync(seedPath, "utf8"))

const perMood = Object.fromEntries(MOODS.map((m) => [m, 0]))
const out = [...kept]

for (const c of seeds) {
  if (!MOODS.includes(c.mood)) continue
  if (perMood[c.mood] >= 10) continue
  if (isbnSet.has(c.isbn)) continue
  maxId++
  isbnSet.add(c.isbn)
  perMood[c.mood]++
  out.push({
    id: `kb-${String(maxId).padStart(3, "0")}`,
    title: c.title,
    author: c.author,
    coverUrl: `https://covers.openlibrary.org/b/isbn/${c.isbn}-M.jpg`,
    description: c.description,
    genres: c.genres,
    mood: [c.mood],
    publishedYear: c.publishedYear,
    pageCount: c.pageCount,
    isbn: c.isbn,
    averageRating: c.averageRating,
    ratingsCount: c.ratingsCount,
    slug: slugify(c.title, c.author),
    language: c.language ?? "en",
  })
}

for (const m of MOODS) {
  if (perMood[m] < 10) {
    console.warn(`[apply-mood-catalog] mood "${m}" only has ${perMood[m]} new rows (need 10). Add more seeds.`)
  }
}

writeFileSync(kbPath, JSON.stringify(out, null, 2) + "\n", "utf8")
console.log(`Wrote ${out.length} books (removed Mood Shelf dummies, added mood-tagged rows).`)
