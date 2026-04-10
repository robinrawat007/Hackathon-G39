import { searchGoogleBooks } from "@/lib/google-books"
import type { Book } from "@/types/book"

import { HomeExtraCoversRail } from "./home-extra-covers-rail"

function dedupeById(books: Book[]): Book[] {
  const seen = new Set<string>()
  const out: Book[] = []
  for (const b of books) {
    if (seen.has(b.id)) continue
    seen.add(b.id)
    out.push(b)
  }
  return out
}

/** Pulse row while the async rail streams in. */
export function HomeExtraCoversFallback() {
  return (
    <section
      className="border-y border-primary/10 bg-gradient-to-b from-bg-secondary/30 via-transparent to-bg/40 py-10 md:py-14"
      aria-busy="true"
      aria-label="Loading more book covers"
    >
      <div className="container min-w-0">
        <div className="h-3 w-40 animate-pulse rounded bg-surface" />
        <div className="mt-3 h-8 max-w-sm animate-pulse rounded bg-surface" />
        <div className="mt-2 h-4 max-w-md animate-pulse rounded bg-surface/80" />
      </div>
      <div className="mx-auto mt-8 flex w-full min-w-0 max-w-[1440px] items-center gap-2 px-4 sm:px-5 md:px-6 lg:px-10">
        <div className="hidden h-11 w-11 shrink-0 rounded-full bg-surface/80 sm:block md:h-12 md:w-12" aria-hidden />
        <div className="flex min-w-0 flex-1 gap-4 overflow-hidden pb-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[100px] sm:w-[118px]">
              <div className="aspect-[2/3] animate-pulse rounded-md border border-border/50 bg-surface/80" />
              <div className="mx-auto mt-2 h-3 w-[85%] animate-pulse rounded bg-surface/70" />
            </div>
          ))}
        </div>
        <div className="hidden h-11 w-11 shrink-0 rounded-full bg-surface/80 sm:block md:h-12 md:w-12" aria-hidden />
      </div>
    </section>
  )
}

const HEADING_ID = "home-extra-covers-heading"

/** Second catalog slice on the home page — different queries, merged & slider UI like Trending. */
export async function HomeExtraCoversSection() {
  const [awardWinners, literary] = await Promise.all([
    searchGoogleBooks({ q: "award+winning+fiction+novel", maxResults: 20, startIndex: 0 }),
    searchGoogleBooks({ q: "booker+prize+novel+fiction", maxResults: 20, startIndex: 0 }),
  ])

  const books = dedupeById([...awardWinners, ...literary]).slice(0, 36)
  if (books.length < 4) return null

  return (
    <section className="border-y border-primary/10 bg-gradient-to-b from-bg-secondary/30 via-transparent to-bg/40 py-10 md:py-14">
      <div className="container min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">Beyond the carousel</p>
        <h2 id={HEADING_ID} className="mt-2 font-heading text-h3 text-heading sm:text-h2">
          More covers worth a click
        </h2>
        <p className="mt-2 max-w-xl text-sm text-text-muted">
          Two catalog passes merged into one long rail — arrows, keyboard, swipe, and the same gentle auto-advance as
          Trending.
        </p>
      </div>

      <div className="mt-8">
        <HomeExtraCoversRail books={books} labelledBy={HEADING_ID} />
      </div>
    </section>
  )
}
