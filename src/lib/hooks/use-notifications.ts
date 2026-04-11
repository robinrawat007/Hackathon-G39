"use client"

import * as React from "react"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { NotificationItem } from "@/types/notifications"

const LIMIT = 10

function mapRow(r: Record<string, unknown>): NotificationItem {
  return {
    id: r.id as string,
    type: r.type as NotificationItem["type"],
    title: r.title as string,
    body: r.body as string,
    link: (r.link as string | null) ?? undefined,
    isRead: Boolean(r.is_read),
    createdAt: r.created_at as string,
  }
}

export function useNotifications(userId: string | null) {
  const [items, setItems] = React.useState<NotificationItem[]>([])
  const [loading, setLoading] = React.useState(false)

  // Single client instance for the lifetime of this hook — avoids multiple
  // realtime transports competing over the same WebSocket connection.
  const supabaseRef = React.useRef<ReturnType<typeof createBrowserSupabaseClient> | null>(null)
  function getClient() {
    if (!supabaseRef.current) {
      supabaseRef.current = createBrowserSupabaseClient()
    }
    return supabaseRef.current
  }

  React.useEffect(() => {
    if (!userId) return

    let supabase: ReturnType<typeof createBrowserSupabaseClient>
    try {
      supabase = getClient()
    } catch {
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      const { data } = await supabase
        .from("notifications")
        .select("id,type,title,body,link,is_read,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(LIMIT)
      if (!cancelled) {
        setItems(Array.isArray(data) ? data.map(mapRow) : [])
        setLoading(false)
      }
    }

    void load()

    // Unique name per subscription so React Strict Mode's double-invoke
    // never tries to add listeners to an already-subscribed channel.
    const channelName = `notifications:${userId}:${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => { if (!cancelled) void load() }
      )
      .subscribe()

    return () => {
      cancelled = true
      void supabase.removeChannel(channel)
    }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const unreadCount = items.filter((i) => !i.isRead).length

  const markRead = React.useCallback(
    async (id: string) => {
      if (!userId) return
      let supabase: ReturnType<typeof createBrowserSupabaseClient>
      try { supabase = getClient() } catch { return }
      await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", userId)
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)))
    },
    [userId] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const markAllRead = React.useCallback(async () => {
    if (!userId) return
    let supabase: ReturnType<typeof createBrowserSupabaseClient>
    try { supabase = getClient() } catch { return }
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId)
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })))
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  return { items, loading, unreadCount, markRead, markAllRead }
}
