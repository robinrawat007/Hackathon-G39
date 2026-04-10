"use client"

import * as React from "react"

import { GENRES, MOODS } from "@/lib/constants"
import { useFiltersStore } from "@/lib/stores/filters-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function CheckboxRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-text">
      <input
        type="checkbox"
        className="h-4 w-4 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}

export function FiltersSidebar() {
  const filters = useFiltersStore()

  const toggleGenre = (g: string) => {
    const { genres, setPartial } = useFiltersStore.getState()
    const next = genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g]
    setPartial({ genres: next })
  }

  const toggleMood = (slug: string) => {
    const { moods, setPartial } = useFiltersStore.getState()
    const next = moods.includes(slug) ? moods.filter((x) => x !== slug) : [...moods, slug]
    setPartial({ moods: next })
  }

  return (
    <aside className="glass-card sticky top-24 rounded-2xl border border-border/60 p-5 shadow-card backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="font-heading text-h3 text-heading">Dial it in</div>
        <Button variant="ghost" size="sm" onClick={() => filters.clearAll()}>
          Clear
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="text-sm font-medium text-heading">Genre</div>
          <div className="mt-2 space-y-2">
            {GENRES.map((g) => (
              <CheckboxRow key={g} checked={filters.genres.includes(g)} label={g} onChange={() => toggleGenre(g)} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-heading">Mood</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => toggleMood(m.slug)}
                className={`rounded-full px-3 py-2 text-sm border ${
                  filters.moods.includes(m.slug)
                    ? "border-primary bg-primary text-heading"
                    : "border-border bg-bg-secondary text-text"
                }`}
              >
                <span aria-hidden="true">{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-heading">Era</div>
          <select
            className="mt-2 h-11 w-full rounded-md border border-border bg-bg-secondary px-3 text-sm text-text"
            value={filters.era}
            onChange={(e) => filters.setPartial({ era: e.target.value as typeof filters.era })}
          >
            <option value="any">Any</option>
            <option value="pre-1900">Pre-1900</option>
            <option value="1900-1970">1900–1970</option>
            <option value="1970-2000">1970–2000</option>
            <option value="2000-2015">2000–2015</option>
            <option value="recent">Recent (2015+)</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-medium text-heading">Rating</div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={filters.minRating}
            onChange={(e) => filters.setPartial({ minRating: Number(e.target.value) })}
            className="mt-2 w-full"
          />
          <div className="mt-1 text-sm text-text-muted">★ {filters.minRating} and above</div>
        </div>

        <div>
          <div className="text-sm font-medium text-heading">Page count</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              className="h-11 rounded-md border border-border bg-bg-secondary px-3 text-sm text-text"
              value={filters.pageCountRange[0]}
              onChange={(e) => filters.setPartial({ pageCountRange: [Number(e.target.value), filters.pageCountRange[1]] })}
              aria-label="Minimum pages"
            />
            <input
              type="number"
              className="h-11 rounded-md border border-border bg-bg-secondary px-3 text-sm text-text"
              value={filters.pageCountRange[1]}
              onChange={(e) => filters.setPartial({ pageCountRange: [filters.pageCountRange[0], Number(e.target.value)] })}
              aria-label="Maximum pages"
            />
          </div>
          <div className="mt-1 text-sm text-text-muted">
            {filters.pageCountRange[0]}–{filters.pageCountRange[1]} pages
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-heading">Language</div>
          <select
            className="mt-2 h-11 w-full rounded-md border border-border bg-bg-secondary px-3 text-sm text-text"
            value={filters.language}
            onChange={(e) => filters.setPartial({ language: e.target.value })}
          >
            <option value="any">Any</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div className="pt-2">
          <Badge variant="secondary">{filters.genres.length + filters.moods.length} active filters</Badge>
        </div>
      </div>
    </aside>
  )
}

