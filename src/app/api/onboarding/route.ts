import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { requireUserForApi } from "@/lib/auth/require-user"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { rateLimitResponse } from "@/lib/rate-limit"
import { onboardingSchema } from "@/lib/validations/onboarding.schema"

async function ensureProfile(userId: string, email: string | undefined) {
  const admin = createSupabaseAdminClient()
  const { data: existing } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle()
  if (existing) return
  const username = `r_${userId.replace(/-/g, "")}`
  const { error } = await admin.from("profiles").insert({
    id: userId,
    username,
    display_name: email?.split("@")[0] ?? "Reader",
  })
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(error.message)
}

export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/onboarding", async () => {
    const limited = await rateLimitResponse(request, "onboarding", { max: 10, window: "1 m" })
    if (limited) return limited

    const userOrResponse = await requireUserForApi()
    if (userOrResponse instanceof NextResponse) return userOrResponse
    const user = userOrResponse

    const json = (await request.json().catch(() => null)) as unknown
    const parsed = onboardingSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Server misconfiguration (missing SUPABASE_SERVICE_ROLE_KEY)" }, { status: 503 })
    }

    try {
      await ensureProfile(user.id, user.email ?? undefined)

      const supabase = createServerSupabaseClient()

      // Persist taste profile (moods, goals, ratedBooks)
      const { error: tasteErr } = await supabase.from("taste_profiles").upsert(
        {
          user_id: user.id,
          rated_books: parsed.data.ratedBooks,
          moods: parsed.data.moods,
          goals: parsed.data.goals,
          last_updated: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      if (tasteErr) return NextResponse.json({ error: tasteErr.message }, { status: 500 })

      // Persist reading goal to profile
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ reading_goal: parsed.data.readingGoal })
        .eq("id", user.id)
      if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })

      return NextResponse.json({ ok: true })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save onboarding"
      return NextResponse.json({ error: msg }, { status: 500 })
    }
  })
}
