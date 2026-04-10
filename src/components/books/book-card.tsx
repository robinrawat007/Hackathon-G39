"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import type { Book, BookCardProps, ShelfStatus } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StarRating } from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { BOOK_COVER_BLUR_DATA_URL } from "@/lib/image-placeholders"
import { bookCoverNeedsUnoptimized } from "@/lib/book-cover-image"
import { useShelfStore } from "@/lib/stores/shelf-store"

const COVER_SIZES = {
  default: "180px",
  compact: "120px",
  featured: "200px",
  shelf: "180px",
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
      <span className="font-mono text-sm">{initials || "BK"}</span>
    </div>
  )
}

function AddToShelfButton({ onAddToShelf, bookId }: { onAddToShelf?: (bookId: string, status: ShelfStatus) => void; bookId: string }) {
  if (!onAddToShelf) return null
  return (
    <div className="mt-3 flex gap-2">
      <Button variant="secondary" size="sm" className={shelfCtaClass} onClick={() => onAddToShelf(bookId, "want_to_read")}>
        Want to Read
      </Button>
      <Button variant="secondary" size="sm" className={shelfCtaClass} onClick={() => onAddToShelf(bookId, "reading")}>
        Reading
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
      <div className="glass-card rounded-lg p-4">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <Skeleton className="mt-4 h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    )
  }

  const isCompact = variant === "compact"
  const genre = book.genres[0]

  return (
    <div className="glass-card group relative rounded-lg">
      <span className="book-card-accent-line" aria-hidden />
      <Link href={`/book/${book.slug}`} className="block p-4">
        <div className="relative [perspective:800px]">
          <motion.div
            className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border shadow-lg"
            style={{ transformStyle: "preserve-3d" }}
            whileHover={reduced ? undefined : { scale: 1.06, rotateY: 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`${book.title} by ${book.author} book cover`}
                fill
                sizes={COVER_SIZES[variant]}
                className="object-cover"
                placeholder="blur"
                blurDataURL={BOOK_COVER_BLUR_DATA_URL}
                unoptimized={bookCoverNeedsUnoptimized(book.coverUrl)}
              />
            ) : (
              <FallbackCover title={book.title} />
            )}
          </motion.div>
        </div>
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className={cn("font-heading font-semibold text-heading", isCompact ? "text-sm" : "text-base")}>
                {book.title}
              </div>
              <div className="mt-1 text-sm text-text-muted">{book.author}</div>
            </div>
            {genre ? <span className="book-genre-pill max-w-[40%] truncate">{genre}</span> : null}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <StarRating value={Math.round(book.averageRating)} interactive={false} size="sm" />
            <div className="text-sm text-text-muted">{book.ratingsCount.toLocaleString()} reviews</div>
          </div>

          <span className="mt-4 inline-flex min-h-[2.25rem] items-center rounded-md border border-primary/50 px-3 py-2 text-sm font-medium text-primary transition-colors duration-200 group-hover:border-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:text-heading group-hover:shadow-primary-glow">
            View book →
          </span>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToShelfButton onAddToShelf={addHandler} bookId={book.id} />
      </div>
    </div>
  )
}

export function BookCardMini({ book }: { book: Book }) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="flex items-center gap-3 rounded-lg border border-border/80 bg-surface/50 p-3 shadow-card backdrop-blur-sm transition-all duration-200 hover:border-border-glow hover:shadow-hover"
    >
      <div className="relative h-14 w-10 overflow-hidden rounded-md border border-border">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`${book.title} by ${book.author} book cover`}
            fill
            sizes="40px"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BOOK_COVER_BLUR_DATA_URL}
            unoptimized={bookCoverNeedsUnoptimized(book.coverUrl)}
          />
        ) : (
          <FallbackCover title={book.title} />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-heading">{book.title}</div>
        <div className="truncate text-xs text-text-muted">{book.author}</div>
      </div>
    </Link>
  )
}
