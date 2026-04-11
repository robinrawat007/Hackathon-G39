"use client"

import Link from "next/link"
import { BookOpen, Sparkles, Users, Heart, Zap, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

const VALUES = [
  {
    icon: Sparkles,
    title: "AI that actually reads",
    desc: "Our recommendation engine is grounded in a curated knowledge base — no hallucinated titles, no filler picks. Every suggestion is traceable to something real.",
  },
  {
    icon: Heart,
    title: "Built around taste, not algorithms",
    desc: "We don't chase engagement metrics. We chase the feeling of finishing a book and immediately wanting to tell someone about it.",
  },
  {
    icon: Users,
    title: "Community first",
    desc: "Shelves are better shared. Reviews, lists, and reading threads connect you with people whose taste overlaps with yours — not just the most popular titles.",
  },
  {
    icon: ShieldCheck,
    title: "No noise, no bloat",
    desc: "We ship sharp, focused tools. No ads, no dark patterns. Just a clean space to track what you've read and find what's next.",
  },
  {
    icon: Zap,
    title: "Fast and honest",
    desc: "Recommendations in seconds. Straight answers about why we suggested something. If a book isn't for you, say so and we'll recalibrate.",
  },
  {
    icon: BookOpen,
    title: "Every genre, every reader",
    desc: "Literary fiction, hard sci-fi, cozy mystery, translated poetry — we don't rank genres. We meet readers where they are.",
  },
]

const TEAM = [
  {
    name: "The BooksyAI Team",
    role: "Design, Product & Community",
    bio: "A small group of avid readers who believe the best technology should feel invisible — and the best books should feel inevitable.",
    initials: "SA",
    gradientFrom: "from-accent/30",
    gradientTo: "to-primary/20",
  },
]

const STATS = [
  { value: "165", label: "Books in our knowledge base" },
  { value: "14", label: "Genres & moods mapped" },
  { value: "< 2s", label: "Average recommendation time" },
  { value: "100%", label: "Real titles, zero hallucinations" },
]

export default function AboutPage() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex min-h-full flex-col bg-transparent text-text">
      <Navbar />
      <main id="main" className="min-w-0 flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(196,149,106,0.18), transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(139,90,43,0.1), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
          <div className="container relative max-w-3xl">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                About BooksyAI
              </div>
              <h1 className="font-heading text-h1 text-heading leading-tight">
                We built the assistant<br className="hidden sm:block" /> every reader deserved.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-text-muted leading-relaxed">
                BooksyAI started with a simple frustration: book recommendations everywhere, but none of them quite right.
                Too generic, too algorithm-driven, too detached from the way real readers actually describe what they want.
                So we built something different — a reading companion that listens, learns your taste, and tells you what to read next with genuine confidence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border/60 bg-surface/40 backdrop-blur-md py-10">
          <div className="container">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className="text-center"
                >
                  <div className="font-heading text-h2 text-gradient-hero">{s.value}</div>
                  <div className="mt-1 text-xs text-text-muted">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="relative py-16 md:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden />
          <div className="container max-w-3xl">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="font-heading text-h2 text-heading">Our mission</h2>
              <div className="mt-6 space-y-4 text-sm text-text-muted leading-relaxed">
                <p>
                  Reading is one of the few activities that is entirely personal — and yet most discovery tools treat it like
                  a popularity contest. Bestseller lists surface the same fifty titles. Algorithmic feeds optimize for
                  clicks, not for the person who stayed up until 2 AM because a book wouldn't let them go.
                </p>
                <p>
                  We think the best recommendation engine is one that understands context: your mood, your history, how much
                  time you have, what you loved, and — just as importantly — what you never want to read again. BooksyAI is
                  built on that premise. Every conversation, every shelf update, every rating sharpens the picture.
                </p>
                <p>
                  We are not trying to replace the joy of browsing a bookshop or talking to a friend who always knows what
                  you need. We are trying to give you that friend, available at midnight, with a very good memory and no
                  judgment about your reading speed.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values grid */}
        <section className="relative py-16 md:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden />
          <div className="container">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="font-heading text-h2 text-heading">What we stand for</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">
                Six principles that shape every feature we ship and every pick we make.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((v, idx) => {
                const Icon = v.icon
                return (
                  <motion.div
                    key={v.title}
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.07 }}
                    whileHover={reduced ? undefined : { y: -5, transition: { duration: 0.22 } }}
                    className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/80 p-6 shadow-card backdrop-blur-md transition-shadow duration-300 hover:border-primary/35 hover:shadow-hover"
                  >
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-hover:bg-accent/15" aria-hidden />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/50">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="relative mt-4 font-heading text-h3 text-heading">{v.title}</div>
                    <p className="relative mt-2 text-sm leading-relaxed text-text-muted">{v.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="relative py-16 md:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden />
          <div className="container">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="font-heading text-h2 text-heading">The people behind it</h2>
              <p className="mt-3 max-w-xl text-sm text-text-muted">
                Small team, strong opinions about books.
              </p>
            </motion.div>

            <div className="mt-10 grid max-w-xl gap-6">
              {TEAM.map((person, idx) => (
                <motion.div
                  key={person.name}
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface/80 p-6 shadow-card backdrop-blur-md transition-shadow duration-300 hover:border-primary/35 hover:shadow-hover"
                >
                  <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${person.gradientFrom} ${person.gradientTo} blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100`} aria-hidden />
                  <div className="relative flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${person.gradientFrom} ${person.gradientTo} border border-primary/20 font-heading text-sm font-semibold text-heading`}>
                      {person.initials}
                    </div>
                    <div>
                      <div className="font-heading text-base font-semibold text-heading">{person.name}</div>
                      <div className="text-xs text-primary">{person.role}</div>
                    </div>
                  </div>
                  <p className="relative mt-4 text-sm leading-relaxed text-text-muted">{person.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/25 via-accent/20 to-primary/20 p-10 shadow-glow backdrop-blur-md md:p-12"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(196,149,106,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(139,90,43,0.2), transparent 50%)",
                }}
                aria-hidden
              />
              <div className="relative">
                <div className="font-heading text-h2 text-heading drop-shadow-sm">Ready to find your next obsession?</div>
                <p className="mt-2 max-w-lg text-sm text-text-muted">
                  Tell BooksyAI what you're in the mood for — a vibe, a comp title, a feeling — and get a pick that actually fits.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/browse">
                    <Button variant="primary" size="lg">
                      Browse the shelf
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
