import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { requireUserForApi } from "@/lib/auth/require-user"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

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

/** GET /api/preferences — load user's moods and goals from taste_profiles */
export async function GET() {
  return withApiErrorHandling("GET /api/preferences", async () => {
    const userOrResponse = await requireUserForApi()
    if (userOrResponse instanceof NextResponse) return userOrResponse
    const user = userOrResponse

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("taste_profiles")
      .select("moods, goals, rated_books")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      moods: data?.moods ?? [],
      goals: data?.goals ?? [],
      ratedBooks: data?.rated_books ?? [],
    })
  })
}

/** POST /api/preferences — update moods (and optionally goals) */
export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/preferences", async () => {
    const userOrResponse = await requireUserForApi()
    if (userOrResponse instanceof NextResponse) return userOrResponse
    const user = userOrResponse

    const json = (await request.json().catch(() => null)) as unknown
    if (!json || typeof json !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    const body = json as Record<string, unknown>

    const moods = Array.isArray(body.moods) ? (body.moods as string[]) : undefined
    const goals = Array.isArray(body.goals) ? (body.goals as string[]) : undefined

    if (moods === undefined && goals === undefined) {
      return NextResponse.json({ error: "Provide moods or goals to update" }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Server misconfiguration (missing SUPABASE_SERVICE_ROLE_KEY)" }, { status: 503 })
    }

    try {
      await ensureProfile(user.id, user.email ?? undefined)

      const supabase = createServerSupabaseClient()
      const update: Record<string, unknown> = { last_updated: new Date().toISOString() }
      if (moods !== undefined) update.moods = moods
      if (goals !== undefined) update.goals = goals

      const { error } = await supabase.from("taste_profiles").upsert(
        { user_id: user.id, ...update },
        { onConflict: "user_id" }
      )
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      return NextResponse.json({ ok: true })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save preferences"
      return NextResponse.json({ error: msg }, { status: 500 })
    }
  })
}
