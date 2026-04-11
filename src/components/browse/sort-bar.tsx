"use client"

import { useFiltersStore } from "@/lib/stores/filters-store"

export function SortBar() {
  const sort = useFiltersStore((s) => s.sort)
  const setPartial = useFiltersStore((s) => s.setPartial)

  return (
    <div className="glass-card flex items-center justify-between gap-3 rounded-lg px-4 py-3">
      <div className="text-sm text-text-muted">Sort</div>
      <select
        className="h-10 rounded-md border border-border bg-bg-secondary px-3 font-sans text-sm text-text"
        value={sort}
        onChange={(e) => setPartial({ sort: e.target.value as typeof sort })}
      >
        <option value="relevance">Relevance</option>
        <option value="highest_rated">Highest Rated</option>
        <option value="most_reviewed">Most Reviewed</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  )
}

