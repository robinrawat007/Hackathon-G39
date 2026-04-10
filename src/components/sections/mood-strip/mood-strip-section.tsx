"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { MOODS } from "@/lib/constants"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

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
          What Are You in the Mood For?
        </motion.h2>

        <div className="mt-8 hidden flex-wrap justify-center gap-3 md:flex">
          {MOODS.map((m, idx) => (
            <motion.div
              key={m.slug}
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 380, damping: 22, delay: idx * 0.04 }}
              whileHover={reduced ? undefined : { scale: 1.06, y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              <Link
                href={`/browse?mood=${m.slug}`}
                className={`flex items-center justify-center gap-2 rounded-full border border-white/10 bg-gradient-to-r ${m.gradient} px-5 py-3 text-sm font-medium text-heading shadow-card transition-shadow duration-300 hover:shadow-hover hover:ring-2 hover:ring-primary/40`}
              >
                <span aria-hidden="true" className="text-base">
                  {m.emoji}
                </span>
                <span>{m.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 hidden justify-center md:flex">
          <motion.div whileHover={reduced ? undefined : { scale: 1.03 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-6 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary/50 hover:text-primary"
            >
              Give me more moods →
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] snap-x snap-proximity">
            {MOODS.map((m) => (
              <Link
                key={m.slug}
                href={`/browse?mood=${m.slug}`}
                className={`snap-start shrink-0 flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r ${m.gradient} px-4 py-3 text-sm font-medium text-heading shadow-card active:scale-[0.98]`}
              >
                <span aria-hidden="true">{m.emoji}</span>
                <span>{m.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/browse" className="text-sm font-medium text-primary hover:underline">
              Give me more moods →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

