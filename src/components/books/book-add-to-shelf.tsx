"use client"

import * as React from "react"
import Link from "next/link"
import { BookMarked, BookOpen, Check, CheckCircle2, ChevronDown } from "lucide-react"

import type { Book, ShelfStatus } from "@/types/book"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useShelfStore } from "@/lib/stores/shelf-store"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { cn } from "@/lib/utils"

const LABELS: Record<ShelfStatus, string> = {
  want_to_read: "Want to read",
  reading: "Currently reading",
  read: "Read",
}

const STATUSES: ShelfStatus[] = ["want_to_read", "reading", "read"]

const STATUS_META: Record<ShelfStatus, { hint: string; icon: typeof BookMarked }> = {
  want_to_read: { hint: "Save for later", icon: BookMarked },
  reading: { hint: "In progress", icon: BookOpen },
  read: { hint: "Finished", icon: CheckCircle2 },
}

export function BookAddToShelf({ book }: { book: Book }) {
  const { user, isLoading } = useAuthUser()
  const entry = useShelfStore((s) => s.items[book.id])
  const setBookOnShelf = useShelfStore((s) => s.setBookOnShelf)
  const removeItem = useShelfStore((s) => s.removeItem)

  const [open, setOpen] = React.useState(false)
  const [ack, setAck] = React.useState(false)
  const ackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (ackTimer.current) clearTimeout(ackTimer.current)
    }
  }, [])

  const showAck = () => {
    if (ackTimer.current) clearTimeout(ackTimer.current)
    setAck(true)
    ackTimer.current = setTimeout(() => setAck(false), 3200)
  }

  const onPick = (status: ShelfStatus) => {
    setBookOnShelf(book, status)
    showAck()
    setOpen(false)
  }

  if (isLoading) {
    return (
      <div className="mt-5 space-y-2" aria-busy="true" aria-label="Loading shelf controls">
        <div className="h-4 w-28 animate-pulse rounded bg-bg-secondary" />
        <div className="h-11 max-w-sm animate-pulse rounded-md bg-bg-secondary/90" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-5 rounded-xl border border-border/90 bg-gradient-to-br from-surface/80 to-bg-secondary/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm sm:p-5">
        <p className="text-sm leading-relaxed text-text-muted">
          Sign in to save this title to your shelf and sync across devices.
        </p>
        <Link href="/auth/login" className="mt-3 inline-block">
          <Button variant="secondary" size="sm" className="shadow-card">
            Sign in
          </Button>
        </Link>
      </div>
    )
  }

  const triggerLabel = entry ? LABELS[entry.status] : "Choose a reading status"

  return (
    <div className="mt-5 space-y-3">
      <div className="space-y-2">
        <span id={`shelf-label-${book.id}`} className="text-sm font-medium text-heading">
          Shelf
        </span>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              id={`shelf-select-${book.id}`}
              aria-labelledby={`shelf-label-${book.id}`}
              aria-expanded={open}
              className={cn(
                "flex h-11 w-full max-w-sm items-center justify-between gap-3 rounded-md border border-input-border bg-input-bg px-3.5 text-left text-sm text-text shadow-sm transition-colors",
                "hover:border-[var(--color-input-border-hover)] hover:bg-bg/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              )}
            >
              <span className={cn("min-w-0 truncate font-medium", !entry && "text-text-muted")}>{triggerLabel}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform duration-200", open && "rotate-180")}
                aria-hidden
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="w-[min(100vw-2rem,20rem)] max-w-sm border-border/90 bg-bg/95 p-1.5 shadow-hover backdrop-blur-md"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <p className="px-2 pb-1.5 pt-0.5 text-xs font-medium uppercase tracking-[0.08em] text-text-muted">Reading status</p>
            <ul className="space-y-0.5" role="listbox">
              {STATUSES.map((status) => {
                const selected = entry?.status === status
                const Icon = STATUS_META[status].icon
                return (
                  <li key={status} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left text-sm transition-colors",
                        selected
                          ? "bg-primary/12 text-heading"
                          : "text-text hover:bg-surface-hover hover:text-heading"
                      )}
                      onClick={() => onPick(status)}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-surface/80 text-primary">
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{LABELS[status]}</span>
                        <span className="block text-xs text-text-muted">{STATUS_META[status].hint}</span>
                      </span>
                      {selected ? (
                        <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <span className="h-4 w-4 shrink-0" aria-hidden />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      {entry ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/70 bg-surface/50 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">On your shelf</p>
            <p className="mt-0.5 text-sm font-semibold text-heading">{LABELS[entry.status]}</p>
          </div>
          <Button variant="ghost" size="sm" type="button" className="shrink-0 text-text-muted hover:text-heading" onClick={() => removeItem(book.id)}>
            Remove
          </Button>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-text-muted">Pick a status to add this book — you can change it anytime.</p>
      )}

      {ack ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-success" role="status" aria-live="polite">
          <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
          Shelf updated.
        </p>
      ) : null}
    </div>
  )
}
