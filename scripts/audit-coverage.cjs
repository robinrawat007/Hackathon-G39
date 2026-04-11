const j = require("../src/data/books-knowledge-base.json")

const GENRES = [
  "Literary Fiction",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Romance",
  "Non-Fiction",
  "History",
  "Biography",
  "Self-Help",
  "Horror",
  "Thriller",
  "Classics",
]

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

/** Books that match genre filter (same logic as bookMatchesGenreFilter simplified: exact genre string on book). */
function countGenre(g) {
  const gl = g.trim().toLowerCase()
  return j.filter((b) => {
    if (b.genres.some((x) => x.toLowerCase() === gl)) return true
    const blob = `${b.title} ${b.description ?? ""} ${b.genres.join(" ")}`.toLowerCase()
    if (blob.includes(gl)) return true
    const parts = gl.split(/\s+/).filter((p) => p.length > 0)
    if (parts.length > 1) return parts.every((p) => p.length <= 2 || blob.includes(p))
    return false
  }).length
}

const byGenre = {}
for (const g of GENRES) {
  byGenre[g] = countGenre(g)
}

const byMood = {}
for (const m of MOODS) {
  byMood[m] = j.filter((b) => (b.mood || []).includes(m)).length
}

console.log("Books per sidebar genre (filter logic, ≥1 means chip alone can return results):")
console.log(byGenre)
console.log("")
console.log("Books with explicit mood[] tag per slug (≥10 each by design):")
console.log(byMood)
