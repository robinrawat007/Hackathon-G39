import { searchGoogleBooks } from "@/lib/google-books"
import type { Book } from "@/types/book"

/** Compact shape sent to the LLM — real catalog fields only, trimmed. */
export type BookContextEntry = {
  id: string
  title: string
  author: string
  slug: string
  description: string
  genres: string[]
  averageRating: number
  ratingsCount: number
  publishedYear: number
  isbn: string
}

function compactBook(b: Book): BookContextEntry {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    slug: b.slug,
    description: b.description.replace(/\s+/g, " ").trim().slice(0, 720),
    genres: b.genres,
    averageRating: b.averageRating,
    ratingsCount: b.ratingsCount,
    publishedYear: b.publishedYear,
    isbn: b.isbn,
  }
}

/**
 * Uses the user's message as a Google Books search query (same API as Browse).
 * The LLM reasons over these real rows — no pgvector / RAG required.
 */
export async function fetchBooksContextForChat(userMessage: string, limit = 8): Promise<BookContextEntry[]> {
  const q = userMessage.replace(/\s+/g, " ").trim().slice(0, 420)
  if (!q) return []
  const books = await searchGoogleBooks({ q, maxResults: limit })
  return books.map(compactBook)
}
