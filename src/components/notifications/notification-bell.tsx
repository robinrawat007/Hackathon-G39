"use client"

import Link from "next/link"
import { Bell } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/lib/hooks/use-notifications"

export function NotificationBell({ userId }: { userId: string }) {
  const { items, unreadCount, markRead } = useNotifications(userId)

  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="sm" aria-label="Notifications" leftIcon={<Bell className="h-4 w-4" />}>
            Alerts
          </Button>
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-error px-1.5 py-0.5 text-[10px] text-heading">
              {badgeLabel}
            </span>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-[calc(100vw-3rem)]">
        <div className="flex items-center justify-between">
          <div className="font-heading text-h3 text-heading">Notifications</div>
          <Link href="/notifications" className="text-sm text-primary hover:text-primary-hover">
            View all →
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {items.length === 0 ? (
            <div className="rounded-md border border-border bg-bg-secondary p-4 text-sm text-text-muted">
              No notifications yet.
            </div>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  void markRead(n.id)
                  if (n.link) window.location.href = n.link
                }}
                className="w-full rounded-md border border-border bg-surface p-3 text-left hover:bg-surface-hover"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-heading">{n.title}</div>
                  {!n.isRead ? <Badge variant="destructive">New</Badge> : null}
                </div>
                <div className="mt-1 text-xs text-text-muted">{n.body}</div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

