import { z } from "zod"

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().min(20, "Review must be at least 20 characters."),
})

export type ReviewInput = z.infer<typeof reviewSchema>

