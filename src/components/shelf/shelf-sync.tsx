"use client"

import * as React from "react"

import { ApiRequestError, fetchJson } from "@/lib/api/client-fetch"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import type { ShelfEntry } from "@/lib/stores/shelf-store"
import { useShelfStore } from "@/lib/stores/shelf-store"

/** Loads shelf rows from Supabase when a session exists; clears local cache on sign-out. */
export function ShelfSync() {
  const { user, isLoading } = useAuthUser()
  const hydrateFromServer = useShelfStore((s) => s.hydrateFromServer)
  const reset = useShelfStore((s) => s.reset)

  React.useEffect(() => {
    if (isLoading) return
    if (!user) {
      reset()
      return
    }

    let cancelled = false
    void (async () => {
      try {
        const data = await fetchJson<{ items?: ShelfEntry[] }>("/api/shelf", { credentials: "same-origin" })
        if (cancelled) return
        if (Array.isArray(data.items)) hydrateFromServer(data.items)
      } catch (e) {
        if (!cancelled && e instanceof ApiRequestError) {
          console.warn("[ShelfSync]", e.message)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, isLoading, hydrateFromServer, reset])

  return null
}
