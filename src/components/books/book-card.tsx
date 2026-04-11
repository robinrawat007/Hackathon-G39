"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import type { Book, BookCardProps, ShelfStatus } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StarRating } from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { BookCoverImage } from "@/components/books/book-cover-image"
import { formatBookDisplayName } from "@/lib/format-book-display"

const COVER_SIZES = {
  default: "(max-width: 768px) 50vw, 240px",
  compact: "120px",
  featured: "(max-width: 640px) 72vw, 280px",
  shelf: "(max-width: 768px) 45vw, 220px",
} as const

const shelfCtaClass =
  "border-primary/45 text-text hover:border-primary hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/15 hover:shadow-primary-glow"

function FallbackCover({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
    .join("")
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-secondary text-text-muted">
      <span className="font-sans text-sm font-semibold tabular-nums tracking-tight">{initials || "BK"}</span>
    </div>
  )
}

function AddToShelfButton({
  onAddToShelf,
  bookId,
}: {
  onAddToShelf?: (bookId: string, status: ShelfStatus) => void
  bookId: string
}) {
  if (!onAddToShelf) return null
  return (
    <div className="mt-3 flex gap-2">
      <Button variant="secondary" size="sm" className={shelfCtaClass} onClick={() => onAddToShelf(bookId, "want_to_read")}>
        Want to read
      </Button>
      <Button variant="secondary" size="sm" className={shelfCtaClass} onClick={() => onAddToShelf(bookId, "reading")}>
        Reading now
      </Button>
    </div>
  )
}

export function BookCard({ book, variant, onAddToShelf, isLoading }: BookCardProps) {
  const reduced = usePrefersReducedMotion()

  if (isLoading) {
    return (
      <div className="glass-card flex min-h-[420px] flex-col rounded-2xl border border-border/60 p-4">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <Skeleton className="mt-4 h-4 w-[88%]" />
        <Skeleton className="mt-2 h-4 w-[55%]" />
        <Skeleton className="mt-auto h-10 w-full rounded-md" />
      </div>
    )
  }

  const isCompact = variant === "compact"
  const isCarousel = variant === "carousel"
  const genre = book.genres[0]
  const displayTitle = formatBookDisplayName(book.title)
  const displayAuthor = formatBookDisplayName(book.author)

  if (isCarousel) {
    return (
      <div className="group/card relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-card backdrop-blur-md transition-shadow duration-300 hover:border-primary/40 hover:shadow-hover">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.1] via-transparent to-transparent"
          aria-hidden
        />
        <Link href={`/book/${book.slug}`} className="relative z-[1] flex min-h-0 flex-1 flex-col p-3.5 pt-4">
          <div className="relative shrink-0 [perspective:900px]">
            <motion.div
              className="book-cover-frame relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.4)] ring-1 ring-black/5"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={reduced ? undefined : { scale: 1.02, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.06]" aria-hidden />
              {book.coverUrl ? (
                <BookCoverImage
                  src={book.coverUrl}
                  alt={`${displayTitle} by ${displayAuthor} book cover`}
                  fill
                  sizes={COVER_SIZES.featured}
                  tier="list"
                  className="object-cover object-center transition-transform duration-500 group-hover/card:scale-[1.03]"
                />
              ) : (
                <FallbackCover title={displayTitle} />
              )}
            </motion.div>
          </div>
          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
            <div className="min-h-[2.75rem] shrink-0">
              <div className="line-clamp-2 font-heading text-[0.9375rem] font-semibold leading-snug tracking-tight text-heading sm:text-base">
                {displayTitle}
              </div>
            </div>
            <div className="shrink-0 truncate text-sm text-text-muted/95">{displayAuthor}</div>
            <div className="flex shrink-0 items-center justify-between gap-2 pt-0.5">
              <StarRating value={Math.round(book.averageRating)} interactive={false} size="sm" />
              <div className="shrink-0 text-xs tabular-nums text-text-muted">
                {book.ratingsCount > 0 ? `${book.ratingsCount.toLocaleString("en-US")} reviews` : "Be the first"}
              </div>
            </div>
            <span className="mt-auto inline-flex min-h-[2.25rem] w-fit items-center justify-center self-start rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-all duration-200 group-hover/card:bg-gradient-to-br group-hover/card:from-[#8B5E3C] group-hover/card:to-[#C4956A] group-hover/card:shadow-primary-glow">
              View
            </span>
          </div>
        </Link>
      </div>
    )
  }

  /* Default & shelf: same footprint as carousel grids — no uneven card heights */
  return (
    <div className="glass-card group relative flex h-full w-full min-h-[460px] flex-col rounded-xl border border-border/80 shadow-card">
      <Link href={`/book/${book.slug}`} className="flex flex-1 flex-col p-4">
        <div className="relative [perspective:800px]">
          <motion.div
            className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-xl border border-border shadow-lg"
            style={{ transformStyle: "preserve-3d" }}
            whileHover={reduced ? undefined : { scale: 1.04, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {book.coverUrl ? (
              <BookCoverImage
                src={book.coverUrl}
                alt={`${displayTitle} by ${displayAuthor} book cover`}
                fill
                sizes={COVER_SIZES[variant]}
                tier="list"
                className="object-center scale-[1.04] transition-transform duration-500 group-hover:scale-[1.08]"
              />
            ) : (
              <FallbackCover title={displayTitle} />
            )}
          </motion.div>
        </div>
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
          <div className="space-y-1.5">
            <div className="min-h-[2.75rem]">
              <div
                className={cn(
                  "line-clamp-2 font-heading font-semibold leading-snug text-heading",
                  isCompact ? "text-sm" : "text-base"
                )}
              >
                {displayTitle}
              </div>
            </div>
            <div className="truncate text-sm text-text-muted">{displayAuthor}</div>
            {!isCompact && genre ? (
              <div>
                <span className="book-genre-pill inline-block max-w-full truncate text-xs">{genre}</span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-2">
            <StarRating value={Math.round(book.averageRating)} interactive={false} size="sm" />
            <div className="shrink-0 text-xs tabular-nums text-text-muted">
              {book.ratingsCount > 0 ? `${book.ratingsCount.toLocaleString("en-US")} reviews` : "No reviews yet"}
            </div>
          </div>
          <span className="mt-auto inline-flex min-h-[2.25rem] w-fit items-center justify-center self-start rounded-md border border-primary/50 px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:text-heading group-hover:shadow-primary-glow">
            View
          </span>
        </div>
      </Link>
      <div className="mt-auto px-4 pb-4">
        <AddToShelfButton onAddToShelf={onAddToShelf} bookId={book.id} />
      </div>
    </div>
  )
}

export function BookCardMini({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-border/80 bg-surface/50 p-3 shadow-card backdrop-blur-sm transition-all duration-200 hover:border-border-glow hover:shadow-hover"
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md border border-border">
        {book.coverUrl ? (
          <BookCoverImage
            src={book.coverUrl}
            alt={`${book.title} by ${book.author} book cover`}
            fill
            sizes="80px"
            tier="list"
            className="object-cover"
            fallbackLabel={formatBookDisplayName(book.title)}
          />
        ) : (
          <FallbackCover title={book.title} />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-heading">{formatBookDisplayName(book.title)}</div>
        <div className="truncate text-xs text-text-muted">{formatBookDisplayName(book.author)}</div>
      </div>
    </Link>
  )
}
