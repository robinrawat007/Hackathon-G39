"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { BookCoverImage } from "@/components/books/book-cover-image"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

const COVERS = [
  {
    title: "The Three-Body Problem",
    author: "Cixin Liu",
    cover:
      "https://books.google.com/books/content?id=1w8YDAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
  {
    title: "Pachinko",
    author: "Min Jin Lee",
    cover:
      "https://books.google.com/books/content?id=ZngzDQAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    cover:
      "https://books.google.com/books/content?id=JX0vDwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    cover:
      "https://books.google.com/books/content?id=IboQfTg1VnMC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
  {
    title: "And Then There Were None",
    author: "Agatha Christie",
    cover:
      "https://books.google.com/books/content?id=GmWbAwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
] as const

export function BookStack3D() {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -6, reduced ? 0 : 6])

  return (
    <div ref={ref} className="relative mx-auto h-[min(360px,50dvh)] w-full max-w-md sm:h-[400px] md:h-[420px]">
      <motion.div
        style={{ transformStyle: "preserve-3d", rotateY: rotate }}
        className="absolute inset-0 mx-auto max-w-[min(100%,20rem)]"
      >
        {COVERS.map((b, idx) => {
          const z = (COVERS.length - idx) * 16
          const y = idx * 18
          const x = idx * 10
          const rot = reduced ? 0 : (idx % 2 === 0 ? -6 : 6)
          return (
            <motion.div
              key={b.title}
              className={cn("absolute left-1/2 top-6 w-[min(170px,42vw)] -translate-x-1/2 sm:top-10 sm:w-[190px]")}
              style={{
                transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rot}deg)`,
              }}
              animate={reduced ? undefined : { y: [0, -8, 0] }}
              transition={reduced ? undefined : { duration: 3.2, repeat: Infinity, delay: idx * 0.18, ease: "easeInOut" }}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border shadow-hover">
                <BookCoverImage
                  src={b.cover}
                  alt={`${b.title} by ${b.author} book cover`}
                  fill
                  sizes="(max-width: 768px) 42vw, 190px"
                  tier="list"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
