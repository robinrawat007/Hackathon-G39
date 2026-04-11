"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { fetchJson } from "@/lib/api/client-fetch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/ui/star-rating"
import { WriteReview } from "@/components/books/write-review"

type Profile = { username?: string | null; display_name?: string | null; avatar_url?: string | null }

type ReviewRow = {
  id: string
  rating: number
  body: string
  created_at: string
  user_id: string
  profiles: Profile | Profile[] | null
}

function displayName(p: Profile | null): string {
  if (!p) return "Reader"
  const obj = Array.isArray(p) ? p[0] : p
  return obj?.display_name?.trim() || obj?.username?.trim() || "Reader"
}

function avatarUrl(p: Profile | null): string | undefined {
  if (!p) return undefined
  const obj = Array.isArray(p) ? p[0] : p
  return obj?.avatar_url?.trim() || undefined
}

export function BookReviewsSection({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["book-reviews", bookId],
    queryFn: async () => {
      const json = await fetchJson<{ reviews?: ReviewRow[] }>(
        `/api/reviews?bookId=${encodeURIComponent(bookId)}`,
        { credentials: "same-origin", cache: "no-store" }
      )
      return Array.isArray(json.reviews) ? json.reviews : []
    },
  })

  const reviews = data ?? []

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
        <h3 className="font-heading text-h3 text-heading">Write a review</h3>
        <p className="mt-2 text-sm text-text-muted">
          Share an honest take on <span className="font-medium text-heading">{bookTitle}</span> — it appears on this page and in
          community.
        </p>
        <WriteReview bookId={bookId} />
      </div>

      <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
        <h3 className="font-heading text-h3 text-heading">Recent reviews</h3>
        {isLoading ? (
          <p className="mt-3 text-sm text-text-muted">Loading reviews…</p>
        ) : error ? (
          <p className="mt-3 text-sm text-error">Couldn’t load reviews. Refresh and try again.</p>
        ) : reviews.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No reviews yet for this title — be the first.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => {
              const profile = r.profiles
              const name = displayName(profile as Profile | null)
              const av = avatarUrl(profile as Profile | null)
              const d = new Date(r.created_at)
              const dateStr = Number.isNaN(d.getTime())
                ? ""
                : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              return (
                <li key={r.id} className="rounded-lg border border-border/60 bg-bg-secondary/40 p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0 border border-border/60">
                      {av ? <AvatarImage src={av} alt="" /> : null}
                      <AvatarFallback className="text-xs font-semibold text-primary">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-heading">{name}</span>
                        {dateStr ? <span className="text-xs text-text-muted">{dateStr}</span> : null}
                      </div>
                      <div className="mt-1">
                        <StarRating value={r.rating} interactive={false} size="sm" />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-text">&ldquo;{r.body}&rdquo;</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
