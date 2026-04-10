"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { BOOK_COVER_BLUR_DATA_URL } from "@/lib/image-placeholders"
import { bookCoverNeedsUnoptimized } from "@/lib/book-cover-image"
import { upgradeGoogleBooksCoverUrl, type CoverUrlTier } from "@/lib/book-cover-url"

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
}

/**
 * Book cover: gentle Google zoom bump, load pulse, fade-in, and fallback to raw URL if upgraded link fails.
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
}: BookCoverImageProps) {
  const raw = React.useMemo(() => src.trim().replace(/^http:\/\//i, "https://"), [src])
  const upgraded = React.useMemo(() => upgradeGoogleBooksCoverUrl(raw, tier), [raw, tier])

  const [activeSrc, setActiveSrc] = React.useState(upgraded)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    setActiveSrc(upgradeGoogleBooksCoverUrl(raw, tier))
    setLoaded(false)
  }, [raw, tier])

  const unoptimized = bookCoverNeedsUnoptimized(activeSrc)

  if (!raw) return null

  const loader = (
    <span
      className="pointer-events-none absolute inset-0 z-[1] animate-pulse rounded-[inherit] bg-gradient-to-br from-bg-secondary via-[rgba(99,179,237,0.08)] to-bg-secondary"
      aria-hidden
    />
  )

  const imageClass = cn(
    className,
    "transition-opacity duration-300 ease-out",
    loaded ? "opacity-100" : "opacity-0",
    fill && "z-[2] object-cover"
  )

  const onError = () => {
    if (activeSrc !== raw) {
      setActiveSrc(raw)
      setLoaded(false)
    } else {
      setLoaded(true)
    }
  }

  if (fill) {
    return (
      <>
        {!loaded ? loader : null}
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
          onLoadingComplete={() => setLoaded(true)}
          onError={onError}
        />
      </>
    )
  }

  if (width == null || height == null) return null

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
        onLoadingComplete={() => setLoaded(true)}
        onError={onError}
      />
    </span>
  )
}
