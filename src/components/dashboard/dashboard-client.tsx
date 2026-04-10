"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import type { Book } from "@/types/book"
import { BookGrid } from "@/components/books/book-grid"
import { BookCarousel } from "@/components/books/book-carousel"
import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api-url"

async function fetchRecommendations(): Promise<Book[]> {
  const res = await fetch(apiUrl("/api/recommendations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 8 }),
    cache: "no-store",
  })
  if (!res.ok) return []
  const json = (await res.json()) as { items?: Book[] }
  return Array.isArray(json.items) ? json.items : []
}

const ACTIVITY = [
  {
    id: "a1",
    title: "Jordan finished The Goldfinch",
    meta: "Yesterday · 5★",
  },
  {
    id: "a2",
    title: "New list: “Essays that read like novels”",
    meta: "2 days ago · 9 books",
  },
  {
    id: "a3",
    title: "Maya started The Three-Body Problem",
    meta: "3 days ago · progress saved",
  },
] as const

export function DashboardClient() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const { data, isPending } = useQuery({
    queryKey: ["dashboard-recs"],
    queryFn: fetchRecommendations,
    staleTime: 24 * 60 * 60 * 1000,
    enabled: mounted,
  })

  const books = Array.isArray(data) ? data : []
  const isLoading = !mounted || isPending
  const greeting = React.useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  return (
    <div className="container pb-16">
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-bg-secondary/40 to-accent/10 p-6 shadow-card md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(99,179,237,0.2), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 100%, rgba(159,122,234,0.12), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <div className="text-sm font-medium text-primary">{greeting}</div>
          <h1 className="mt-1 font-heading text-h1 text-gradient-hero">Your next-read HQ</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted md:text-base">
            AI-curated stack up top — shortcuts and community pulse below. Same card sizes as Browse so nothing feels
            cheap.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-border/80 bg-surface/60 p-6 shadow-card backdrop-blur-sm md:p-8">
        <div className="font-heading text-h3 text-heading">Chosen for you</div>
        <div className="mt-2 text-sm text-text-muted">Taste profile + what’s hot — refreshed when you shake things up.</div>
        <div className="mt-6">
          <BookGrid books={books} isLoading={isLoading} />
        </div>
      </section>

      <section className="mt-10">
        {books.length > 0 ? (
          <BookCarousel title="Jump back in" books={books.slice(0, 8)} />
        ) : !isLoading ? (
          <div className="rounded-2xl border border-border/80 bg-surface/60 p-8 text-center shadow-card backdrop-blur-sm">
            <div className="font-heading text-h3 text-heading">Carousel unlocks soon</div>
            <p className="mt-2 text-sm text-text-muted">
              Stack your shelf or snag picks above — this rail becomes your instant replay.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/browse">
                <Button variant="secondary" size="sm">
                  Hunt books
                </Button>
              </Link>
              <Link href="/shelf">
                <Button variant="ghost" size="sm">
                  Open shelf
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-10 rounded-2xl border border-border/80 bg-surface/60 p-6 shadow-card backdrop-blur-sm md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-heading text-h3 text-heading">What readers are up to</div>
            <div className="mt-1 text-sm text-text-muted">
              Sample pulse — follow people for real-time drops when social goes live.
            </div>
          </div>
          <Link href="/community" className="text-sm font-medium text-primary hover:text-primary-hover">
            Enter the room →
          </Link>
        </div>
        <ul className="mt-4 space-y-3" aria-label="Recent community highlights">
          {ACTIVITY.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-xl border border-border/70 bg-bg-secondary/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm text-heading">{item.title}</span>
              <span className="text-xs text-text-muted sm:ml-4">{item.meta}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
