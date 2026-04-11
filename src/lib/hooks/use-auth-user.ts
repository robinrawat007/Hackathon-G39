"use client"

import * as React from "react"
import type { User } from "@supabase/supabase-js"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function useAuthUser(): { user: User | null; isLoading: boolean } {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let supabase: ReturnType<typeof createBrowserSupabaseClient>
    try {
      supabase = createBrowserSupabaseClient()
    } catch {
      // Supabase env vars not configured — treat as unauthenticated
      setIsLoading(false)
      return
    }
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
