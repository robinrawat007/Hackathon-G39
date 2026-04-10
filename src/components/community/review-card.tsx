"use client"

import Link from "next/link"

import type { ReviewCardProps } from "@/types/community"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[280px] flex-col rounded-xl border border-border/80 bg-surface/90 p-6 shadow-card backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border border-border">
            <AvatarImage src={review.avatarUrl} alt="" />
            <AvatarFallback>{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-heading">{review.userName}</div>
            <div className="text-xs text-text-muted">
              {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
        <StarRating value={review.rating} interactive={false} size="sm" />
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
