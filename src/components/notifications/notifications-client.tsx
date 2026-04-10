"use client"

import * as React from "react"

import { useNotifications } from "@/lib/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function groupLabel(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return "Today"
  if (diffDays <= 7) return "This Week"
  return "Earlier"
}

export function NotificationsClient({ userId }: { userId: string }) {
  const { items, unreadCount, markRead, markAllRead } = useNotifications(userId)

  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof items>()
    for (const n of items) {
      const k = groupLabel(n.createdAt)
      const arr = map.get(k) ?? []
      arr.push(n)
      map.set(k, arr)
    }
    return Array.from(map.entries())
  }, [items])

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-h1 text-heading">Notifications</h1>
          <div className="mt-2 text-sm text-text-muted">
            <Badge variant="secondary">{unreadCount} unread</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => void markAllRead()}>
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {items.length === 0 ? (
          <div className="rounded-md border border-border bg-surface p-10 text-center shadow-card">
            <div className="font-heading text-h3 text-heading">You're all caught up!</div>
            <div className="mt-2 text-sm text-text-muted">Browse to find something great to read next.</div>
            <div className="mt-6">
              <Button variant="secondary" size="md" onClick={() => (window.location.href = "/browse")}>
                Browse books
              </Button>
            </div>
          </div>
        ) : (
          grouped.map(([label, list]) => (
            <section key={label} className="space-y-2">
              <div className="text-sm font-medium text-heading">{label}</div>
              <div className="space-y-2">
                {list.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      void markRead(n.id)
                      if (n.link) window.location.href = n.link
                    }}
                    className="w-full rounded-md border border-border bg-surface p-4 text-left shadow-card hover:bg-surface-hover"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-heading">{n.title}</div>
                      {!n.isRead ? <Badge variant="destructive">Unread</Badge> : null}
                    </div>
                    <div className="mt-1 text-sm text-text-muted">{n.body}</div>
                    <div className="mt-2 text-xs text-text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

