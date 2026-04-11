"use client"

import * as React from "react"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/books/book-card"
import { useShelfStore } from "@/lib/stores/shelf-store"

function Empty({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface/60 p-10 text-center shadow-card backdrop-blur-sm">
      <div className="font-heading text-h3 text-heading">{title}</div>
      <div className="mt-2 text-sm text-text-muted">{subtitle}</div>
      <div className="mt-6">
        <Link href="/browse">
          <Button variant="secondary" size="md">
            Hunt books →
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function ShelfClient() {
  const items = useShelfStore((s) => s.items)
  const clearAll = useShelfStore((s) => s.clearAll)
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
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-8 shadow-card md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 0% 0%, rgba(196,149,106,0.16), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139,90,43,0.1), transparent)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-h1 text-gradient-hero">Your shelf, your rules</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-muted">
              Stack Want · Reading · Done. Books come from the catalog; your picks save to your account when you&apos;re signed in.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => void clearAll()}
            className="shrink-0 self-start md:self-end"
          >
            Clear shelf
          </Button>
        </div>
      </div>

      <div className="mt-10">
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
                subtitle="Hit Browse or any book page — the + shelf button is always one tap away."
              />
            ) : (
              <div className="mt-4 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {want.map(([id, entry]) => (
                  <div key={id} className="flex h-full min-h-0">
                    <BookCard
                      book={entry.book}
                      variant="default"
                      onAddToShelf={(bookId, status) => {
                        if (bookId === id) updateBookStatus(id, status)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reading">
            {reading.length === 0 ? (
              <Empty title="No current reads" subtitle="Promote something from Want or add a fresh ‘reading now’ pick." />
            ) : (
              <div className="mt-4 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reading.map(([id, entry]) => (
                  <div key={id} className="flex h-full min-h-0">
                    <BookCard
                      book={entry.book}
                      variant="default"
                      onAddToShelf={(bookId, status) => {
                        if (bookId === id) updateBookStatus(id, status)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read">
            {read.length === 0 ? (
              <Empty
                title="No finished books yet"
                subtitle="Mark titles Done to fuel smarter AI picks and your year-end flex."
              />
            ) : (
              <div className="mt-4 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {read.map(([id, entry]) => (
                  <div key={id} className="flex h-full min-h-0">
                    <BookCard
                      book={entry.book}
                      variant="default"
                      onAddToShelf={(bookId, status) => {
                        if (bookId === id) updateBookStatus(id, status)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
