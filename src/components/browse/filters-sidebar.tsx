"use client"

import * as React from "react"

import { GENRES } from "@/lib/constants"
import { useFiltersStore } from "@/lib/stores/filters-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  return (
    <aside className="glass-card sticky top-28 self-start rounded-2xl border border-border/60 p-5 shadow-card backdrop-blur-md">
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
          <div id="browse-filter-era-label" className="text-sm font-medium text-heading">
            Era
          </div>
          <Select
            value={filters.era}
            onValueChange={(v) => filters.setPartial({ era: v as typeof filters.era })}
          >
            <SelectTrigger className="mt-2 h-11 w-full" aria-labelledby="browse-filter-era-label">
              <SelectValue placeholder="Era" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="pre-1900">Pre-1900</SelectItem>
              <SelectItem value="1900-1970">1900–1970</SelectItem>
              <SelectItem value="1970-2000">1970–2000</SelectItem>
              <SelectItem value="2000-2015">2000–2015</SelectItem>
              <SelectItem value="recent">Recent (2015+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div id="browse-filter-rating-label" className="text-sm font-medium text-heading">
            Rating
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={filters.minRating}
            onChange={(e) => filters.setPartial({ minRating: Number(e.target.value) })}
            className="mt-2 w-full"
            aria-labelledby="browse-filter-rating-label"
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={filters.minRating}
            aria-valuetext={`Minimum ${filters.minRating} stars`}
          />
          <div className="mt-1 text-sm text-text-muted">★ {filters.minRating} and above</div>
        </div>

        <div>
          <div className="text-sm font-medium text-heading">Page count</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              className="h-11 rounded-md border border-border bg-bg-secondary px-3 font-sans text-sm text-text"
              value={filters.pageCountRange[0]}
              onChange={(e) => filters.setPartial({ pageCountRange: [Number(e.target.value), filters.pageCountRange[1]] })}
              aria-label="Minimum pages"
            />
            <input
              type="number"
              className="h-11 rounded-md border border-border bg-bg-secondary px-3 font-sans text-sm text-text"
              value={filters.pageCountRange[1]}
              onChange={(e) => filters.setPartial({ pageCountRange: [filters.pageCountRange[0], Number(e.target.value)] })}
              aria-label="Maximum pages"
            />
          </div>
          <div className="mt-1 text-sm text-text-muted">
            {filters.pageCountRange[0]}–{filters.pageCountRange[1] >= 9999 ? "∞" : filters.pageCountRange[1]} pages
          </div>
        </div>

        <div>
          <div id="browse-filter-language-label" className="text-sm font-medium text-heading">
            Language
          </div>
          <Select value={filters.language} onValueChange={(v) => filters.setPartial({ language: v })}>
            <SelectTrigger className="mt-2 h-11 w-full" aria-labelledby="browse-filter-language-label">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <Badge variant="secondary">{filters.genres.length + filters.moods.length} active filter{filters.genres.length + filters.moods.length !== 1 ? "s" : ""}</Badge>
        </div>
      </div>
    </aside>
  )
}

