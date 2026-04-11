"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { MoodChipToggle, moodChipsGridClass } from "@/components/mood/mood-chips"
import { ApiRequestError, fetchJson } from "@/lib/api/client-fetch"
import { BookCoverImage } from "@/components/books/book-cover-image"
import { Button } from "@/components/ui/button"
import { MOODS, GOALS } from "@/lib/constants"
import { useAuthDialog } from "@/components/auth/auth-dialog-context"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { ONBOARDING_POPULAR_BOOKS } from "@/lib/onboarding-popular-books"
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/onboarding.schema"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3

const RATER_OPTIONS = [
  { key: "love", label: "Love it" },
  { key: "liked", label: "Liked" },
  { key: "meh", label: "Meh" },
  { key: "unread", label: "Haven’t read" },
] as const

export function OnboardingWizard() {
  const { openSignIn } = useAuthDialog()
  const { user, isLoading: authLoading } = useAuthUser()
  const authPromptedRef = React.useRef(false)
  const reduced = usePrefersReducedMotion()
  const [step, setStep] = React.useState<Step>(1)

  const [ratedBooks, setRatedBooks] = React.useState<Array<{ bookId: string; rating: "love" | "liked" | "meh" | "unread" }>>(
    ONBOARDING_POPULAR_BOOKS.map((b) => ({ bookId: b.id, rating: "unread" }))
  )
  const [moods, setMoods] = React.useState<string[]>([])
  const [goals, setGoals] = React.useState<string[]>([])
  const [readingGoal, setReadingGoal] = React.useState<number>(12)
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (authLoading) return
    if (!user) {
      if (!authPromptedRef.current) {
        authPromptedRef.current = true
        openSignIn({ redirectTo: "/onboarding" })
      }
    } else {
      authPromptedRef.current = false
    }
  }, [authLoading, user, openSignIn])

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
      await fetchJson("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(parsed.data),
      })
      window.location.href = "/dashboard"
    } catch (e) {
      if (e instanceof ApiRequestError) {
        const body = e.body as { error?: string; issues?: { message?: string }[] } | undefined
        const firstIssue = body?.issues?.[0]?.message
        const msg =
          body?.error ??
          firstIssue ??
          (e.status === 401
            ? "You need to be signed in. Try signing in again."
            : e.status === 503
              ? "Server misconfiguration: add SUPABASE_SERVICE_ROLE_KEY to your environment and redeploy."
              : e.message)
        setError(msg)
      } else {
        setError(e instanceof Error ? e.message : "Failed to save onboarding")
      }
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-border/80 bg-surface/50 p-10 text-center shadow-card">
          <p className="text-sm text-text-muted">{authLoading ? "Loading…" : "Redirecting to sign in…"}</p>
        </div>
      </div>
    )
  }

  const stepLabels = ["Books", "Vibes", "Goals"] as const

  return (
    <div className="mx-auto max-w-5xl px-1 sm:px-0">
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-[#fdf9f3] via-bg-secondary/95 to-[#f3ebe0] p-6 shadow-[0_8px_40px_rgba(139,90,43,0.1),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 15% 0%, rgba(196,149,106,0.2), transparent 50%), radial-gradient(ellipse 65% 45% at 95% 100%, rgba(139,90,43,0.12), transparent 55%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='1.2' fill='%238B5E3C' fill-opacity='0.11'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
          aria-hidden
        />

        <div className="relative mb-6 flex flex-wrap gap-2">
          {([1, 2, 3] as const).map((s) => {
            const active = step === s
            const done = step > s
            return (
              <span
                key={s}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors",
                  active
                    ? "border-primary bg-primary text-white shadow-[0_0_16px_rgba(139,90,43,0.25)]"
                    : done
                      ? "border-primary/35 bg-primary/10 text-primary"
                      : "border-border/70 bg-bg-secondary/80 text-text-muted"
                )}
              >
                <span className="tabular-nums">{s}</span>
                {stepLabels[s - 1]}
              </span>
            )
          })}
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/90">Train your taste</div>
            <h1 className="mt-1 font-heading text-h2 text-gradient-hero">Calibrate your shelf</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
              Three quick steps — honest taps, your moods, and what you want next. Recommendations get sharper as you go.
            </p>
          </div>
          <div className="h-2.5 w-full max-w-[220px] overflow-hidden rounded-full border border-border/40 bg-bg-secondary/90 shadow-inner sm:w-44">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-[#d4845a] shadow-[0_0_14px_rgba(139,90,43,0.35)]"
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

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {ONBOARDING_POPULAR_BOOKS.map((b) => {
                  const current = ratedBooks.find((r) => r.bookId === b.id)?.rating ?? "unread"
                  return (
                    <motion.div
                      key={b.id}
                      className="rounded-xl border border-border/80 bg-gradient-to-b from-bg-secondary/95 to-surface/85 p-3 shadow-card transition-shadow duration-300 hover:border-primary/35 hover:shadow-hover sm:p-4"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-[7.25rem] w-[4.75rem] shrink-0 overflow-hidden rounded-lg border border-border/60 bg-bg shadow-inner sm:h-[8.5rem] sm:w-[5.35rem]">
                          <BookCoverImage
                            src={b.coverUrl}
                            alt=""
                            fill
                            sizes="(max-width:640px) 76px, 86px"
                            tier="list"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="text-sm font-semibold leading-snug text-heading line-clamp-2">{b.title}</div>
                          <div className="mt-1 text-xs text-text-muted line-clamp-2">{b.author}</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {RATER_OPTIONS.map((o) => (
                          <button
                            key={o.key}
                            type="button"
                            onClick={() => setBookRating(b.id, o.key)}
                            className={`rounded-lg border px-2 py-2 text-xs transition-all duration-200 sm:px-3 sm:text-sm ${
                              current === o.key
                                ? "border-primary bg-primary text-white shadow-[0_0_12px_rgba(139,90,43,0.28)]"
                                : "border-border/80 bg-surface/90 text-text hover:border-primary/40"
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

              <div className={cn(moodChipsGridClass, "mt-6")}>
                {MOODS.map((m) => {
                  const active = moods.includes(m.slug)
                  return (
                    <MoodChipToggle
                      key={m.slug}
                      mood={m}
                      active={active}
                      onClick={() => toggleMood(m.slug)}
                    />
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
                          ? "border-primary bg-primary text-white shadow-[0_0_14px_rgba(139,90,43,0.22)]"
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

