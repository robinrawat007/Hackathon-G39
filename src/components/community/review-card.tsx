"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import type { ReviewCardProps } from "@/types/community"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { useAuthDialog } from "@/components/auth/auth-dialog-context"
import { cn } from "@/lib/utils"
import { ApiRequestError, fetchJson } from "@/lib/api/client-fetch"

export function ReviewCard({ review, viewerUserId, className }: ReviewCardProps) {
  const pathname = usePathname()
  const { openSignIn } = useAuthDialog()
  const queryClient = useQueryClient()
  const [following, setFollowing] = React.useState(review.isFollowing ?? false)
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    setFollowing(review.isFollowing ?? false)
  }, [review.id, review.isFollowing])

  const showFollow = Boolean(viewerUserId) && viewerUserId !== review.userId

  const toggleFollow = async () => {
    if (!viewerUserId || busy) return
    setBusy(true)
    const next = !following
    try {
      if (next) {
        await fetchJson<{ ok?: boolean }>("/api/community/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followingId: review.userId }),
        })
      } else {
        await fetchJson<{ ok?: boolean }>(`/api/community/follow?userId=${encodeURIComponent(review.userId)}`, {
          method: "DELETE",
        })
      }
      setFollowing(next)
      await queryClient.invalidateQueries({ queryKey: ["community-feed"] })
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) {
        openSignIn({ redirectTo: pathname || "/community" })
        return
      }
    } finally {
      setBusy(false)
    }
  }

  const profileHref = review.username ? `/profile/${encodeURIComponent(review.username)}` : null

  return (
    <div
      className={cn(
        "flex h-full min-h-[280px] flex-col rounded-xl border border-border/80 bg-surface/90 p-6 shadow-card backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0 border border-border">
            <AvatarImage src={review.avatarUrl} alt="" />
            <AvatarFallback>{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            {profileHref ? (
              <Link href={profileHref} className="block truncate text-sm font-medium text-heading hover:underline">
                {review.userName}
              </Link>
            ) : (
              <div className="truncate text-sm font-medium text-heading">{review.userName}</div>
            )}
            <div className="text-xs text-text-muted">
              {(() => {
                const d = new Date(review.createdAt)
                return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              })()}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StarRating value={review.rating} interactive={false} size="sm" />
          {showFollow ? (
            <Button
              type="button"
              variant={following ? "secondary" : "primary"}
              size="sm"
              className="h-8 min-w-[5.5rem] px-2 text-xs"
              loading={busy}
              onClick={() => void toggleFollow()}
            >
              {following ? "Following" : "Follow"}
            </Button>
          ) : null}
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-5">“{review.body}”</p>

      <div className="mt-4 border-t border-border/60 pt-4">
        <Link href={`/book/${review.bookSlug}`} className="text-sm font-medium text-primary hover:text-primary-hover line-clamp-2">
          {review.bookTitle}
        </Link>
      </div>
    </div>
  )
}
