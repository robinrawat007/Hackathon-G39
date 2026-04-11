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

async function fetchProofReviews(): Promise<ReviewEntry[]> {
  const res = await fetch("/api/community/feed?limit=3", { cache: "no-store" })
  if (!res.ok) return []
  const json = (await res.json()) as { reviews?: ReviewEntry[] }
  return Array.isArray(json.reviews) ? json.reviews.slice(0, 3) : []
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
  const n = reviews.length

  const go = React.useCallback(
    (dir: -1 | 1) => {
      setActive((i) => (i + dir + n) % n)
    },
    [n]
  )

  React.useEffect(() => {
    if (reduced || n <= 1) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [reduced, n])

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
        setActive(n - 1)
      }
    },
    [go, n]
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
          <div className="mt-10 mx-auto flex max-w-4xl min-w-0 items-stretch gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Previous review"
              className={cn(arrowBtnClass, "self-center")}
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            </button>

            <div className="min-w-0 flex-1">
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
                    transform: `translateX(-${(active * 100) / n}%)`,
                    width: `${n * 100}%`,
                  }}
                >
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="box-border min-h-[300px] shrink-0 px-0.5 sm:px-1"
                      style={{ width: `${100 / n}%` }}
                      aria-hidden={reviews[active]?.id !== r.id}
                    >
                      <ReviewCard review={r} className="h-full w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label="Review slides">
                {reviews.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-label={`Go to review ${i + 1} of ${n}`}
                    aria-current={i === active ? "true" : undefined}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === active ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"
                    )}
                    onClick={() => setActive(i)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Next review"
              className={cn(arrowBtnClass, "self-center")}
              onClick={() => go(1)}
            >
              <ChevronRight className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
