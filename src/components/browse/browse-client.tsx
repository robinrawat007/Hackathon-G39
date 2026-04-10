"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"

import { FiltersSidebar } from "@/components/browse/filters-sidebar"
import { ActiveFilterChips } from "@/components/browse/active-filter-chips"
import { SortBar } from "@/components/browse/sort-bar"
import { BookGrid } from "@/components/books/book-grid"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useFiltersStore } from "@/lib/stores/filters-store"
import { useInfiniteBooks } from "@/lib/hooks/use-infinite-books"

export function BrowseClient() {
  const searchParams = useSearchParams()
  const filters = useFiltersStore()
  const setPartial = useFiltersStore((s) => s.setPartial)

  // Sync URL search params into the store on first mount so that links like
  // /browse?mood=dark-eerie or /browse?genre=Fantasy pre-populate filters.
  React.useEffect(() => {
    const moodParam = searchParams.get("mood")
    const genreParam = searchParams.get("genre")
    const updates: Parameters<typeof setPartial>[0] = {}
    if (moodParam) updates.moods = [moodParam]
    if (genreParam) updates.genres = [genreParam]
    if (Object.keys(updates).length > 0) setPartial(updates)
    // Only run on initial mount – intentionally omitting deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading, error } = useInfiniteBooks({
    genres: filters.genres,
    moods: filters.moods,
    era: filters.era,
    minRating: filters.minRating,
    minPages: filters.pageCountRange[0],
    maxPages: filters.pageCountRange[1],
    language: filters.language,
    sort: filters.sort,
  })

  const books = data?.pages.flatMap((p) => p.items) ?? []

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting) return
        if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
      },
      { rootMargin: "600px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="container py-10 md:py-12">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-h1 text-gradient-hero">Browse Books</h1>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="p-4">
                <FiltersSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="hidden md:block">
          <FiltersSidebar />
        </div>

        <div>
          <div className="space-y-4">
            <SortBar />
            <ActiveFilterChips />
          </div>

          <div className="mt-6">
            {error ? (
              <div className="rounded-md border border-border bg-surface p-6 text-sm text-error">
                Failed to load books.
              </div>
            ) : null}

            {books.length === 0 && !isLoading && !isFetching ? (
              <div className="rounded-md border border-border bg-surface p-10 text-center">
                <div className="font-heading text-h3 text-heading">No books match these filters.</div>
                <div className="mt-2 text-sm text-text-muted">Try widening your filters to discover more.</div>
                <div className="mt-6">
                  <Button variant="secondary" size="md" onClick={() => filters.clearAll()}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <BookGrid books={books} isLoading={isLoading} />
            )}

            <div ref={sentinelRef} className="h-10" />
            {isFetchingNextPage ? (
              <div className="mt-4 text-center text-sm text-text-muted">Loading more…</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

