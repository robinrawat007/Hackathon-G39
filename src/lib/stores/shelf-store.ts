"use client"

import { create } from "zustand"

import type { Book, ShelfStatus } from "@/types/book"

export type ShelfEntry = {
  status: ShelfStatus
  progress: number
  userRating?: number
  book: Book
}

interface ShelfState {
  items: Record<string, ShelfEntry>
  /** Replace local shelf from GET /api/shelf (KB-backed books mirrored in DB). */
  hydrateFromServer: (entries: ShelfEntry[]) => void
  setBookOnShelf: (book: Book, status: ShelfStatus) => void
  updateBookStatus: (bookId: string, status: ShelfStatus) => void
  removeItem: (bookId: string) => void
  /** Remove every title from the DB-backed shelf, then clear local state. */
  clearAll: () => Promise<void>
  reset: () => void
}

function progressForStatus(status: ShelfStatus, previous?: number) {
  if (status === "read") return 100
  if (status === "want_to_read") return 0
  return typeof previous === "number" ? previous : 0
}

async function persistShelf(bookId: string, status: ShelfStatus) {
  const res = await fetch("/api/shelf", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, status }),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? "Could not save shelf")
  }
}

async function persistRemove(bookId: string) {
  const res = await fetch(`/api/shelf?bookId=${encodeURIComponent(bookId)}`, {
    method: "DELETE",
    credentials: "same-origin",
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? "Could not remove from shelf")
  }
}

export const useShelfStore = create<ShelfState>((set, get) => ({
  items: {},
  hydrateFromServer: (entries) => {
    const items: Record<string, ShelfEntry> = {}
    for (const e of entries) {
      items[e.book.id] = e
    }
    set({ items })
  },
  setBookOnShelf: (book, status) => {
    const prevEntry = get().items[book.id]
    set((state) => {
      const prev = state.items[book.id]
      return {
        items: {
          ...state.items,
          [book.id]: {
            status,
            progress: progressForStatus(status, prev?.progress),
            userRating: prev?.userRating,
            book,
          },
        },
      }
    })
    void persistShelf(book.id, status).catch(() => {
      // Rollback: restore previous state or remove if it was new
      set((state) => {
        const next = { ...state.items }
        if (prevEntry) {
          next[book.id] = prevEntry
        } else {
          delete next[book.id]
        }
        return { items: next }
      })
    })
  },
  updateBookStatus: (bookId, status) => {
    const existing = get().items[bookId]
    if (!existing) return
    set((state) => ({
      items: {
        ...state.items,
        [bookId]: {
          ...existing,
          status,
          progress: progressForStatus(status, existing.progress),
        },
      },
    }))
    void persistShelf(bookId, status).catch(() => {
      // Rollback to previous status
      set((state) => ({ items: { ...state.items, [bookId]: existing } }))
    })
  },
  removeItem: (bookId) => {
    const prev = get().items[bookId]
    if (!prev) return
    set((state) => {
      const next = { ...state.items }
      delete next[bookId]
      return { items: next }
    })
    void persistRemove(bookId).catch(() => {
      set((state) => ({ items: { ...state.items, [bookId]: prev } }))
    })
  },
  clearAll: async () => {
    const ids = Object.keys(get().items)
    for (const id of ids) {
      try {
        await persistRemove(id)
      } catch {
        /* best-effort clear */
      }
    }
    set({ items: {} })
  },
  reset: () => set({ items: {} }),
}))
