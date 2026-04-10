"use client"

import { create } from "zustand"

interface FiltersState {
  genres: string[]
  moods: string[]
  era: "any" | "pre-1900" | "1900-1970" | "1970-2000" | "2000-2015" | "recent"
  minRating: number
  pageCountRange: [number, number]
  language: string
  sort: "relevance" | "highest_rated" | "most_reviewed" | "newest"
  setPartial: (next: Partial<Omit<FiltersState, "setPartial" | "clearAll">>) => void
  clearAll: () => void
}

const DEFAULTS: Omit<FiltersState, "setPartial" | "clearAll"> = {
  genres: [],
  moods: [],
  era: "any",
  minRating: 3,
  pageCountRange: [0, 900],
  language: "any",
  sort: "relevance",
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...DEFAULTS,
  setPartial: (next) => set(next),
  clearAll: () => set(DEFAULTS),
}))

