"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { BookCoverImage } from "@/components/books/book-cover-image"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

const HERO_STACK_COVERS = [
  { title: "The Goldfinch", author: "Donna Tartt", cover: "https://covers.openlibrary.org/b/isbn/9780316055437-L.jpg" },
  { title: "A Little Life", author: "Hanya Yanagihara", cover: "https://covers.openlibrary.org/b/isbn/9780385539258-M.jpg" },
  { title: "Normal People", author: "Sally Rooney", cover: "https://covers.openlibrary.org/b/isbn/9781984822178-M.jpg" },
  { title: "The Overstory", author: "Richard Powers", cover: "https://covers.openlibrary.org/b/isbn/9780393356687-M.jpg" },
  { title: "White Teeth", author: "Zadie Smith", cover: "https://covers.openlibrary.org/b/isbn/9780375703867-M.jpg" },
]

/** Fan layout: center book on top; outer titles stay visible at the sides */
const FAN_LAYOUT = [
  { x: -52, y: 20, rz: -11, tz: 4, sc: 0.82, zIndex: 5 },
  { x: -26, y: 10, rz: -5, tz: 12, sc: 0.9, zIndex: 15 },
  { x: 0, y: 0, rz: 0, tz: 28, sc: 1, zIndex: 40 },
  { x: 26, y: 10, rz: 5, tz: 12, sc: 0.9, zIndex: 15 },
  { x: 52, y: 20, rz: 11, tz: 4, sc: 0.82, zIndex: 5 },
] as const

export function BookStack3D() {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rotate = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -5, reduced ? 0 : 5])

  return (
    <div
      ref={ref}
      className="relative mx-auto flex min-h-[min(380px,52dvh)] w-full max-w-xl items-center justify-center sm:min-h-[420px] md:min-h-[440px]"
    >
      <motion.div
        style={{ transformStyle: "preserve-3d", rotateY: rotate }}
        className="relative mx-auto h-[min(340px,48dvh)] w-full max-w-[22rem] sm:h-[380px]"
      >
        {HERO_STACK_COVERS.map((b, idx) => {
          const f = FAN_LAYOUT[idx] ?? FAN_LAYOUT[2]
          const rotY = reduced ? 0 : idx % 2 === 0 ? -4 : 4
          return (
            <div
              key={b.title}
              className={cn(
                "absolute left-1/2 top-1/2 w-[min(158px,38vw)] -translate-x-1/2 -translate-y-1/2 sm:w-[172px]",
                !reduced && "hero-stack-cover-glow"
              )}
              style={{
                zIndex: f.zIndex,
                transform: `translate3d(${f.x}px, ${f.y}px, ${f.tz}px) rotateZ(${reduced ? 0 : f.rz}deg) rotateY(${rotY}deg) scale(${f.sc})`,
              }}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border shadow-hover">
                <BookCoverImage
                  src={b.cover}
                  alt={`${b.title} by ${b.author} book cover`}
                  fill
                  sizes="(max-width: 768px) 42vw, 190px"
                  tier="list"
                  className="object-cover"
                  priority={idx === 2}
                />
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
