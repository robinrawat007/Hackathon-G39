"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { MOODS, GOALS } from "@/lib/constants"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/onboarding.schema"

type Step = 1 | 2 | 3

const POPULAR_BOOKS = [
  { id: "dune", title: "Dune" },
  { id: "the-hobbit", title: "The Hobbit" },
  { id: "gone-girl", title: "Gone Girl" },
  { id: "pride-prejudice", title: "Pride and Prejudice" },
  { id: "the-alchemist", title: "The Alchemist" },
  { id: "atomic-habits", title: "Atomic Habits" },
  { id: "the-book-thief", title: "The Book Thief" },
  { id: "sapiens", title: "Sapiens" },
  { id: "the-martian", title: "The Martian" },
  { id: "the-night-circus", title: "The Night Circus" },
  { id: "educated", title: "Educated" },
  { id: "the-road", title: "The Road" },
] as const

const RATER_OPTIONS = [
  { key: "love", label: "Love it" },
  { key: "liked", label: "Liked" },
  { key: "meh", label: "Meh" },
  { key: "unread", label: "Haven’t read" },
] as const

export function OnboardingWizard() {
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = React.useState<Step>(1)

  const [ratedBooks, setRatedBooks] = React.useState<Array<{ bookId: string; rating: "love" | "liked" | "meh" | "unread" }>>(
    POPULAR_BOOKS.map((b) => ({ bookId: b.id, rating: "unread" }))
  )
  const [moods, setMoods] = React.useState<string[]>([])
  const [goals, setGoals] = React.useState<string[]>([])
  const [readingGoal, setReadingGoal] = React.useState<number>(12)
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  const progress = step / 3

  const setBookRating = (bookId: string, rating: "love" | "liked" | "meh" | "unread") => {
    setRatedBooks((prev) => prev.map((b) => (b.bookId === bookId ? { ...b, rating } : b)))
  }

  const toggleMood = (slug: string) => {
    setMoods((prev) => (prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]))
  }

  const toggleGoal = (slug: string) => {
    setGoals((prev) => (prev.includes(slug) ? prev.filter((g) => g !== slug) : [...prev, slug]))
  }

  const next = () => {
    setError(null)
    if (step === 1) setStep(2)
    else if (step === 2) {
      const parsed = onboardingSchema.pick({ moods: true }).safeParse({ moods })
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Pick at least 2 moods.")
        return
      }
      setStep(3)
    }
  }

  const back = () => {
    setError(null)
    if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    const payload: OnboardingInput = {
      ratedBooks,
      moods,
      goals,
      readingGoal,
    }
    const parsed = onboardingSchema.safeParse(payload)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please complete the form.")
      setSaving(false)
      return
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) throw new Error("Failed to save onboarding")
      window.location.href = "/dashboard"
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save onboarding")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-bg-secondary/90 via-surface/80 to-accent/5 p-8 shadow-card backdrop-blur-md md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(99,179,237,0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(159,122,234,0.12), transparent)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-primary">Step {step} of 3</div>
            <h1 className="font-heading text-h2 text-gradient-hero">Train your taste</h1>
            <p className="mt-1 max-w-xl text-sm text-text-muted">So AI picks feel personal — not generic bestseller bingo.</p>
          </div>
          <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-bg-secondary sm:w-40">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(99,179,237,0.45)]"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 26 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={reduced ? false : { opacity: 0, x: 36, filter: "blur(4px)" }}
              animate={reduced ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, x: -28, filter: "blur(4px)" }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 }}
              className="mt-8"
            >
              <div className="font-heading text-h3 text-heading">What you’ve actually read</div>
              <div className="mt-2 text-sm text-text-muted">Honest taps only — we use this to calibrate the AI. Change anytime.</div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR_BOOKS.map((b) => {
                  const current = ratedBooks.find((r) => r.bookId === b.id)?.rating ?? "unread"
                  return (
                    <motion.div
                      key={b.id}
                      className="rounded-xl border border-border/80 bg-bg-secondary/90 p-4 shadow-card transition-shadow duration-300 hover:border-primary/30 hover:shadow-hover"
                    >
                      <div className="text-sm font-medium text-heading">{b.title}</div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {RATER_OPTIONS.map((o) => (
                          <button
                            key={o.key}
                            type="button"
                            onClick={() => setBookRating(b.id, o.key)}
                            className={`rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                              current === o.key
                                ? "border-primary bg-primary text-heading shadow-[0_0_12px_rgba(99,179,237,0.25)]"
                                : "border-border/80 bg-surface text-text hover:border-primary/40"
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div
              key="step-2"
              initial={reduced ? false : { opacity: 0, x: 36, filter: "blur(4px)" }}
              animate={reduced ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, x: -28, filter: "blur(4px)" }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 }}
              className="mt-8"
            >
              <div className="font-heading text-h3 text-heading">Your usual vibes</div>
              <div className="mt-2 text-sm text-text-muted">Pick at least two — we’ll match energy, not just genre labels.</div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {MOODS.map((m) => {
                  const active = moods.includes(m.slug)
                  return (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => toggleMood(m.slug)}
                      className={`rounded-xl border px-4 py-4 text-left transition-shadow ${
                        active
                          ? "border-primary bg-primary text-heading shadow-[0_0_20px_rgba(99,179,237,0.2)]"
                          : "border-border/80 bg-bg-secondary/80 text-text hover:border-primary/30"
                      }`}
                    >
                      <div className="text-lg" aria-hidden="true">
                        {m.emoji}
                      </div>
                      <div className="mt-2 text-sm font-medium">{m.label}</div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div
              key="step-3"
              initial={reduced ? false : { opacity: 0, x: 36, filter: "blur(4px)" }}
              animate={reduced ? undefined : { opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, x: -28, filter: "blur(4px)" }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 30 }}
              className="mt-8"
            >
              <div className="font-heading text-h3 text-heading">2026 energy</div>
              <div className="mt-2 text-sm text-text-muted">What do you want more of? We’ll nudge picks that way.</div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {GOALS.map((g) => {
                  const active = goals.includes(g.slug)
                  return (
                    <button
                      key={g.slug}
                      type="button"
                      onClick={() => toggleGoal(g.slug)}
                      className={`rounded-xl border px-4 py-4 text-left transition-shadow ${
                        active
                          ? "border-primary bg-primary text-heading shadow-[0_0_20px_rgba(99,179,237,0.2)]"
                          : "border-border/80 bg-bg-secondary/80 text-text hover:border-primary/30"
                      }`}
                    >
                      <div className="text-sm font-medium">{g.label}</div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8">
                <div className="text-sm font-medium text-heading">Reading goal</div>
                <div className="mt-2 text-sm text-text-muted">{readingGoal} books this year</div>
                <input
                  type="range"
                  min={1}
                  max={52}
                  step={1}
                  value={readingGoal}
                  onChange={(e) => setReadingGoal(Number(e.target.value))}
                  className="mt-3 w-full"
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {error ? <div className="mt-6 text-sm text-error">{error}</div> : null}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" size="md" onClick={back} disabled={step === 1}>
            Back
          </Button>

          {step < 3 ? (
            <Button variant="primary" size="md" onClick={next}>
              Next →
            </Button>
          ) : (
            <Button variant="primary" size="md" loading={saving} onClick={() => void save()}>
              Build My Shelf →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

