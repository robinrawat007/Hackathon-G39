import { NextResponse } from "next/server"

import { rateLimitResponse } from "@/lib/rate-limit"
import { onboardingSchema } from "@/lib/validations/onboarding.schema"

export async function POST(request: Request) {
  const limited = await rateLimitResponse(request, "onboarding", { max: 10, window: "1 m" })
  if (limited) return limited

  const json = (await request.json().catch(() => null)) as unknown
  const parsed = onboardingSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  // Supabase persistence will be added once schema + RLS are in place.
  return NextResponse.json({ ok: true })
}

