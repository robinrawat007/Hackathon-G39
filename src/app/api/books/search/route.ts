import { NextResponse } from "next/server"

import { searchGoogleBooks } from "@/lib/google-books"
import { rateLimitResponse } from "@/lib/rate-limit"
import type { Book } from "@/types/book"

function buildQuery(params: URLSearchParams) {
  const qParts: string[] = []
  const genre = params.getAll("genre")
  const mood = params.getAll("mood")
  const era = params.get("era") ?? "any"
  const language = params.get("language") ?? "any"
  const term = params.get("q")?.trim()

  if (term) qParts.push(term)
  if (genre.length > 0) qParts.push(genre.map((g) => `subject:${g}`).join(" OR "))
  if (mood.length > 0) qParts.push(mood.join(" "))

  // Era is approximate in Google Books; we add light keyword cues.
  if (era === "pre-1900") qParts.push("classic")
  if (era === "1900-1970") qParts.push("20th century")
  if (era === "1970-2000") qParts.push("modern")
  if (era === "recent") qParts.push("new")

  const q = qParts.length > 0 ? qParts.join(" ") : "subject:fiction"
  return { q, language }
}

function applyClientSideFilters(books: Book[], params: URLSearchParams) {
  const minRating = Number(params.get("minRating") ?? "0")
  const minPages = Number(params.get("minPages") ?? "0")
  const maxPages = Number(params.get("maxPages") ?? "9999")

  return books.filter((b) => {
    if (Number.isFinite(minRating) && minRating > 0 && b.averageRating < minRating) return false
    if (Number.isFinite(minPages) && b.pageCount < minPages) return false
    if (Number.isFinite(maxPages) && b.pageCount > maxPages) return false
    return true
  })
}

export async function GET(req: Request) {
  const limited = await rateLimitResponse(req, "search", { max: 60, window: "1 m" })
  if (limited) return limited

  const url = new URL(req.url)
  const { q } = buildQuery(url.searchParams)

  const page = Math.max(0, Number(url.searchParams.get("page") ?? "0"))
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get("limit") ?? "12")))

  const startIndex = page * limit
  const books = await searchGoogleBooks({ q, maxResults: limit, startIndex })
  const filtered = applyClientSideFilters(books, url.searchParams)

  return NextResponse.json({
    items: filtered,
    nextPage: filtered.length === limit ? page + 1 : null,
  })
}

