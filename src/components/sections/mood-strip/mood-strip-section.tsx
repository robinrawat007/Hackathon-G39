"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { MOODS } from "@/lib/constants"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

const moodPillClass =
  "flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-xl border border-border/70 bg-bg-secondary/80 px-2 py-3 text-center text-xs font-medium text-heading shadow-card backdrop-blur-sm transition-all duration-200 hover:border-primary/45 hover:bg-surface hover:shadow-[0_0_20px_rgba(99,179,237,0.12)] active:scale-[0.99] sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"

export function MoodStripSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="py-16 md:py-24 bg-bg-secondary">
      <div className="container">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-heading text-h2 text-heading"
        >
          What’s the vibe tonight?
        </motion.h2>
        <p className="mt-3 max-w-2xl text-sm text-text-muted">Tap a mood — we’ll line up reads that match the energy.</p>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {MOODS.map((m, idx) => (
            <motion.div
              key={m.slug}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <Link href={`/browse?mood=${m.slug}`} className={cn(moodPillClass)}>
                <span aria-hidden="true" className="text-lg leading-none">
                  {m.emoji}
                </span>
                <span className="leading-tight">{m.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/browse"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            Browse all filters →
          </Link>
        </div>
      </div>
    </section>
  )
}
