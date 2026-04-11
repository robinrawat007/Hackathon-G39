import { searchKnowledgeBooks } from "@/lib/knowledge-books"
import type { Book } from "@/types/book"

/** Compact shape for internal use. */
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
 * Build a search query from the full conversation so that follow-ups like
 * "give me more" or "something darker" still find relevant books.
 * Uses the last 3 user turns — enough context without overloading the scorer.
 */
export function buildChatSearchQuery(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): string {
  const userTurns = messages.filter((m) => m.role === "user").slice(-3)
  return userTurns
    .map((m) => m.content.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 600)
}

/**
 * Fetch and rank books from the local knowledge base using the conversation
 * context as the search query.
 */
export function fetchBooksContextForChat(
  query: string,
  limit = 12
): BookContextEntry[] {
  const q = query.replace(/\s+/g, " ").trim().slice(0, 600)
  if (!q) return []
  return searchKnowledgeBooks({ q, maxResults: limit }).map(compactBook)
}

/**
 * Format the catalog entries as readable prose for the LLM system prompt.
 * Prose beats raw JSON for reasoning quality — the model parses structure
 * the same way but spends fewer tokens on syntax noise.
 */
export function formatCatalogForPrompt(books: BookContextEntry[]): string {
  if (books.length === 0) return "(no catalog matches for this query)"

  return books
    .map((b, i) => {
      const rating =
        b.averageRating > 0
          ? `${b.averageRating.toFixed(1)}★ (${b.ratingsCount.toLocaleString("en-US")} reviews)`
          : "unrated"
      const year = b.publishedYear ? ` · ${b.publishedYear}` : ""
      const genres = b.genres.length > 0 ? b.genres.join(", ") : "General"
      const desc = b.description || "No description available."
      return [
        `[${i + 1}] "${b.title}" by ${b.author}${year}`,
        `    Genres: ${genres} | ${rating}`,
        `    Description: ${desc}`,
        `    Book page: /book/${b.slug}`,
      ].join("\n")
    })
    .join("\n\n")
}
