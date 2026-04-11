import booksJson from "@/data/books-knowledge-base.json"
import { MOOD_SEARCH_TERMS } from "@/lib/constants"
import type { Book } from "@/types/book"

const BOOKS = booksJson as Book[]

/** Genre chip: match structured `genres` first, then title/description text. */
function bookMatchesGenreFilter(book: Book, genreLabel: string): boolean {
  const gl = genreLabel.trim().toLowerCase()
  if (!gl) return true
  const genreLc = book.genres.map((g) => g.toLowerCase())
  if (genreLc.includes(gl)) return true
  const blob = `${book.title} ${book.description ?? ""} ${book.genres.join(" ")}`.toLowerCase()
  if (blob.includes(gl)) return true
  const parts = gl.split(/\s+/).filter((p) => p.length > 0)
  if (parts.length <= 1) return false
  return parts.every((p) => (p.length <= 2 ? true : blob.includes(p)))
}

/** Mood chip: explicit `book.mood` slugs from the KB, else keyword match on synopsis (legacy rows). */
function bookMatchesMoodFilter(book: Book, moodSlug: string): boolean {
  const slug = moodSlug.trim()
  if (!slug) return true
  if (book.mood?.includes(slug)) return true
  const phrase =
    slug in MOOD_SEARCH_TERMS
      ? MOOD_SEARCH_TERMS[slug as keyof typeof MOOD_SEARCH_TERMS]
      : slug.replace(/-/g, " ")
  const blob = `${book.title} ${book.description ?? ""} ${book.genres.join(" ")}`.toLowerCase()
  const words = phrase.toLowerCase().split(/\s+/).filter((w) => w.length > 1)
  if (words.length === 0) return blob.includes(phrase.toLowerCase())
  const need = Math.max(1, Math.ceil(words.length * 0.51))
  let hit = 0
  for (const w of words) {
    if (blob.includes(w)) hit++
  }
  return hit >= need
}

function popularityScore(b: Book): number {
  return b.averageRating * Math.log(1 + Math.max(0, b.ratingsCount))
}

function tokenizeQuery(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/subject:/gi, " ")
    .replace(/[()"]/g, " ")
    .split(/[\s+]+/)
    .map((t) => t.replace(/[^a-z0-9-]/g, ""))
    .filter((t) => t.length > 1 && !["or", "and", "the"].includes(t))
}

function scoreBook(book: Book, tokens: string[]): number {
  if (tokens.length === 0) return 0
  let s = 0
  const title = book.title.toLowerCase()
  const author = book.author.toLowerCase()
  const desc = (book.description ?? "").toLowerCase()
  const genres = book.genres.join(" ").toLowerCase()
  for (const t of tokens) {
    if (title.includes(t)) s += 12
    if (author.includes(t)) s += 9
    if (genres.includes(t)) s += 7
    if (desc.includes(t)) s += 3
  }
  return s
}

function filterByLanguage(pool: Book[], langRestrict?: string): Book[] {
  if (!langRestrict?.trim() || langRestrict === "any") return pool
  const l = langRestrict.trim().toLowerCase()
  return pool.filter((b) => (b.language ?? "en").toLowerCase() === l)
}

/** Full ranked list for a query (no pagination) — apply filters, then slice per page in the API. */
export function rankKnowledgeBooksForQuery(params: {
  q: string
  langRestrict?: string
  orderBy?: "relevance" | "newest"
  /** When set, only books whose KB genres (or copy) match at least one selected genre. */
  genres?: string[]
  /** When set, only books whose synopsis/title/genres reflect the mood keywords (see MOOD_SEARCH_TERMS). */
  moods?: string[]
}): Book[] {
  let pool = filterByLanguage([...BOOKS], params.langRestrict)

  const genres = params.genres?.map((g) => g.trim()).filter((g) => g.length > 0) ?? []
  const moods = params.moods?.map((m) => m.trim()).filter((m) => m.length > 0) ?? []

  if (genres.length > 0) {
    pool = pool.filter((b) => genres.some((g) => bookMatchesGenreFilter(b, g)))
  }
  if (moods.length > 0) {
    pool = pool.filter((b) => moods.some((m) => bookMatchesMoodFilter(b, m)))
  }

  const tokens = tokenizeQuery(params.q.trim())
  let ranked: Book[]

  if (tokens.length === 0) {
    ranked = [...pool].sort((a, b) => popularityScore(b) - popularityScore(a))
  } else {
    const scored = pool.map((b) => ({ b, s: scoreBook(b, tokens) }))
    const hits = scored.filter((x) => x.s > 0)
    const source = hits.length > 0 ? hits : scored.map((x) => ({ b: x.b, s: popularityScore(x.b) }))
    ranked = [...source].sort((a, b) => b.s - a.s || popularityScore(b.b) - popularityScore(a.b)).map((x) => x.b)
  }

  if (params.orderBy === "newest") {
    ranked = [...ranked].sort((a, b) => b.publishedYear - a.publishedYear)
  }

  return ranked
}

/** Search the local JSON knowledge base (title, author, genres, description). */
export function searchKnowledgeBooks(params: {
  q: string
  maxResults: number
  startIndex?: number
  langRestrict?: string
  orderBy?: "relevance" | "newest"
}): Book[] {
  const ranked = rankKnowledgeBooksForQuery({
    q: params.q,
    langRestrict: params.langRestrict,
    orderBy: params.orderBy,
  })
  const start = Math.max(0, params.startIndex ?? 0)
  const max = Math.min(40, Math.max(1, params.maxResults))
  return ranked.slice(start, start + max)
}

/** Resolve a catalog title by KB id (same ids as `books-knowledge-base.json`). */
export function getBookById(id: string): Book | null {
  const trimmed = id.trim()
  return BOOKS.find((b) => b.id === trimmed) ?? null
}

export function getBookBySlug(slug: string): Book | null {
  const trimmed = slug.trim()
  const exact = BOOKS.find((b) => b.slug === trimmed)
  if (exact) return exact

  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const target = norm(trimmed)
  return BOOKS.find((b) => norm(b.slug) === target || norm(`${b.title}-${b.author}`) === target) ?? null
}

export function getSimilarBooks(book: Book, limit: number): Book[] {
  const genreSet = new Set(book.genres.map((g) => g.toLowerCase()))
  return BOOKS.filter((b) => b.id !== book.id)
    .map((b) => {
      const overlap = b.genres.filter((g) => genreSet.has(g.toLowerCase())).length
      return { b, s: overlap * 10 + popularityScore(b) }
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.b)
}

/** Hero 3D stack — first five entries from the knowledge base. */
export const HERO_STACK_COVERS = BOOKS.slice(0, 5).map((b) => ({
  title: b.title,
  author: b.author,
  cover: b.coverUrl,
}))

export function getRecommendationBooksForUser(userId: string, limit: number): Book[] {
  const pool = [...BOOKS].sort((a, b) => a.id.localeCompare(b.id))
  let h = 0
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0
  const span = Math.min(limit, pool.length)
  if (span === 0) return []
  const start = pool.length <= span ? 0 : h % (pool.length - span + 1)
  return pool.slice(start, start + span)
}
