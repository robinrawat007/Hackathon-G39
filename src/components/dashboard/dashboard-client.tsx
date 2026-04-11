"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, CheckCircle, Clock, Sparkles } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import type { Book } from "@/types/book"
import { BookCard } from "@/components/books/book-card"
import { BookCarousel } from "@/components/books/book-carousel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useShelfStore } from "@/lib/stores/shelf-store"
import { useFiltersStore } from "@/lib/stores/filters-store"
import { MoodChipToggle, moodChipsGridClass } from "@/components/mood/mood-chips"
import { MOODS } from "@/lib/constants"
import { fetchJson } from "@/lib/api/client-fetch"
import { apiUrl } from "@/lib/api-url"
import { cn } from "@/lib/utils"

async function fetchRecommendations(): Promise<Book[]> {
  try {
    const json = await fetchJson<{ items?: Book[] }>(apiUrl("/api/recommendations"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 8 }),
      cache: "no-store",
    })
    return Array.isArray(json.items) ? json.items : []
  } catch {
    return []
  }
}

async function fetchPreferences(): Promise<{ moods: string[]; goals: string[] }> {
  try {
    const json = await fetchJson<{ moods?: string[]; goals?: string[] }>(apiUrl("/api/preferences"), {
      cache: "no-store",
    })
    return {
      moods: Array.isArray(json.moods) ? json.moods : [],
      goals: Array.isArray(json.goals) ? json.goals : [],
    }
  } catch {
    return { moods: [], goals: [] }
  }
}

type PulseItem = { id: string; title: string; meta: string }

async function fetchCommunityPulse(): Promise<PulseItem[]> {
  try {
    const json = await fetchJson<{ items?: PulseItem[] }>(apiUrl("/api/community/pulse"), { cache: "no-store" })
    return Array.isArray(json.items) ? json.items : []
  } catch {
    return []
  }
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-border/60 bg-surface/80 px-4 py-3 shadow-card backdrop-blur-sm", color)}>
      <div className="shrink-0 text-primary">{icon}</div>
      <div>
        <div className="text-xl font-bold text-heading tabular-nums">{value}</div>
        <div className="text-xs text-text-muted">{label}</div>
      </div>
    </div>
  )
}

function ShelfEmpty({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-10 text-center">
      <div className="font-heading text-h3 text-heading">{title}</div>
      <div className="mt-2 text-sm text-text-muted">{subtitle}</div>
      <div className="mt-6">
        <Link href="/browse">
          <Button variant="secondary" size="md">Hunt books →</Button>
        </Link>
      </div>
    </div>
  )
}

export function DashboardClient() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  // Shelf data
  const items = useShelfStore((s) => s.items)
  const clearAll = useShelfStore((s) => s.clearAll)
  const updateBookStatus = useShelfStore((s) => s.updateBookStatus)
  const reading = React.useMemo(
    () => Object.entries(items).filter(([, v]) => v.status === "reading"),
    [items]
  )
  const want = React.useMemo(
    () => Object.entries(items).filter(([, v]) => v.status === "want_to_read"),
    [items]
  )
  const read = React.useMemo(
    () => Object.entries(items).filter(([, v]) => v.status === "read"),
    [items]
  )

  // Mood preferences — load from DB, persist to DB + local store
  const selectedMoods = useFiltersStore((s) => s.moods)
  const setPartial = useFiltersStore((s) => s.setPartial)

  // Hydrate moods from DB once after mount
  const { data: prefsData } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: fetchPreferences,
    staleTime: 5 * 60 * 1000,
    enabled: mounted,
  })
  React.useEffect(() => {
    if (prefsData && prefsData.moods.length > 0) {
      setPartial({ moods: prefsData.moods })
    }
  }, [prefsData, setPartial])

  const toggleMood = async (slug: string) => {
    const { moods } = useFiltersStore.getState()
    const next = moods.includes(slug) ? moods.filter((m) => m !== slug) : [...moods, slug]
    setPartial({ moods: next })
    // Persist to DB (fire-and-forget, non-blocking)
    await fetchJson(apiUrl("/api/preferences"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moods: next }),
    }).catch(() => undefined)
  }

  // AI Recommendations
  const { data, isPending } = useQuery({
    queryKey: ["dashboard-recs"],
    queryFn: fetchRecommendations,
    staleTime: 24 * 60 * 60 * 1000,
    enabled: mounted,
  })

  // Community pulse
  const { data: pulseData } = useQuery({
    queryKey: ["community-pulse"],
    queryFn: fetchCommunityPulse,
    staleTime: 5 * 60 * 1000,
    enabled: mounted,
  })
  const pulseItems = Array.isArray(pulseData) ? pulseData : []
  const recBooks = Array.isArray(data) ? data : []
  const recsLoading = !mounted || isPending

  const greeting = React.useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <div className="container min-w-0 pb-16">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-bg-secondary/40 to-accent/10 p-6 shadow-card md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(196,149,106,0.16), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 100%, rgba(139,90,43,0.1), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium text-primary">{greeting}</div>
            <h1 className="mt-1 font-heading text-h1 text-gradient-hero">Your reading HQ</h1>
            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Shelf, picks, and taste — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatCard icon={<BookOpen className="h-5 w-5" />} label="Reading" value={reading.length} color="" />
            <StatCard icon={<Clock className="h-5 w-5" />} label="Want to Read" value={want.length} color="" />
            <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Finished" value={read.length} color="" />
          </div>
        </div>
      </div>

      {/* ── My Shelf ── */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-heading text-h2 text-heading">My Shelf</h2>
          {Object.keys(items).length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => void clearAll()}>
              Clear shelf
            </Button>
          )}
        </div>

        <Tabs defaultValue="reading">
          <TabsList className="w-full justify-start sm:w-auto">
            <TabsTrigger value="reading">
              Reading ({reading.length})
            </TabsTrigger>
            <TabsTrigger value="want">
              Want to Read ({want.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({read.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="mt-4">
            {reading.length === 0 ? (
              <ShelfEmpty title="No current reads" subtitle="Add something from Browse or any book page." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:items-stretch">
                {reading.map(([id, entry]) => (
                  <div key={id} className="flex h-full min-h-0">
                    <BookCard
                      book={entry.book}
                      variant="default"
                      onAddToShelf={(bookId, status) => {
                        if (bookId === id) updateBookStatus(id, status)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="want" className="mt-4">
            {want.length === 0 ? (
              <ShelfEmpty title="Nothing queued" subtitle="Browse the catalog and add books you want to read next." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:items-stretch">
                {want.map(([id, entry]) => (
                  <div key={id} className="flex h-full min-h-0">
                    <BookCard
                      book={entry.book}
                      variant="default"
                      onAddToShelf={(bookId, status) => {
                        if (bookId === id) updateBookStatus(id, status)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="mt-4">
            {read.length === 0 ? (
              <ShelfEmpty title="No finished books yet" subtitle="Mark titles as Read to fuel smarter AI recommendations." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:items-stretch">
                {read.map(([id, entry]) => (
                  <div key={id} className="flex h-full min-h-0">
                    <BookCard
                      book={entry.book}
                      variant="default"
                      onAddToShelf={(bookId, status) => {
                        if (bookId === id) updateBookStatus(id, status)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* ── AI Picks ── */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="font-heading text-h2 text-heading">Chosen for you</h2>
        </div>
        {recsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-2xl border border-border bg-surface/60" />
            ))}
          </div>
        ) : recBooks.length > 0 ? (
          <BookCarousel title="" books={recBooks.slice(0, 8)} />
        ) : (
          <div className="rounded-2xl border border-border/80 bg-surface/60 p-8 text-center shadow-card backdrop-blur-sm">
            <p className="text-sm text-text-muted">
              Add books to your shelf to unlock personalised picks.
            </p>
            <div className="mt-4">
              <Link href="/browse">
                <Button variant="secondary" size="sm">Browse catalog</Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── Mood Preferences ── */}
      <section className="mt-10">
        <div className="mb-1 font-heading text-h2 text-heading">Your vibe</div>
        <p className="mb-4 text-sm text-text-muted">
          Pin moods to tune your recommendations and Browse defaults.
        </p>
        <div className={moodChipsGridClass}>
          {MOODS.map((m) => {
            const active = selectedMoods.includes(m.slug)
            return (
              <MoodChipToggle
                key={m.slug}
                mood={m}
                active={active}
                onClick={() => void toggleMood(m.slug)}
              />
            )
          })}
        </div>
        {selectedMoods.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-text-muted">{selectedMoods.length} mood{selectedMoods.length !== 1 ? "s" : ""} selected — reflected in Browse filters</span>
            <button
              type="button"
              onClick={() => setPartial({ moods: [] })}
              className="text-xs text-primary hover:text-primary-hover underline underline-offset-2"
            >
              Clear
            </button>
          </div>
        )}
      </section>

      {/* ── Community Pulse ── */}
      <section className="mt-10 rounded-2xl border border-border/80 bg-surface/60 p-6 shadow-card backdrop-blur-sm md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-h2 text-heading">Community pulse</h2>
            <p className="mt-1 text-sm text-text-muted">What readers are finishing and sharing right now.</p>
          </div>
          <Link href="/community" className="shrink-0 text-sm font-medium text-primary hover:text-primary-hover">
            Enter the room →
          </Link>
        </div>
        {pulseItems.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">No recent activity yet — be the first to finish a book!</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pulseItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col rounded-xl border border-border/70 bg-bg-secondary/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-heading">{item.title}</span>
                <span className="mt-0.5 text-xs text-text-muted sm:ml-4 sm:mt-0">{item.meta}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}
