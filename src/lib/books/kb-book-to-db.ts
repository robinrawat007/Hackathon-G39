import type { Book } from "@/types/book"

/** Row shape for public.books — catalog mirror of KB titles (for FK + display). */
export function kbBookToDbRow(book: Book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover_url: book.coverUrl || null,
    description: book.description || null,
    genres: book.genres ?? [],
    published_year: book.publishedYear || null,
    page_count: book.pageCount || null,
    isbn: book.isbn || null,
    average_rating: book.averageRating ?? null,
    ratings_count: book.ratingsCount ?? null,
    slug: book.slug || null,
  }
}

export type DbBookRow = {
  id: string
  title: string
  author: string
  cover_url: string | null
  description: string | null
  genres: string[] | null
  published_year: number | null
  page_count: number | null
  isbn: string | null
  average_rating: number | null
  ratings_count: number | null
  slug: string | null
}

export function dbBookRowToBook(row: DbBookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    coverUrl: row.cover_url ?? "",
    description: row.description ?? "",
    genres: row.genres ?? [],
    publishedYear: row.published_year ?? 0,
    pageCount: row.page_count ?? 0,
    isbn: row.isbn ?? "",
    averageRating: Number(row.average_rating ?? 0),
    ratingsCount: row.ratings_count ?? 0,
    slug: row.slug ?? row.id,
  }
}
