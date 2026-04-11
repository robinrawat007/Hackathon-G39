"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { reviewSchema, type ReviewInput } from "@/lib/validations/review.schema"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

export function WriteReview({ bookId }: { bookId: string }) {
  const { user, isLoading } = useAuthUser()
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    register,
    reset,
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, body: "" },
  })

  const rating = watch("rating")

  const onSubmit = async (values: ReviewInput) => {
    setServerError(null)
    setSuccess(false)
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, ...values }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      if (res.status === 401) {
        setServerError("Please sign in to post a review.")
        return
      }
      try {
        const j = JSON.parse(text) as { error?: string }
        setServerError(j.error ?? (text || "Failed to submit review"))
      } catch {
        setServerError(text || "Failed to submit review")
      }
      return
    }
    reset({ rating: 0, body: "" })
    setSuccess(true)
  }

  if (isLoading) return null

  if (!user) {
    return (
      <div className="mt-4 rounded-md border border-border/60 bg-bg-secondary/60 px-4 py-5 text-sm text-text-muted">
        <Link href="/auth/login" className="text-primary hover:text-primary-hover underline underline-offset-2">
          Sign in
        </Link>{" "}
        to write a review.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div>
        <div className="text-sm font-medium text-heading">Your rating</div>
        <div className="mt-2">
          <StarRating
            value={rating}
            interactive
            onChange={(v) => setValue("rating", v, { shouldValidate: true })}
          />
        </div>
        {errors.rating ? <div className="mt-1 text-xs text-error">{errors.rating.message}</div> : null}
      </div>

      <div>
        <div className="text-sm font-medium text-heading">Your review</div>
        <div className="mt-2">
          <Textarea placeholder="Be specific: what worked, what didn't, who might love it?" {...register("body")} />
        </div>
        {errors.body ? <div className="mt-1 text-xs text-error">{errors.body.message}</div> : null}
      </div>

      {serverError ? <div className="text-sm text-error">{serverError}</div> : null}
      {success ? (
        <div className="text-sm text-success" role="status">
          Thanks — your review was submitted.
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
        Post review
      </Button>
    </form>
  )
}
