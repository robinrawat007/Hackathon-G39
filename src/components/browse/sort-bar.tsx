"use client"

import { useFiltersStore } from "@/lib/stores/filters-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortBar() {
  const sort = useFiltersStore((s) => s.sort)
  const setPartial = useFiltersStore((s) => s.setPartial)

  return (
    <div className="flex w-full justify-end">
      <div className="flex w-full max-w-[min(100%,16rem)] items-center gap-2 sm:max-w-[14rem]">
        <Select value={sort} onValueChange={(v) => setPartial({ sort: v as typeof sort })}>
          <SelectTrigger
            className="h-9 flex-1 border-border/70 bg-bg-secondary/90 text-sm shadow-sm"
            aria-label="Sort search results"
          >
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="highest_rated">Highest rated</SelectItem>
            <SelectItem value="most_reviewed">Most reviewed</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
