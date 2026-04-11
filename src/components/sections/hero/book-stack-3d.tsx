"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { BookCoverImage } from "@/components/books/book-cover-image"
import { cn } from "@/lib/utils"

const HERO_STACK_COVERS = [
  { title: "The Goldfinch", author: "Donna Tartt", cover: "https://covers.openlibrary.org/b/isbn/9780316055448-M.jpg" },
  { title: "A Little Life", author: "Hanya Yanagihara", cover: "https://covers.openlibrary.org/b/isbn/9780385539258-M.jpg" },
  { title: "Normal People", author: "Sally Rooney", cover: "https://covers.openlibrary.org/b/isbn/9781984822178-M.jpg" },
  { title: "The Overstory", author: "Richard Powers", cover: "https://covers.openlibrary.org/b/isbn/9780393356687-M.jpg" },
  { title: "White Teeth", author: "Zadie Smith", cover: "https://covers.openlibrary.org/b/isbn/9780375703867-M.jpg" },
]
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

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
        {HERO_STACK_COVERS.map((b, idx) => {
          const z = (HERO_STACK_COVERS.length - idx) * 16
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
