"use client"

import { motion, useReducedMotion } from "framer-motion"

import type { Book } from "@/types/book"
import { BookCard } from "@/components/books/book-card"

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

export function BookGrid({ books, isLoading }: { books: Book[]; isLoading: boolean }) {
  const reduced = useReducedMotion()

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

  if (reduced) {
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

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:items-stretch"
      variants={list}
      initial="hidden"
      animate="show"
    >
      {books.map((b) => (
        <motion.div key={b.id} variants={item} className="flex h-full min-h-0">
          <BookCard book={b} variant="default" />
        </motion.div>
      ))}
    </motion.div>
  )
}
