"use client"

import * as React from "react"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { NotificationItem } from "@/types/notifications"

const LIMIT = 10

export function useNotifications(userId: string | null) {
  const [items, setItems] = React.useState<NotificationItem[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!userId) return
    let supabase: ReturnType<typeof createBrowserSupabaseClient>
    try {
      supabase = createBrowserSupabaseClient()
    } catch {
      return
    }

    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from("notifications")
        .select("id,type,title,body,link,is_read,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(LIMIT)
      setItems(
        Array.isArray(data)
          ? data.map((r) => ({
              id: r.id as string,
              type: r.type as NotificationItem["type"],
              title: r.title as string,
              body: r.body as string,
              link: (r.link as string | null) ?? undefined,
              isRead: Boolean(r.is_read),
              createdAt: r.created_at as string,
            }))
          : []
      )
      setLoading(false)
    }

    void load()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => void load()
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [userId])

  const unreadCount = items.filter((i) => !i.isRead).length

  const markRead = React.useCallback(
    async (id: string) => {
      if (!userId) return
      let supabase: ReturnType<typeof createBrowserSupabaseClient>
      try { supabase = createBrowserSupabaseClient() } catch { return }
      await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", userId)
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)))
    },
    [userId]
  )

  const markAllRead = React.useCallback(async () => {
    if (!userId) return
    let supabase: ReturnType<typeof createBrowserSupabaseClient>
    try { supabase = createBrowserSupabaseClient() } catch { return }
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId)
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })))
  }, [userId])

  return { items, loading, unreadCount, markRead, markAllRead }
}

