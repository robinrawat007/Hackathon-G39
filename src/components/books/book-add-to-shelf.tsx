"use client"

import * as React from "react"

import type { Book, ShelfStatus } from "@/types/book"
import { Button } from "@/components/ui/button"
import { useShelfStore } from "@/lib/stores/shelf-store"

const LABELS: Record<ShelfStatus, string> = {
  want_to_read: "Want to Read",
  reading: "Currently Reading",
  read: "Read",
}

export function BookAddToShelf({ book }: { book: Book }) {
  const entry = useShelfStore((s) => s.items[book.id])
  const setBookOnShelf = useShelfStore((s) => s.setBookOnShelf)
  const removeItem = useShelfStore((s) => s.removeItem)

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

  const selectValue = entry ? entry.status : "__none__"

  return (
    <div className="mt-5">
      <label htmlFor={`shelf-select-${book.id}`} className="text-sm text-text-muted">
        Add to shelf
      </label>
      <select
        id={`shelf-select-${book.id}`}
        className="mt-2 h-11 w-full max-w-sm rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value
          if (v === "__none__") return
          setBookOnShelf(book, v as ShelfStatus)
          showAck()
        }}
      >
        <option value="__none__">Choose a shelf…</option>
        <option value="want_to_read">{LABELS.want_to_read}</option>
        <option value="reading">{LABELS.reading}</option>
        <option value="read">{LABELS.read}</option>
      </select>
      {entry ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted">
            On your shelf: <span className="text-heading">{LABELS[entry.status]}</span> (this browser only until you sign in).
          </span>
          <Button variant="ghost" size="sm" type="button" onClick={() => removeItem(book.id)}>
            Remove
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-text-muted">
          Pick a status to save this title locally. Sign in later to sync across devices.
        </p>
      )}
      {ack ? (
        <p className="mt-2 text-xs text-success" role="status" aria-live="polite">
          Shelf updated.
        </p>
      ) : null}
    </div>
  )
}
