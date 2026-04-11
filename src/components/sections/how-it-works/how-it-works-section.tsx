"use client"

import { BookOpen, Sparkles, LibraryBig } from "lucide-react"
import { motion } from "framer-motion"

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

const STEPS = [
  {
    icon: BookOpen,
    step: "Step 1",
    title: "Spill the tea to ShelfAI",
    desc: "Drop a vibe, a comp title, or a “I only have Saturday” — it speaks fluent bookworm.",
  },
  {
    icon: Sparkles,
    step: "Step 2",
    title: "Get AI-matched picks",
    desc: "Your knowledge base meets your taste — grounded picks, no invented titles.",
  },
  {
    icon: LibraryBig,
    step: "Step 3",
    title: "Own your shelf",
    desc: "Stack it, rate it, flex it. Your reading life, organized like you mean it.",
  },
] as const

export function HowItWorksSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="how-it-works" className="relative pb-16 pt-6 md:pb-24 md:pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
      <div className="container min-w-0">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-heading text-h2 text-heading"
        >
          Three moves. Better reads.
        </motion.h2>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-3 max-w-2xl text-sm text-text-muted"
        >
          Fast, sharp, zero homework — just the path from “what now?” to “that’s the one.”
        </motion.p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                whileHover={reduced ? undefined : { y: -6, transition: { duration: 0.25 } }}
                className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/80 p-6 shadow-card backdrop-blur-md transition-shadow duration-300 hover:border-primary/35 hover:shadow-hover"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-hover:bg-accent/15" aria-hidden />
                <div className="relative flex items-center justify-between">
                  <div className="rounded-full border border-border bg-bg-secondary/80 px-3 py-0.5 text-xs font-medium text-primary">{s.step}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/50">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <div className="relative mt-4 font-heading text-h3 text-heading">{s.title}</div>
                <p className="relative mt-2 text-sm leading-relaxed text-text-muted">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

