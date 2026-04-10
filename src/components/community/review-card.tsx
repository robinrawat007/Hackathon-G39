"use client"

import Link from "next/link"

import type { ReviewCardProps } from "@/types/community"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/ui/star-rating"
import { Button } from "@/components/ui/button"

export function ReviewCard({ review, onLike, isLiked }: ReviewCardProps) {
  return (
    <div className="break-inside-avoid rounded-md border border-border bg-surface p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.avatarUrl} alt={review.userName} />
            <AvatarFallback>{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-heading">{review.userName}</div>
            <div className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
          </div>
        </div>
        <StarRating value={review.rating} interactive={false} size="sm" />
      </div>

      <p className="mt-4 text-sm text-text-muted">“{review.body}”</p>

      <div className="mt-4 flex items-center justify-between">
        <Link href={`/book/${review.bookSlug}`} className="text-sm text-primary hover:text-primary-hover">
          {review.bookTitle}
        </Link>
        <Button variant={isLiked ? "secondary" : "ghost"} size="sm" onClick={() => onLike(review.id)}>
          Like · {review.likesCount}
        </Button>
      </div>
    </div>
  )
}

