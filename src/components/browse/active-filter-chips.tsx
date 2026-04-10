"use client"

import { useFiltersStore } from "@/lib/stores/filters-store"
import { Button } from "@/components/ui/button"

export function ActiveFilterChips() {
  const filters = useFiltersStore()

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = []

  for (const g of filters.genres) {
    chips.push({
      key: `g:${g}`,
      label: g,
      onRemove: () => filters.setPartial({ genres: filters.genres.filter((x) => x !== g) }),
    })
  }
  for (const m of filters.moods) {
    chips.push({
      key: `m:${m}`,
      label: m,
      onRemove: () => filters.setPartial({ moods: filters.moods.filter((x) => x !== m) }),
    })
  }
  if (filters.era !== "any") {
    chips.push({ key: `era:${filters.era}`, label: `Era: ${filters.era}`, onRemove: () => filters.setPartial({ era: "any" }) })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <span key={c.key} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm text-text">
          {c.label}
          <button type="button" onClick={c.onRemove} className="text-text-muted hover:text-text" aria-label={`Remove ${c.label}`}>
            ×
          </button>
        </span>
      ))}
      <Button variant="ghost" size="sm" onClick={() => filters.clearAll()}>
        Clear All Filters
      </Button>
    </div>
  )
}

