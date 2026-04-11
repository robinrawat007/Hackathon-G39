"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import { normalizeBookCoverUrl } from "@/lib/book-cover-url"
import { bookCoverNeedsUnoptimized } from "@/lib/book-cover-image"
import { formatBookDisplayName } from "@/lib/format-book-display"
import { BOOK_COVER_BLUR_DATA_URL } from "@/lib/image-placeholders"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import type { Book } from "@/types/book"

export type HomeExtraCoverItem = Pick<Book, "id" | "slug" | "title" | "coverUrl">

/** ~cover tile + gap-4 when measure fails */
const STEP_FALLBACK = 134
const AUTO_ADVANCE_MS = 5200

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
}

const item = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
}

function stepScrollPx(track: HTMLDivElement) {
  const first = track.querySelector<HTMLElement>("[data-home-cover-item]")
  if (first) {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "16") || 16
    return Math.round(first.getBoundingClientRect().width + gap)
  }
  return STEP_FALLBACK
}

export function HomeExtraCoversRail({ books, labelledBy }: { books: HomeExtraCoverItem[]; labelledBy: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const trackId = React.useId()

  const scrollBy = React.useCallback((dx: number) => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollBy({ left: dx, behavior: prefersReduced ? "auto" : "smooth" })
  }, [])

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const behavior = prefersReduced ? "auto" : "smooth"
    const step = ref.current ? stepScrollPx(ref.current) : STEP_FALLBACK

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
  }, [])

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

  if (books.length === 0) return null

  const itemClass = "h-full shrink-0 snap-start w-[100px] sm:w-[118px]"

  const arrowBtnClass = cn(
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 md:h-12 md:w-12",
    "border-2 border-primary/60 bg-bg-secondary text-heading shadow-card",
    "transition-all duration-200 hover:border-primary hover:bg-surface-hover hover:text-primary hover:shadow-primary-glow",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "active:scale-[0.96]"
  )

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1440px] items-stretch gap-2 px-4 sm:gap-2 sm:px-5 md:gap-3 md:px-6 lg:gap-4 lg:px-10">
      <button
        type="button"
        aria-label="Previous covers"
        aria-controls={trackId}
        className={cn(arrowBtnClass, "self-center")}
        onClick={() => {
          const el = ref.current
          const step = el ? stepScrollPx(el) : STEP_FALLBACK
          scrollBy(-step)
        }}
      >
        <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
      </button>

      <motion.div
        id={trackId}
        ref={ref}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelledBy}
        onKeyDown={onKeyDown}
        className={cn(
          "flex min-h-0 min-w-0 flex-1 gap-4 overflow-x-auto overflow-y-visible pb-2 outline-none [-webkit-overflow-scrolling:touch] scroll-smooth snap-x snap-proximity",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        )}
        variants={reduced ? undefined : list}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, amount: 0.1 }}
      >
        {books.map((b) => {
          const src = b.coverUrl ? normalizeBookCoverUrl(b.coverUrl, "list") : ""
          const title = formatBookDisplayName(b.title)
          const inner = (
            <>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/70 bg-bg-secondary shadow-card transition duration-200 group-hover:border-primary/45 group-hover:shadow-hover">
                {src ? (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BOOK_COVER_BLUR_DATA_URL}
                    unoptimized={bookCoverNeedsUnoptimized(src)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-text-muted">
                    {title}
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-center text-[11px] leading-snug text-text-muted transition-colors group-hover:text-heading sm:text-xs">
                {title}
              </p>
            </>
          )

          return reduced ? (
            <div key={b.id} data-home-cover-item className={cn(itemClass, "group")}>
              <Link
                href={`/book/${b.slug}`}
                className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open ${title}`}
              >
                {inner}
              </Link>
            </div>
          ) : (
            <motion.div key={b.id} data-home-cover-item variants={item} className={cn(itemClass, "group")}>
              <Link
                href={`/book/${b.slug}`}
                className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-label={`Open ${title}`}
              >
                {inner}
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      <button
        type="button"
        aria-label="Next covers"
        aria-controls={trackId}
        className={cn(arrowBtnClass, "self-center")}
        onClick={() => {
          const el = ref.current
          const step = el ? stepScrollPx(el) : STEP_FALLBACK
          scrollBy(step)
        }}
      >
        <ChevronRight className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  )
}
