"use client"

import Image from "next/image"
import Link from "next/link"

import { APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

/** Horizontal lockup (book + “BooksyAI”) — `public/brand/booksyai-logo.png` */
const LOGO_SRC = "/brand/booksyai-logo.png"
const NATURAL_W = 1024
const NATURAL_H = 571

type BrandLogoProps = {
  className?: string
  /** Wrap in home link (default true for header/footer). */
  href?: string | null
  variant?: "header" | "footer" | "chat"
  /** LCP: set on the primary navbar logo. */
  priority?: boolean
}

const variantClass: Record<NonNullable<BrandLogoProps["variant"]>, string> = {
  /** Wide lockup (~3.9:1) — allow more horizontal space than taller variants. */
  header:
    "h-10 w-auto max-h-10 min-h-0 sm:h-11 sm:max-h-11 shrink-0 max-w-[min(380px,92vw)] md:max-w-[min(420px,42vw)]",
  footer: "h-11 w-auto max-h-11 sm:h-12 sm:max-h-12 max-w-[min(400px,92vw)]",
  chat: "h-7 w-auto max-h-7 sm:h-8 sm:max-h-8 max-w-[min(260px,78vw)]",
}

export function BrandLogo({ className, href = "/", variant = "header", priority = false }: BrandLogoProps) {
  const img = (
    <Image
      src={LOGO_SRC}
      alt={APP_NAME}
      width={NATURAL_W}
      height={NATURAL_H}
      priority={priority}
      sizes={
        variant === "chat"
          ? "(max-width: 640px) 240px, 260px"
          : variant === "footer"
            ? "(max-width: 640px) 360px, 400px"
            : "(max-width: 768px) 340px, 420px"
      }
      className={cn("object-contain object-left", variantClass[variant], className)}
    />
  )

  if (href === null) {
    return <span className="inline-flex items-center">{img}</span>
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {img}
    </Link>
  )
}
