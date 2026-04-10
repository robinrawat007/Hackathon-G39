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
  setBookOnShelf: (book: Book, status: ShelfStatus) => void
  updateBookStatus: (bookId: string, status: ShelfStatus) => void
  removeItem: (bookId: string) => void
  reset: () => void
}

function progressForStatus(status: ShelfStatus, previous?: number) {
  if (status === "read") return 100
  if (status === "want_to_read") return 0
  return typeof previous === "number" ? previous : 0
}

export const useShelfStore = create<ShelfState>((set, get) => ({
  items: {},
  setBookOnShelf: (book, status) =>
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
    }),
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
  },
  removeItem: (bookId) =>
    set((state) => {
      const next = { ...state.items }
      delete next[bookId]
      return { items: next }
    }),
  reset: () => set({ items: {} }),
}))
