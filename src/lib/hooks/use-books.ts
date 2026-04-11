"use client"

import { useQuery } from "@tanstack/react-query"

import { ApiRequestError, fetchJson } from "@/lib/api/client-fetch"
import type { Book } from "@/types/book"
import { getApiOrigin } from "@/lib/api-url"

export type BooksPage = {
  items: Book[]
  /** Count of all books matching filters (all pages). */
  total: number
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

export const PAGE_SIZE = 12

export function useBooks(
  filters: {
    q?: string
    genres: string[]
    moods: string[]
    era: string
    minRating: number
    minPages: number
    maxPages: number
    language: string
    sort: string
  },
  page: number
) {
  return useQuery({
    queryKey: ["books-page", filters, page],
    queryFn: async () => {
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
        page,
        limit: PAGE_SIZE,
      })
      try {
        return await fetchJson<BooksPage>(url, { cache: "no-store" })
      } catch (e) {
        if (e instanceof ApiRequestError && e.status === 429) {
          throw new Error("Too many searches. Please wait a moment and try again.")
        }
        throw e
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })
}
