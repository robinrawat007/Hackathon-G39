import Link from "next/link"

import { BookCarousel } from "@/components/books/book-carousel"
import { Button } from "@/components/ui/button"
import { searchGoogleBooks } from "@/lib/google-books"

/** Static shell while the async server section streams in. */
export function FeaturedBooksFallback() {
  return (
    <section className="py-16 md:py-24" aria-busy="true" aria-label="Loading trending books">
      <div className="container mb-8">
        <h2 className="font-heading text-h2 text-heading">Trending This Week</h2>
      </div>
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-4 md:px-6 lg:grid-cols-4 lg:px-10">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[480px] animate-pulse rounded-xl border border-border/80 bg-surface/80 p-4 shadow-card"
          >
            <div className="aspect-[2/3] w-full rounded-lg bg-bg-secondary" />
            <div className="mt-4 h-4 w-[88%] rounded bg-bg-secondary" />
            <div className="mt-2 h-4 w-[55%] rounded bg-bg-secondary" />
            <div className="mt-6 h-9 w-full rounded-md bg-bg-secondary" />
          </div>
        ))}
      </div>
    </section>
  )
}

function TrendingEmpty() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading text-h2 text-heading">Trending This Week</h2>
        <p className="mt-4 max-w-xl text-sm text-text-muted">
          The live catalog isn&apos;t wired up on this build yet — you can still hunt the full stack in Browse.
        </p>
        <div className="mt-6">
          <Link href="/browse">
            <Button variant="secondary" size="sm">
              Browse anyway
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Fetches on the server — no client /api round-trip, so Trending always fills when the key works. */
export async function FeaturedBooksSection() {
  const books = await searchGoogleBooks({ q: "subject:fiction", maxResults: 12 })
  if (books.length === 0) {
    return <TrendingEmpty />
  }
  return <BookCarousel title="Trending This Week" books={books} />
}
