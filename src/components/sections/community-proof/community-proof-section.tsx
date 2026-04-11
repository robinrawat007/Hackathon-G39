"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"

import { ReviewCard } from "@/components/community/review-card"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

type ReviewEntry = {
  id: string
  userId: string
  userName: string
  avatarUrl: string
  bookTitle: string
  bookSlug: string
  rating: number
  body: string
  createdAt: string
}

const REVIEWS_PER_PAGE = 3

async function fetchProofReviews(): Promise<ReviewEntry[]> {
  const res = await fetch("/api/community/feed?limit=9", { cache: "no-store" })
  if (!res.ok) return []
  const json = (await res.json()) as { reviews?: ReviewEntry[] }
  return Array.isArray(json.reviews) ? json.reviews.slice(0, 9) : []
}

// Shown only when the DB has no reviews yet
const FALLBACK_REVIEWS: ReviewEntry[] = [
  {
    id: "r1",
    userId: "u1",
    userName: "Maya L.",
    avatarUrl: "",
    bookTitle: "Tomorrow, and Tomorrow, and Tomorrow",
    bookSlug: "tomorrow-and-tomorrow-and-tomorrow-gabrielle-zevin",
    rating: 5,
    body: "ShelfAI suggested this after I said I wanted character-driven stories with messy friendships. I finished it in three days and immediately texted my book club.",
    createdAt: "2026-04-08T00:00:00.000Z",
  },
  {
    id: "r2",
    userId: "u2",
    userName: "Jordan K.",
    avatarUrl: "",
    bookTitle: "The Ocean at the End of the Lane",
    bookSlug: "the-ocean-at-the-end-of-the-lane-neil-gaiman",
    rating: 4,
    body: "I asked for something eerie but not gruesome, short enough for a weekend. The vibe was exactly right — nostalgic, unsettling, and oddly comforting.",
    createdAt: "2026-04-05T00:00:00.000Z",
  },
  {
    id: "r3",
    userId: "u3",
    userName: "Priya S.",
    avatarUrl: "",
    bookTitle: "Project Hail Mary",
    bookSlug: "project-hail-mary-andy-weir",
    rating: 5,
    body: "I told ShelfAI I loved hard sci-fi but wanted more heart. It nailed the balance — big ideas, humor, and a friendship I didn't expect to care about that much.",
    createdAt: "2026-04-03T00:00:00.000Z",
  },
]

const AUTO_ADVANCE_MS = 3000

export function CommunityProofSection() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState(0)
  const titleId = React.useId()

  const { data } = useQuery({
    queryKey: ["community-proof-reviews"],
    queryFn: fetchProofReviews,
    staleTime: 10 * 60 * 1000,
  })

  const reviews = data && data.length >= 3 ? data : FALLBACK_REVIEWS

  const pages = React.useMemo(() => {
    const chunks: ReviewEntry[][] = []
    for (let i = 0; i < reviews.length; i += REVIEWS_PER_PAGE) {
      chunks.push(reviews.slice(i, i + REVIEWS_PER_PAGE))
    }
    return chunks.length > 0 ? chunks : [[]]
  }, [reviews])

  const pageCount = pages.length

  const go = React.useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + pageCount) % pageCount)
    },
    [pageCount]
  )

  React.useEffect(() => {
    if (reduced || pageCount <= 1) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % pageCount)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [reduced, pageCount])

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        go(-1)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        go(1)
      } else if (e.key === "Home") {
        e.preventDefault()
        setActive(0)
      } else if (e.key === "End") {
        e.preventDefault()
        setActive(pageCount - 1)
      }
    },
    [go, pageCount]
  )

  const arrowBtnClass = cn(
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11",
    "border-2 border-primary/60 bg-bg-secondary text-heading shadow-card",
    "transition-all duration-200 hover:border-primary hover:bg-surface-hover hover:text-primary hover:shadow-primary-glow",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "active:scale-[0.96]"
  )

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.h2
          id={titleId}
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-heading text-h2 text-heading"
        >
          Finished the book. Meant every word.
        </motion.h2>
        <p className="mt-2 max-w-xl text-sm text-text-muted">
          Short, honest takes from people who read the pick end to end — not five-star spam or filler blurbs.
        </p>

        {reduced ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
            {reviews.map((r) => (
              <div key={r.id} className="flex h-full min-h-[300px]">
                <ReviewCard review={r} className="w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "mt-10 mx-auto flex min-w-0 max-w-7xl items-stretch gap-2 sm:gap-3",
              pageCount <= 1 && "justify-center"
            )}
          >
            {pageCount > 1 ? (
              <button
                type="button"
                aria-label="Previous reviews"
                className={cn(arrowBtnClass, "self-center")}
                onClick={() => go(-1)}
              >
                <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
              </button>
            ) : null}

            <div className={cn("min-w-0", pageCount > 1 ? "flex-1" : "w-full")}>
              <div
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-labelledby={titleId}
                onKeyDown={onKeyDown}
                className="overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <div
                  className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translateX(-${(active * 100) / pageCount}%)`,
                    width: `${pageCount * 100}%`,
                  }}
                >
                  {pages.map((page, pageIdx) => (
                    <div
                      key={page.map((p) => p.id).join("-")}
                      className="box-border shrink-0 px-0.5 sm:px-1"
                      style={{ width: `${100 / pageCount}%` }}
                      aria-hidden={active !== pageIdx}
                    >
                      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
                        {page.map((r) => (
                          <div key={r.id} className="flex min-h-[280px] md:min-h-[300px]">
                            <ReviewCard review={r} className="h-full w-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {pageCount > 1 ? (
                <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label="Review pages">
                  {pages.map((page, i) => (
                    <button
                      key={page[0]?.id ?? `p-${i}`}
                      type="button"
                      aria-label={`Go to page ${i + 1} of ${pageCount}`}
                      aria-current={i === active ? "true" : undefined}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === active ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"
                      )}
                      onClick={() => setActive(i)}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {pageCount > 1 ? (
              <button
                type="button"
                aria-label="Next reviews"
                className={cn(arrowBtnClass, "self-center")}
                onClick={() => go(1)}
              >
                <ChevronRight className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
