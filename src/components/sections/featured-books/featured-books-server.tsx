import Link from "next/link"

import { BookCarousel } from "@/components/books/book-carousel"
import { Button } from "@/components/ui/button"
import { searchKnowledgeBooks } from "@/lib/knowledge-books"

/** Static shell while the async server section streams in — mirrors BookCarousel layout to avoid scroll jump. */
export function FeaturedBooksFallback() {
  const cardShell =
    "h-full min-h-0 shrink-0 " +
    "w-[min(280px,calc(100vw-7.5rem))] " +
    "sm:w-[calc((100%-1rem)/2)] " +
    "lg:w-[calc((100%-3rem)/4)]"

  return (
    <section className="py-16 md:py-24" aria-busy="true" aria-label="Loading trending books">
      <div className="container mb-8">
        <h2 className="font-heading text-h2 text-heading">Trending This Week</h2>
        <div className="mt-2 h-4 max-w-lg animate-pulse rounded bg-surface" aria-hidden />
        <div className="mt-2 h-4 max-w-md animate-pulse rounded bg-surface/80" aria-hidden />
      </div>
      <div className="mx-auto flex w-full min-w-0 max-w-[1440px] items-center gap-2 px-4 sm:gap-2 sm:px-5 md:gap-3 md:px-6 lg:gap-4 lg:px-10">
        <div
          className="flex h-9 w-9 shrink-0 rounded-full bg-surface/80 sm:h-11 sm:w-11 md:h-12 md:w-12"
          aria-hidden
        />
        <div className="flex min-h-0 min-w-0 flex-1 gap-4 overflow-hidden pb-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cardShell}>
              <div className="flex h-full min-h-[380px] animate-pulse flex-col rounded-2xl border border-border/80 bg-surface/80 p-4 shadow-card sm:min-h-[420px]">
                <div className="aspect-[2/3] w-full rounded-lg bg-bg-secondary" />
                <div className="mt-4 h-4 w-[88%] rounded bg-bg-secondary" />
                <div className="mt-2 h-4 w-[55%] rounded bg-bg-secondary" />
                <div className="mt-auto h-10 w-full rounded-md bg-bg-secondary" />
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex h-9 w-9 shrink-0 rounded-full bg-surface/80 sm:h-11 sm:w-11 md:h-12 md:w-12"
          aria-hidden
        />
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
          The home carousel reads from your local knowledge base file — add titles there to populate this section.
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
  const books = searchKnowledgeBooks({ q: "fiction", maxResults: 12 })
  if (books.length === 0) {
    return <TrendingEmpty />
  }
  return <BookCarousel title="Trending This Week" books={books} />
}
