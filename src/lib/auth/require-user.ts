import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * For use in Server Components and Server Actions — redirects home with `?auth=signin` (global dialog).
 */
export async function requireUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Allow builds/dev without env; treat as unauthenticated.
    redirect("/?auth=signin")
  }
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) redirect("/?auth=signin")
  return data.user
}

/**
 * For use in Route Handlers — returns a 401 JSON response instead of redirecting.
 * Usage: const userOrResponse = await requireUserForApi(); if (userOrResponse instanceof NextResponse) return userOrResponse;
 */
export async function requireUserForApi() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return data.user
}

