import { createSupabaseAdminClient } from "@/lib/supabase/admin"

/**
 * Ensures a `profiles` row exists for this auth user (same logic as onboarding POST).
 * Requires `SUPABASE_SERVICE_ROLE_KEY`.
 */
export async function ensureProfileRow(
  userId: string,
  email: string | undefined
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: "Server misconfiguration (missing SUPABASE_SERVICE_ROLE_KEY)" }
  }
  try {
    const admin = createSupabaseAdminClient()
    const { data: existing } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle()
    if (existing) return { ok: true }
    const username = `r_${userId.replace(/-/g, "")}`
    const { error } = await admin.from("profiles").insert({
      id: userId,
      username,
      display_name: email?.split("@")[0] ?? "Reader",
    })
    if (error && !/duplicate|unique/i.test(error.message)) {
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
