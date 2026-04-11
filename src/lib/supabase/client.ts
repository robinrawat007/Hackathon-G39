"use client"

import { createBrowserClient } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createBrowserSupabaseClient() {
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  // createBrowserClient from @supabase/ssr stores the session in cookies,
  // not localStorage — so server components can read it via createServerClient.
  return createBrowserClient(url, anonKey)
}
