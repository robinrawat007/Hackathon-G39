"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function useSignOut() {
  const router = useRouter()

  return React.useCallback(async () => {
    try {
      const supabase = createBrowserSupabaseClient()
      await supabase.auth.signOut()
    } catch {
      /* Supabase not configured — still refresh to clear any stale UI */
    }
    router.refresh()
  }, [router])
}
