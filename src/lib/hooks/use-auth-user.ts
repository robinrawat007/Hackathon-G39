"use client"

import * as React from "react"
import type { User } from "@supabase/supabase-js"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function useAuthUser() {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    let supabase: ReturnType<typeof createBrowserSupabaseClient>
    try {
      supabase = createBrowserSupabaseClient()
    } catch {
      // Supabase env vars not configured — treat as unauthenticated
      return
    }
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null)).catch(() => setUser(null))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return user
}

