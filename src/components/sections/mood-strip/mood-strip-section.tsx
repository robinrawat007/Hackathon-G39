"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { MOODS } from "@/lib/constants"
import { MoodChipLink, moodChipsGridClass } from "@/components/mood/mood-chips"
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

        <div className={cn(moodChipsGridClass, "mt-6 sm:mt-7")}>
          {MOODS.map((m, idx) => (
            <motion.div
              key={m.slug}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.32, delay: idx * 0.03 }}
            >
              <MoodChipLink mood={m} href={`/browse?mood=${m.slug}`} />
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
