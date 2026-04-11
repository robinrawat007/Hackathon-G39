"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { MOODS } from "@/lib/constants"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

export function MoodStripSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="border-t border-border/50 bg-bg-secondary/80 py-10 md:py-14">
      <div className="container max-w-5xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center sm:text-left"
        >
          <h2 className="font-heading text-h2 text-heading">What’s the vibe tonight?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-text-muted sm:mx-0">
            Tap a mood — we’ll line up reads that match the energy.
          </p>
        </motion.div>

        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4 sm:gap-2.5">
          {MOODS.map((m, idx) => (
            <motion.div
              key={m.slug}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.32, delay: idx * 0.03 }}
            >
              <Link
                href={`/browse?mood=${m.slug}`}
                className={cn(
                  "group relative flex min-h-[3.25rem] w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full px-2.5 py-2 sm:min-h-[3rem] sm:flex-row sm:gap-2 sm:px-3.5 sm:py-2.5",
                  "border border-border/60 bg-surface/90 text-center shadow-sm",
                  "transition-[border-color,box-shadow,transform] duration-200",
                  "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_8px_24px_rgba(139,90,43,0.1)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
                  "active:scale-[0.98]"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-[0.14]",
                    m.gradient
                  )}
                  aria-hidden
                />
                <span aria-hidden="true" className="relative shrink-0 text-[1.05rem] leading-none sm:text-lg">
                  {m.emoji}
                </span>
                <span className="relative max-w-[9.5rem] text-[11px] font-semibold leading-tight tracking-tight text-heading sm:max-w-none sm:text-left sm:text-xs">
                  {m.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-5 flex justify-center sm:mt-6"
        >
          <Link
            href="/browse"
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline"
          >
            Browse all filters →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
