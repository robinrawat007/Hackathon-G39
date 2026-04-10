"use client"

import { motion } from "framer-motion"

import { ReviewCard } from "@/components/community/review-card"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

const REVIEWS = [
  {
    id: "r1",
    userId: "u1",
    userName: "Maya L.",
    avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s64",
    bookTitle: "Tomorrow, and Tomorrow, and Tomorrow",
    bookSlug: "tomorrow-and-tomorrow-and-tomorrow-gabrielle-zevin",
    rating: 5,
    body: "ShelfAI suggested this after I said I wanted character-driven stories with messy friendships. I finished it in three days and immediately texted my book club.",
    createdAt: "2026-04-08T00:00:00.000Z",
  },
  {
    id: "r2",
    userId: "u2",
    userName: "Jordan K.",
    avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s64",
    bookTitle: "The Ocean at the End of the Lane",
    bookSlug: "the-ocean-at-the-end-of-the-lane-neil-gaiman",
    rating: 4,
    body: "I asked for something eerie but not gruesome, short enough for a weekend. The vibe was exactly right—nostalgic, unsettling, and oddly comforting.",
    createdAt: "2026-04-05T00:00:00.000Z",
  },
  {
    id: "r3",
    userId: "u3",
    userName: "Priya S.",
    avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s64",
    bookTitle: "Project Hail Mary",
    bookSlug: "project-hail-mary-andy-weir",
    rating: 5,
    body: "I told ShelfAI I loved hard sci-fi but wanted more heart. It nailed the balance—big ideas, humor, and a friendship I didn’t expect to care about that much.",
    createdAt: "2026-04-03T00:00:00.000Z",
  },
] as const

export function CommunityProofSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 32 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-heading text-h2 text-heading"
        >
          Readers who actually finished the rec
        </motion.h2>
        <p className="mt-2 max-w-xl text-sm text-text-muted">Real reactions — no fake five-stars, no filler blurbs.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {REVIEWS.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 320, damping: 28, delay: idx * 0.06 }}
              whileHover={reduced ? undefined : { y: -3, transition: { duration: 0.2 } }}
              className="flex h-full min-h-[300px]"
            >
              <ReviewCard review={r} className="w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
