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
import { useShelfStore } from "@/lib/stores/shelf-store"
import { formatBookDisplayName } from "@/lib/format-book-display"

const COVER_SIZES = {
  default: "(max-width: 768px) 50vw, 240px",
  compact: "120px",
  featured: "(max-width: 640px) 72vw, 280px",
  shelf: "(max-width: 768px) 45vw, 220px",
} as const

const shelfCtaClass =
  "border-primary/45 text-text hover:border-primary hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/15 hover:shadow-primary-glow"

const shelfCtaCarouselClass =
  "h-9 flex-1 rounded-lg border-0 bg-bg-secondary/90 text-xs font-semibold text-heading shadow-inner ring-1 ring-white/10 transition-all hover:bg-primary/15 hover:ring-primary/35 hover:shadow-[0_0_20px_rgba(99,179,237,0.15)]"

function FallbackCover({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
    .join("")
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-secondary text-text-muted">
      <span className="font-mono text-sm">{initials || "BK"}</span>
    </div>
  )
}

function AddToShelfButton({
  onAddToShelf,
  bookId,
  layout = "default",
}: {
  onAddToShelf?: (bookId: string, status: ShelfStatus) => void
  bookId: string
  layout?: "default" | "carousel"
}) {
  if (!onAddToShelf) return null
  const cta = layout === "carousel" ? shelfCtaCarouselClass : shelfCtaClass
  return (
    <div className={layout === "carousel" ? "mt-3 grid grid-cols-2 gap-2" : "mt-3 flex gap-2"}>
      <Button variant="secondary" size="sm" className={cta} onClick={() => onAddToShelf(bookId, "want_to_read")}>
        Want to read
      </Button>
      <Button variant="secondary" size="sm" className={cta} onClick={() => onAddToShelf(bookId, "reading")}>
        Reading now
      </Button>
    </div>
  )
}

export function BookCard({ book, variant, onAddToShelf, isLoading }: BookCardProps) {
  const reduced = usePrefersReducedMotion()
  const setBookOnShelf = useShelfStore((s) => s.setBookOnShelf)

  const addHandler =
    onAddToShelf ??
    ((bookId: string, status: ShelfStatus) => {
      if (bookId === book.id) setBookOnShelf(book, status)
    })

  if (isLoading) {
    return (
      <div className="glass-card flex min-h-[500px] flex-col rounded-2xl border border-border/60 p-4">
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
      <div className="group/card relative flex h-full w-full min-h-[500px] flex-col overflow-hidden rounded-2xl border border-primary/25 bg-surface/35 shadow-[0_24px_56px_rgba(0,0,0,0.55),0_0_0_1px_rgba(99,179,237,0.14)] backdrop-blur-md transition-shadow duration-300 hover:border-primary/40 hover:shadow-[0_28px_64px_rgba(0,0,0,0.6),0_0_40px_rgba(99,179,237,0.12)]">
        <span className="book-card-accent-line z-10" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/[0.12] via-transparent to-transparent"
          aria-hidden
        />
        <Link href={`/book/${book.slug}`} className="relative z-[1] flex flex-1 flex-col p-4 pt-5">
          <div className="relative [perspective:900px]">
            <motion.div
              className="book-cover-frame relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={reduced ? undefined : { scale: 1.03, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5" aria-hidden />
              {book.coverUrl ? (
                <BookCoverImage
                  src={book.coverUrl}
                  alt={`${displayTitle} by ${displayAuthor} book cover`}
                  fill
                  sizes={COVER_SIZES.featured}
                  tier="list"
                  className="object-center scale-[1.08] transition-transform duration-500 group-hover/card:scale-[1.12]"
                />
              ) : (
                <FallbackCover title={displayTitle} />
              )}
            </motion.div>
          </div>
          <div className="mt-5 flex min-h-0 flex-1 flex-col gap-1">
            <div className="min-h-[2.875rem]">
              <div className="line-clamp-2 font-heading text-base font-semibold leading-snug tracking-tight text-heading">
                {displayTitle}
              </div>
            </div>
            <div className="min-h-[1.35rem] truncate text-sm text-text-muted/95">{displayAuthor}</div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
              <StarRating value={Math.round(book.averageRating)} interactive={false} size="sm" />
              <div className="shrink-0 text-xs tabular-nums text-text-muted">
                {book.ratingsCount > 0 ? `${book.ratingsCount.toLocaleString()} reviews` : "Be the first"}
              </div>
            </div>
            <span className="mt-5 flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-sky-400 to-accent px-4 py-2.5 text-center text-sm font-semibold text-[#080b14] shadow-[0_10px_28px_rgba(99,179,237,0.4)] transition-all duration-200 group-hover/card:shadow-[0_14px_36px_rgba(99,179,237,0.5)] group-hover/card:brightness-[1.03]">
              Open the book →
            </span>
          </div>
        </Link>
        <div className="relative z-[1] mt-auto border-t border-border/40 bg-black/20 px-4 py-3 backdrop-blur-sm">
          <AddToShelfButton layout="carousel" onAddToShelf={addHandler} bookId={book.id} />
        </div>
      </div>
    )
  }

  /* Default & shelf: same footprint as carousel grids — no uneven card heights */
  return (
    <div className="glass-card group relative flex h-full w-full min-h-[460px] flex-col rounded-xl border border-border/80 shadow-card">
      <span className="book-card-accent-line" aria-hidden />
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
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
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
          <div className="mt-1 min-h-[1.25rem] truncate text-sm text-text-muted">{displayAuthor}</div>
          {!isCompact && genre ? (
            <div className="mt-2 min-h-[1.5rem]">
              <span className="book-genre-pill inline-block max-w-full truncate text-xs">{genre}</span>
            </div>
          ) : null}
          <div className="mt-3 flex items-center justify-between gap-2">
            <StarRating value={Math.round(book.averageRating)} interactive={false} size="sm" />
            <div className="shrink-0 text-xs tabular-nums text-text-muted">
              {book.ratingsCount > 0 ? `${book.ratingsCount.toLocaleString()} reviews` : "No reviews yet"}
            </div>
          </div>
          <span className="mt-auto inline-flex min-h-[2.25rem] items-center justify-center rounded-md border border-primary/50 px-3 py-2 text-center text-sm font-medium text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:text-heading group-hover:shadow-primary-glow">
            Open the book →
          </span>
        </div>
      </Link>
      <div className="mt-auto px-4 pb-4">
        <AddToShelfButton onAddToShelf={addHandler} bookId={book.id} />
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
