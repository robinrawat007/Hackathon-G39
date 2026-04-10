"use client"

import * as React from "react"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/books/book-card"
import { useShelfStore } from "@/lib/stores/shelf-store"

function Empty({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-10 text-center shadow-card">
      <div className="font-heading text-h3 text-heading">{title}</div>
      <div className="mt-2 text-sm text-text-muted">{subtitle}</div>
      <div className="mt-6">
        <Link href="/browse">
          <Button variant="secondary" size="md">
            Browse books
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function ShelfClient() {
  const items = useShelfStore((s) => s.items)
  const reset = useShelfStore((s) => s.reset)
  const updateBookStatus = useShelfStore((s) => s.updateBookStatus)

  const want = React.useMemo(
    () => Object.entries(items).filter(([, v]) => v.status === "want_to_read"),
    [items]
  )
  const reading = React.useMemo(
    () => Object.entries(items).filter(([, v]) => v.status === "reading"),
    [items]
  )
  const read = React.useMemo(
    () => Object.entries(items).filter(([, v]) => v.status === "read"),
    [items]
  )

  return (
    <div className="container pb-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-h1 text-heading">Your shelf</h1>
          <div className="mt-2 max-w-2xl text-sm text-text-muted">
            Organize titles into Want to Read, Reading, and Read. Your picks are stored in this browser for now; sign in to
            sync with your account when it&apos;s connected.
          </div>
        </div>
        <Button variant="ghost" size="sm" type="button" onClick={() => reset()}>
          Clear local shelf
        </Button>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="want">
          <TabsList>
            <TabsTrigger value="want">Want to Read ({want.length})</TabsTrigger>
            <TabsTrigger value="reading">Reading ({reading.length})</TabsTrigger>
            <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="want">
            {want.length === 0 ? (
              <Empty
                title="Nothing here yet"
                subtitle="Add books from Browse or a book page — quick-add buttons appear on every card."
              />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {want.map(([id, entry]) => (
                  <BookCard
                    key={id}
                    book={entry.book}
                    variant="default"
                    onAddToShelf={(bookId, status) => {
                      if (bookId === id) updateBookStatus(id, status)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reading">
            {reading.length === 0 ? (
              <Empty title="No current reads" subtitle="Move a title from Want to Read or add one as Currently Reading." />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reading.map(([id, entry]) => (
                  <BookCard
                    key={id}
                    book={entry.book}
                    variant="default"
                    onAddToShelf={(bookId, status) => {
                      if (bookId === id) updateBookStatus(id, status)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read">
            {read.length === 0 ? (
              <Empty
                title="No finished books yet"
                subtitle="Mark books as Read to build history for analytics and smarter picks."
              />
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {read.map(([id, entry]) => (
                  <BookCard
                    key={id}
                    book={entry.book}
                    variant="default"
                    onAddToShelf={(bookId, status) => {
                      if (bookId === id) updateBookStatus(id, status)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
