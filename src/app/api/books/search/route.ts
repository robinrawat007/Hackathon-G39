import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { MOOD_SEARCH_TERMS } from "@/lib/constants"
import { rankKnowledgeBooksForQuery } from "@/lib/knowledge-books"
import { rateLimitResponse } from "@/lib/rate-limit"
import type { Book } from "@/types/book"

function moodToQueryPhrase(slug: string) {
  const mapped = MOOD_SEARCH_TERMS[slug as keyof typeof MOOD_SEARCH_TERMS]
  return mapped ?? slug.replace(/-/g, " ")
}

/** Build a free-text query for the local knowledge base (genre/mood chips become keywords). */
function subjectClause(genre: string) {
  const g = genre.trim()
  if (!g) return ""
  const escaped = g.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
  return /\s/.test(g) ? `subject:"${escaped}"` : `subject:${escaped}`
}

function buildQuery(params: URLSearchParams) {
  const qParts: string[] = []
  const genre = params.getAll("genre")
  const mood = params.getAll("mood")
  const era = params.get("era") ?? "any"
  const term = params.get("q")?.trim()

  if (term) qParts.push(term)
  if (genre.length > 0) {
    const clauses = genre.map(subjectClause).filter(Boolean)
    if (clauses.length > 0) {
      const joined = clauses.join(" OR ")
      qParts.push(clauses.length > 1 ? `(${joined})` : joined)
    }
  }
  if (mood.length > 0) {
    const phrases = mood.map(moodToQueryPhrase).filter((p) => p.trim().length > 0)
    if (phrases.length > 0) {
      const wrap = (p: string) => (/\s/.test(p) ? `(${p})` : p)
      const moodQ = phrases.length === 1 ? wrap(phrases[0]!) : `(${phrases.map(wrap).join(" OR ")})`
      qParts.push(moodQ)
    }
  }

  // Era cues as plain keywords for KB text search.
  if (era === "pre-1900") qParts.push("classic")
  if (era === "1900-1970") qParts.push("20th century")
  if (era === "1970-2000") qParts.push("modern")
  if (era === "2000-2015") qParts.push("contemporary")
  if (era === "recent") qParts.push("new")

  const q = qParts.length > 0 ? qParts.join(" ") : "subject:fiction"
  return { q }
}

function applyClientSideFilters(books: Book[], params: URLSearchParams) {
  const minRating = Number(params.get("minRating") ?? "0")
  const minPages = Number(params.get("minPages") ?? "0")
  const maxPages = Number(params.get("maxPages") ?? "9999")
  const language = params.get("language") ?? "any"

  return books.filter((b) => {
    // Unrated (0) stay visible; only enforce min when a rating exists.
    if (Number.isFinite(minRating) && minRating > 0 && b.averageRating > 0 && b.averageRating < minRating) return false
    if (Number.isFinite(minPages) && b.pageCount < minPages) return false
    if (Number.isFinite(maxPages) && b.pageCount > maxPages) return false
    if (language !== "any" && b.language && b.language !== language) return false
    return true
  })
}

function sortBooks(books: Book[], sort: string): Book[] {
  const out = [...books]
  switch (sort) {
    case "highest_rated":
      return out.sort((a, b) => b.averageRating - a.averageRating)
    case "most_reviewed":
      return out.sort((a, b) => b.ratingsCount - a.ratingsCount)
    case "newest":
      return out.sort((a, b) => b.publishedYear - a.publishedYear)
    case "relevance":
    default:
      return out
  }
}

export async function GET(req: Request) {
  return withApiErrorHandling("GET /api/books/search", async () => {
    const limited = await rateLimitResponse(req, "search", { max: 60, window: "1 m" })
    if (limited) return limited

    const url = new URL(req.url)
    const { q } = buildQuery(url.searchParams)
    const language = url.searchParams.get("language") ?? "any"
    const sort = url.searchParams.get("sort") ?? "relevance"
    const genreFilters = url.searchParams.getAll("genre").map((g) => g.trim()).filter(Boolean)
    const moodFilters = url.searchParams.getAll("mood").map((m) => m.trim()).filter(Boolean)

    const page = Math.max(0, Number(url.searchParams.get("page") ?? "0"))
    const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit") ?? "12")))

    const startIndex = page * limit
    const orderBy = sort === "newest" ? ("newest" as const) : ("relevance" as const)
    const ranked = rankKnowledgeBooksForQuery({
      q,
      langRestrict: language !== "any" ? language : undefined,
      orderBy,
      genres: genreFilters.length > 0 ? genreFilters : undefined,
      moods: moodFilters.length > 0 ? moodFilters : undefined,
    })
    const filtered = sortBooks(applyClientSideFilters(ranked, url.searchParams), sort)
    const items = filtered.slice(startIndex, startIndex + limit)
    const hasMore = startIndex + limit < filtered.length

    return NextResponse.json(
      {
        items,
        total: filtered.length,
        nextPage: hasMore ? page + 1 : null,
      },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } }
    )
  })
}

