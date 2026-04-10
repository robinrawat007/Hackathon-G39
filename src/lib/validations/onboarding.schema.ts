import { z } from "zod"

export const tasteRaterSchema = z.object({
  ratedBooks: z
    .array(z.object({ bookId: z.string().min(1), rating: z.enum(["love", "liked", "meh", "unread"]) }))
    .min(1),
})

export const moodPickerSchema = z.object({
  moods: z.array(z.string().min(1)).min(2, "Pick at least 2 moods."),
})

export const goalSetterSchema = z.object({
  goals: z.array(z.string().min(1)).default([]),
  readingGoal: z.number().int().min(1).max(52),
})

export const onboardingSchema = tasteRaterSchema.merge(moodPickerSchema).merge(goalSetterSchema)

export type OnboardingInput = z.infer<typeof onboardingSchema>

