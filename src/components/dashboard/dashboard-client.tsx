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
      <div className="mb-8">
        <div className="text-sm text-text-muted">{greeting}</div>
        <h1 className="mt-1 font-heading text-h1 text-heading">Ready to get lost in a book?</h1>
      </div>

      <section className="rounded-md border border-border bg-surface p-6 shadow-card">
        <div className="font-heading text-h3 text-heading">Picked for you</div>
        <div className="mt-2 text-sm text-text-muted">Recommendations refresh from your taste profile and trending data.</div>
        <div className="mt-6">
          <BookGrid books={books} isLoading={isLoading} />
        </div>
      </section>

      <section className="mt-10">
        {books.length > 0 ? (
          <BookCarousel title="Continue where you left off" books={books.slice(0, 8)} />
        ) : !isLoading ? (
          <div className="rounded-md border border-border bg-surface p-8 text-center shadow-card">
            <div className="font-heading text-h3 text-heading">No carousel yet</div>
            <p className="mt-2 text-sm text-text-muted">
              Add books to your shelf or grab recommendations above — your shortcuts will appear here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/browse">
                <Button variant="secondary" size="sm">
                  Browse
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

      <section className="mt-10 rounded-md border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-heading text-h3 text-heading">Community activity</div>
            <div className="mt-1 text-sm text-text-muted">
              Sample feed for layout; live updates from readers you follow will replace this once connected.
            </div>
          </div>
          <Link href="/community" className="text-sm text-primary hover:text-primary-hover">
            Open community →
          </Link>
        </div>
        <ul className="mt-4 space-y-3" aria-label="Recent community highlights">
          {ACTIVITY.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-md border border-border bg-bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
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
