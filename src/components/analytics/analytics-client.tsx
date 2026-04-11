"use client"

import dynamic from "next/dynamic"
import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { fetchJson } from "@/lib/api/client-fetch"
import type { AnalyticsData } from "@/types/analytics"
import { useCountUp } from "@/lib/hooks/use-count-up"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const Charts = dynamic(() => import("./charts"), { ssr: false, loading: () => <Skeleton className="h-[420px] w-full" /> })

async function fetchAnalytics(): Promise<AnalyticsData> {
  return fetchJson<AnalyticsData>("/api/analytics")
}

function downloadCsv(rows: Record<string, string | number>[], filename: string) {
  const keys = rows.length > 0 ? Object.keys(rows[0]!) : []
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function AnalyticsClient() {
  const { data, isLoading, error } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics, staleTime: 60 * 1000 })

  const booksRead = useCountUp(data?.booksReadThisYear ?? 0)
  const pagesRead = useCountUp(data?.estimatedPagesRead ?? 0)
  const streak = useCountUp(data?.currentStreak ?? 0)
  const avgRating = data?.averageRating ?? 0

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-h1 text-heading">Analytics</h1>
          <p className="mt-2 text-sm text-text-muted">All insights are derived from your shelf items and reviews.</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={!data}
          onClick={() =>
            downloadCsv(
              (data?.monthlyActivity ?? []).map((m) => ({ month: m.month, books_finished: m.count })),
              "reading-activity.csv"
            )
          }
        >
          Download CSV
        </Button>
      </div>

      {error ? <div className="mt-6 text-sm text-error">Failed to load analytics.</div> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-md border border-border bg-surface p-6 shadow-card">
          <div className="text-sm text-text-muted">📚 Books Read This Year</div>
          <div className="mt-2 font-heading text-h2 text-heading">{isLoading ? "—" : booksRead}</div>
        </div>
        <div className="rounded-md border border-border bg-surface p-6 shadow-card">
          <div className="text-sm text-text-muted">📄 Est. Pages Read</div>
          <div className="mt-2 font-heading text-h2 text-heading">{isLoading ? "—" : pagesRead}</div>
        </div>
        <div className="rounded-md border border-border bg-surface p-6 shadow-card">
          <div className="text-sm text-text-muted">⭐ Avg Rating Given</div>
          <div className="mt-2 font-heading text-h2 text-heading">{isLoading ? "—" : avgRating.toFixed(1)}</div>
        </div>
        <div className="rounded-md border border-border bg-surface p-6 shadow-card">
          <div className="text-sm text-text-muted">🔥 Current Streak (days)</div>
          <div className="mt-2 font-heading text-h2 text-heading">{isLoading ? "—" : streak}</div>
        </div>
      </div>

      <div className="mt-8">
        <Charts data={data ?? null} />
      </div>
    </div>
  )
}

