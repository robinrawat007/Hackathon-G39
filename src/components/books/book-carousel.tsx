"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import type { Book } from "@/types/book"
import { BookCard } from "@/components/books/book-card"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

/** One card column: 220px track + gap-4 */
const CARD_STEP_PX = 236
const AUTO_ADVANCE_MS = 5200

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

function stepScrollPx(track: HTMLDivElement) {
  const firstItem = track.querySelector<HTMLElement>("[data-carousel-item]")
  if (firstItem) {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "16") || 16
    return Math.round(firstItem.getBoundingClientRect().width + gap)
  }
  return CARD_STEP_PX
}

export function BookCarousel({ books, title }: { books: Book[]; title: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const titleId = React.useId()

  const scrollBy = React.useCallback(
    (dx: number) => {
      const el = ref.current
      if (!el) return
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      el.scrollBy({ left: dx, behavior: prefersReduced ? "auto" : "smooth" })
    },
    []
  )

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const behavior = prefersReduced ? "auto" : "smooth"
      const step = ref.current ? stepScrollPx(ref.current) : CARD_STEP_PX

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        ref.current?.scrollBy({ left: -step, behavior })
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        ref.current?.scrollBy({ left: step, behavior })
      } else if (e.key === "Home") {
        e.preventDefault()
        ref.current?.scrollTo({ left: 0, behavior })
      } else if (e.key === "End") {
        e.preventDefault()
        const el = ref.current
        if (el) el.scrollTo({ left: el.scrollWidth, behavior })
      }
    },
    []
  )

  React.useEffect(() => {
    if (books.length === 0 || reduced) return

    const tick = () => {
      const el = ref.current
      if (!el) return

      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
      if (maxScroll <= 2) return

      const step = stepScrollPx(el)
      const behavior: ScrollBehavior = "smooth"
      const nextLeft = el.scrollLeft + step

      if (nextLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior })
      } else {
        el.scrollBy({ left: step, behavior })
      }
    }

    const id = window.setInterval(tick, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [books.length, reduced])

  if (books.length === 0) {
    return null
  }

  const arrowBtnClass = cn(
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12",
    "border-2 border-primary/60 bg-bg-secondary text-heading shadow-card",
    "transition-all duration-200 hover:border-primary hover:bg-surface-hover hover:text-primary hover:shadow-primary-glow",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "active:scale-[0.96]"
  )

  return (
    <motion.section
      className="py-16 md:py-24"
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id={titleId} className="font-heading text-h2 text-heading">
              {title}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-text-muted">Swipe or use arrows — the row glides smoothly to the next set.</p>
          </div>
        </div>

        <div
          className="mt-8 flex items-center gap-2 md:gap-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label={`Previous books in ${title}`}
            aria-controls={`${titleId}-track`}
            className={arrowBtnClass}
            onClick={() => {
              const el = ref.current
              const step = el ? stepScrollPx(el) : CARD_STEP_PX
              scrollBy(-step)
            }}
          >
            <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
          </button>

          <motion.div
            id={`${titleId}-track`}
            ref={ref}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-labelledby={titleId}
            onKeyDown={onKeyDown}
            className={cn(
              "flex min-h-0 min-w-0 flex-1 snap-x snap-proximity gap-4 overflow-x-auto overflow-y-visible pb-2 outline-none [-webkit-overflow-scrolling:touch] scroll-smooth",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
            variants={reduced ? undefined : list}
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "show"}
            viewport={{ once: true, margin: "-40px" }}
          >
            {books.map((b) =>
              reduced ? (
                <div key={b.id} data-carousel-item className="w-[220px] shrink-0 snap-start">
                  <BookCard book={b} variant="featured" />
                </div>
              ) : (
                <motion.div
                  key={b.id}
                  data-carousel-item
                  variants={item}
                  className="w-[220px] shrink-0 snap-start"
                >
                  <BookCard book={b} variant="featured" />
                </motion.div>
              )
            )}
          </motion.div>

          <button
            type="button"
            aria-label={`Next books in ${title}`}
            aria-controls={`${titleId}-track`}
            className={arrowBtnClass}
            onClick={() => {
              const el = ref.current
              const step = el ? stepScrollPx(el) : CARD_STEP_PX
              scrollBy(step)
            }}
          >
            <ChevronRight className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </div>
    </motion.section>
  )
}
