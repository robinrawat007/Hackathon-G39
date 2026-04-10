"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  size?: "sm" | "md" | "lg"
  onChange?: (value: number) => void
}

const SIZE = {
  sm: { star: "h-4 w-4", gap: "gap-1" },
  md: { star: "h-5 w-5", gap: "gap-1.5" },
  lg: { star: "h-6 w-6", gap: "gap-2" },
} as const

const starOn = "fill-neon-pink text-neon-pink drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]"
const starOff = "text-border"

export function StarRating({ value, max = 5, interactive = false, size = "md", onChange }: StarRatingProps) {
  const groupId = React.useId()
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : 0

  if (!interactive) {
    return (
      <div className={cn("inline-flex items-center", SIZE[size].gap)} aria-label={`${safeValue} out of ${max} stars`}>
        {Array.from({ length: max }).map((_, idx) => {
          const filled = idx + 1 <= safeValue
          return (
            <Star key={idx} className={cn(SIZE[size].star, filled ? starOn : starOff)} aria-hidden="true" />
          )
        })}
      </div>
    )
  }

  return (
    <fieldset className="inline-flex items-center">
      <legend className="sr-only">Rating</legend>
      <div className={cn("inline-flex items-center", SIZE[size].gap)}>
        {Array.from({ length: max }).map((_, idx) => {
          const starValue = idx + 1
          const id = `star-${starValue}`
          const checked = starValue === safeValue
          return (
            <label key={id} className="cursor-pointer">
              <input
                type="radio"
                name={`rating-${groupId}`}
                value={starValue}
                checked={checked}
                onChange={() => onChange?.(starValue)}
                className="sr-only"
              />
              <Star
                className={cn(SIZE[size].star, starValue <= safeValue ? starOn : starOff, "transition-colors")}
                aria-hidden="true"
              />
              <span className="sr-only">{`${starValue} out of ${max} stars`}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
