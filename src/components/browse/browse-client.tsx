"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

import { FiltersSidebar } from "@/components/browse/filters-sidebar"
import { ActiveFilterChips } from "@/components/browse/active-filter-chips"
import { SortBar } from "@/components/browse/sort-bar"
import { BookGrid } from "@/components/books/book-grid"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useFiltersStore } from "@/lib/stores/filters-store"
import { useBooks, PAGE_SIZE } from "@/lib/hooks/use-books"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { MOODS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function BrowseClient() {
  const searchParams = useSearchParams()
  const filters = useFiltersStore()
  const setPartial = useFiltersStore((s) => s.setPartial)
  const [page, setPage] = React.useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const skipScrollOnPage = React.useRef(true)

  // Sync URL search params on first mount
  React.useEffect(() => {
    const moodParam = searchParams.get("mood")
    const genreParam = searchParams.get("genre")
    const updates: Parameters<typeof setPartial>[0] = {}
    if (moodParam) updates.moods = [moodParam]
    if (genreParam) updates.genres = [genreParam]
    if (Object.keys(updates).length > 0) setPartial(updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset to page 0 whenever filters change
  const filtersKey = JSON.stringify({
    genres: filters.genres,
    moods: filters.moods,
    era: filters.era,
    minRating: filters.minRating,
    pageCountRange: filters.pageCountRange,
    language: filters.language,
    sort: filters.sort,
  })
  React.useEffect(() => {
    setPage(0)
  }, [filtersKey]) // eslint-disable-line react-hooks/exhaustive-deps

  /** After pagination (not on first paint) — runs after commit so scroll isn’t lost to layout. */
  React.useLayoutEffect(() => {
    if (skipScrollOnPage.current) {
      skipScrollOnPage.current = false
      return
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }, [page, reducedMotion])

  const { data, isLoading, isFetching, error } = useBooks(
    {
      genres: filters.genres,
      moods: filters.moods,
      era: filters.era,
      minRating: filters.minRating,
      minPages: filters.pageCountRange[0],
      maxPages: filters.pageCountRange[1],
      language: filters.language,
      sort: filters.sort,
    },
    page
  )

  const books = data?.items ?? []
  const totalResults = data?.total
  const hasNextPage = data?.nextPage !== null && data?.nextPage !== undefined
  const hasPrevPage = page > 0
  const currentPage = page + 1 // 1-indexed for display

  const goToPage = (p: number) => {
    setPage(p)
  }

  // Build visible page numbers: always show current, up to 2 before, up to 2 after
  const visiblePages = React.useMemo(() => {
    const pages: number[] = []
    const start = Math.max(0, page - 2)
    const end = hasNextPage ? page + 1 : page
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }, [page, hasNextPage])

  const startItem = page * PAGE_SIZE + 1
  const endItem = page * PAGE_SIZE + books.length

  const resultsSummary =
    typeof totalResults === "number" && totalResults > 0
      ? totalResults === 1
        ? "Showing 1 of 1 result"
        : `Showing ${startItem.toLocaleString()}–${endItem.toLocaleString()} of ${totalResults.toLocaleString()} results`
      : `Showing ${startItem.toLocaleString()}–${endItem.toLocaleString()} results`

  return (
    <div className="container py-10 md:py-12">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-bg-secondary/40 to-accent/10 p-6 shadow-card md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 0% 0%, rgba(196,149,106,0.16), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 80%, rgba(139,90,43,0.1), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-heading text-h1 text-gradient-hero">Hunt your next read</h1>
            <p className="mt-2 text-sm text-text-muted md:text-base">
              Genre, mood, era, ratings, page count — dial it in and page through the hits.
            </p>
          </div>
          <div className="shrink-0 md:hidden">
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
      </div>

      {/* Mood quick-filters */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium text-heading">What's the vibe?</div>
          {filters.moods.length > 0 && (
            <button
              type="button"
              onClick={() => filters.setPartial({ moods: [] })}
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              Clear moods
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8">
          {MOODS.map((m) => {
            const active = filters.moods.includes(m.slug)
            return (
              <button
                key={m.slug}
                type="button"
                onClick={() => {
                  const { moods, setPartial } = useFiltersStore.getState()
                  const next = moods.includes(m.slug)
                    ? moods.filter((x) => x !== m.slug)
                    : [...moods, m.slug]
                  setPartial({ moods: next })
                }}
                className={cn(
                  "flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center text-xs font-medium transition-all duration-200 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm",
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_14px_rgba(139,90,43,0.18)]"
                    : "border-border/70 bg-bg-secondary/80 text-heading hover:border-primary/45 hover:bg-surface hover:shadow-[0_0_14px_rgba(139,90,43,0.1)]"
                )}
              >
                <span aria-hidden="true" className="text-lg leading-none">{m.emoji}</span>
                <span className="leading-tight">{m.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[320px_1fr]">
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
              <div className="rounded-2xl border border-error/30 bg-error/5 p-6 text-sm text-error">
                Catalog glitched — refresh or loosen filters and try again.
              </div>
            ) : null}

            {books.length === 0 && !isLoading && !isFetching ? (
              <div className="rounded-2xl border border-border/80 bg-surface/60 p-10 text-center shadow-card">
                <div className="font-heading text-h3 text-heading">Too tight — nothing fits</div>
                <div className="mt-2 text-sm text-text-muted">Widen the net; the good stuff's still out there.</div>
                <div className="mt-6">
                  <Button variant="secondary" size="md" onClick={() => filters.clearAll()}>
                    Reset filters →
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className={cn("transition-opacity duration-200", isFetching && !isLoading ? "opacity-60" : "opacity-100")}>
                  <BookGrid books={books} isLoading={isLoading} />
                </div>

                {/* Pagination */}
                {!isLoading && books.length > 0 && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    {/* Result range */}
                    <p className="text-xs text-text-muted">{resultsSummary}</p>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5">
                      {/* Prev */}
                      <button
                        type="button"
                        disabled={!hasPrevPage || isFetching}
                        onClick={() => goToPage(page - 1)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-all duration-150",
                          hasPrevPage && !isFetching
                            ? "border-border bg-bg text-heading hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                            : "border-border/40 bg-bg-secondary/50 text-text-muted/40 cursor-not-allowed"
                        )}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page numbers */}
                      {visiblePages[0]! > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={() => goToPage(0)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg text-sm text-heading transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                          >
                            1
                          </button>
                          {visiblePages[0]! > 1 && (
                            <span className="flex h-9 w-9 items-center justify-center text-sm text-text-muted">…</span>
                          )}
                        </>
                      )}

                      {visiblePages.map((p) => (
                        <button
                          key={p}
                          type="button"
                          disabled={isFetching}
                          onClick={() => goToPage(p)}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150",
                            p === page
                              ? "border-primary bg-primary text-white shadow-[0_0_10px_rgba(139,90,43,0.2)] cursor-default"
                              : "border-border bg-bg text-heading hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                          )}
                          aria-current={p === page ? "page" : undefined}
                        >
                          {p + 1}
                        </button>
                      ))}

                      {/* Next */}
                      <button
                        type="button"
                        disabled={!hasNextPage || isFetching}
                        onClick={() => goToPage(page + 1)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-all duration-150",
                          hasNextPage && !isFetching
                            ? "border-border bg-bg text-heading hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                            : "border-border/40 bg-bg-secondary/50 text-text-muted/40 cursor-not-allowed"
                        )}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {isFetching && !isLoading && (
                      <p className="text-xs text-text-muted">Loading…</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
