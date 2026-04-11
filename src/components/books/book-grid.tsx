"use client"

import type { Book } from "@/types/book"
import { BookCard } from "@/components/books/book-card"

export function BookGrid({ books, isLoading }: { books: Book[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:items-stretch">
        {Array.from({ length: 12 }).map((_, i) => (
          <BookCard
            key={i}
            book={{
              id: String(i),
              title: "",
              author: "",
              coverUrl: "",
              description: "",
              genres: [],
              publishedYear: 0,
              pageCount: 0,
              isbn: "",
              averageRating: 0,
              ratingsCount: 0,
              slug: "",
            }}
            variant="default"
            isLoading
          />
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/80 bg-surface/40 px-6 py-12 text-center backdrop-blur-sm">
        <p className="text-sm text-text-muted">Nothing in this lane — widen filters or reset and run it back.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:items-stretch">
      {books.map((b) => (
        <div key={b.id} className="flex h-full min-h-0">
          <BookCard book={b} variant="default" />
        </div>
      ))}
    </div>
  )
}
