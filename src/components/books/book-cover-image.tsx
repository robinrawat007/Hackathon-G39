"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { BOOK_COVER_BLUR_DATA_URL } from "@/lib/image-placeholders"
import { bookCoverNeedsUnoptimized } from "@/lib/book-cover-image"
import { normalizeBookCoverUrl, type CoverUrlTier } from "@/lib/book-cover-url"

function initialsFromTitle(title: string): string {
  const parts = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
  return parts.length > 0 ? parts.join("") : "BK"
}

type BookCoverImageProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  tier?: CoverUrlTier
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  /** Shown if every image URL fails (broken CDN / 404). */
  fallbackLabel?: string
}

/**
 * Book cover: optional CDN zoom tweak, load pulse, fade-in, and fallback to raw URL if the tuned link fails.
 */
export function BookCoverImage({
  src,
  alt,
  sizes,
  className,
  tier = "list",
  fill,
  width,
  height,
  priority,
  fallbackLabel,
}: BookCoverImageProps) {
  const raw = React.useMemo(() => src.trim().replace(/^http:\/\//i, "https://"), [src])
  const upgraded = React.useMemo(() => normalizeBookCoverUrl(raw, tier), [raw, tier])

  const [activeSrc, setActiveSrc] = React.useState(upgraded)
  const [loaded, setLoaded] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    setActiveSrc(normalizeBookCoverUrl(raw, tier))
    setLoaded(false)
    setFailed(false)
  }, [raw, tier])

  const unoptimized = bookCoverNeedsUnoptimized(activeSrc)

  if (!raw) return null

  const loader = (
    <span
      className="pointer-events-none absolute inset-0 z-[1] animate-pulse rounded-[inherit] bg-gradient-to-br from-bg-secondary via-[rgba(196,149,106,0.08)] to-bg-secondary"
      aria-hidden
    />
  )

  /** Priority hero images: skip fade-in so LCP can paint as soon as the image decodes. */
  const imageClass = cn(
    className,
    priority ? "opacity-100" : cn("transition-opacity duration-300 ease-out", loaded ? "opacity-100" : "opacity-0"),
    fill && "z-[2] object-cover"
  )

  const onError = () => {
    if (/covers\.openlibrary\.org\/b\/isbn\/[^/]+-M\.jpg/i.test(activeSrc)) {
      setActiveSrc(activeSrc.replace(/-M\.jpg/i, "-L.jpg"))
      setLoaded(false)
      return
    }
    if (/covers\.openlibrary\.org\/b\/isbn\/[^/]+-L\.jpg/i.test(activeSrc)) {
      setActiveSrc(activeSrc.replace(/-L\.jpg/i, "-S.jpg"))
      setLoaded(false)
      return
    }
    if (activeSrc !== raw) {
      setActiveSrc(raw)
      setLoaded(false)
    } else if (fallbackLabel) {
      setFailed(true)
    } else {
      setLoaded(true)
    }
  }

  const fallbackBlock = fallbackLabel ? (
    <div
      className={cn(
        "flex items-center justify-center bg-bg-secondary px-0.5 text-center font-sans text-[10px] font-semibold leading-tight tracking-tight text-text-muted",
        fill ? "absolute inset-0 z-[3] rounded-[inherit]" : "relative z-[3] h-full w-full rounded-[inherit]",
        className
      )}
      aria-hidden
    >
      {initialsFromTitle(fallbackLabel)}
    </div>
  ) : null

  if (fill) {
    if (failed && fallbackBlock) return fallbackBlock
    return (
      <>
        {!loaded && !failed && !priority ? loader : null}
        <Image
          key={activeSrc}
          src={activeSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={imageClass}
          priority={priority}
          placeholder="blur"
          blurDataURL={BOOK_COVER_BLUR_DATA_URL}
          unoptimized={unoptimized}
          onLoad={() => setLoaded(true)}
          onError={onError}
        />
      </>
    )
  }

  if (width == null || height == null) return null

  if (failed && fallbackBlock) {
    return (
      <span className="relative inline-block overflow-hidden rounded-[inherit]" style={{ width, height }}>
        {fallbackBlock}
      </span>
    )
  }

  return (
    <span className="relative inline-block" style={{ width, height }}>
      {!loaded ? loader : null}
      <Image
        key={activeSrc}
        src={activeSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(imageClass, "relative z-[2] h-full w-full object-cover")}
        priority={priority}
        placeholder="blur"
        blurDataURL={BOOK_COVER_BLUR_DATA_URL}
        unoptimized={unoptimized}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
    </span>
  )
}
