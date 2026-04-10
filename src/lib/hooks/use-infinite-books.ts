"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import type { Book } from "@/types/book"
import { getApiOrigin } from "@/lib/api-url"

type SearchResponse = {
  items: Book[]
  nextPage: number | null
}

function buildUrl(params: Record<string, string | string[] | number | undefined>) {
  const url = new URL("/api/books/search", getApiOrigin())
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "undefined") continue
    if (Array.isArray(v)) {
      for (const item of v) url.searchParams.append(k, item)
      continue
    }
    url.searchParams.set(k, String(v))
  }
  return url.toString()
}

export function useInfiniteBooks(filters: {
  q?: string
  genres: string[]
  moods: string[]
  era: string
  minRating: number
  minPages: number
  maxPages: number
  language: string
  sort: string
}) {
  return useInfiniteQuery({
    queryKey: ["books-search", filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const url = buildUrl({
        q: filters.q,
        genre: filters.genres,
        mood: filters.moods,
        era: filters.era,
        minRating: filters.minRating,
        minPages: filters.minPages,
        maxPages: filters.maxPages,
        language: filters.language,
        sort: filters.sort,
        page: Number(pageParam),
        limit: 12,
      })
      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many searches. Please wait a moment and try again.")
        throw new Error("Failed to fetch books")
      }
      return (await res.json()) as SearchResponse
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  })
}

