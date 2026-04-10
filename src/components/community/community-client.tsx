"use client"

import * as React from "react"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewCard } from "@/components/community/review-card"

const FEED = [
  {
    id: "p1",
    userId: "u1",
    userName: "Sam R.",
    avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s64",
    bookTitle: "The Dispossessed",
    bookSlug: "the-dispossessed-ursula-k-le-guin",
    rating: 5,
    body: "I wanted thoughtful sci‑fi with big ethical questions and a calm, elegant voice. ShelfAI recommended this and it genuinely changed how I think about “utopia” stories.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    likesCount: 14,
  },
  {
    id: "p2",
    userId: "u2",
    userName: "Nina P.",
    avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s64",
    bookTitle: "The Thursday Murder Club",
    bookSlug: "the-thursday-murder-club-richard-osman",
    rating: 4,
    body: "Asked for something cozy and funny but still clever. The banter is fantastic and the mystery actually holds together.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    likesCount: 29,
  },
] as const

const TOP_READERS = [
  { name: "Maya L.", books: 18, handle: "maya_reads" },
  { name: "Jordan K.", books: 14, handle: "jk_stacks" },
  { name: "Priya S.", books: 12, handle: "priya_books" },
] as const

const TRENDING_LISTS = [
  { title: "Short sci‑fi that still hits hard", href: "/community/lists/1", count: "24 books" },
  { title: "Cozy mysteries for late nights", href: "/community/lists/2", count: "18 books" },
] as const

export function CommunityClient() {
  const [liked, setLiked] = React.useState<Record<string, boolean>>({})

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-h1 text-heading">Community</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Discover reviews, lists, and highlights from readers. The feed below is curated sample content so the layout
            stays useful before live data is connected.
          </p>
        </div>
        <div className="text-sm">
          <Link href="/community/lists" className="text-primary hover:text-primary-hover">
            Browse lists →
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="lists">Lists</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="mt-4 space-y-4">
                {FEED.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    onLike={(reviewId) => setLiked((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }))}
                    isLiked={!!liked[r.id]}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="following">
              <div className="mt-4 rounded-md border border-border bg-surface p-6 shadow-card">
                <p className="text-sm text-text-muted">
                  Follow readers to tailor this tab. Until then, browse the <span className="text-heading">All</span> tab
                  for featured posts.
                </p>
                <div className="mt-4">
                  <Link href="/browse">
                    <span className="text-sm font-medium text-primary hover:text-primary-hover">Find people via books →</span>
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lists">
              <div className="mt-4 space-y-3 rounded-md border border-border bg-surface p-6 shadow-card">
                <p className="text-sm text-text-muted">Starter lists you can open today:</p>
                <ul className="space-y-2 text-sm">
                  {TRENDING_LISTS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-heading underline-offset-4 hover:underline">
                        {l.title}
                      </Link>
                      <span className="text-text-muted"> · {l.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mt-4 space-y-4">
                {FEED.map((r) => (
                  <ReviewCard
                    key={`${r.id}-rev`}
                    review={r}
                    onLike={(reviewId) => setLiked((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }))}
                    isLiked={!!liked[r.id]}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-border bg-surface p-6 shadow-card">
            <div className="font-heading text-h3 text-heading">Top readers (sample)</div>
            <p className="mt-2 text-xs text-text-muted">Illustrative ranking; real leaderboards ship with profiles.</p>
            <ul className="mt-4 space-y-3 text-sm">
              {TOP_READERS.map((r, i) => (
                <li key={r.handle} className="flex items-center justify-between gap-2">
                  <span className="text-text-muted">{i + 1}.</span>
                  <Link href={`/profile/${r.handle}`} className="min-w-0 flex-1 truncate text-heading hover:underline">
                    {r.name}
                  </Link>
                  <span className="shrink-0 text-xs text-text-muted">{r.books} books</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-border bg-surface p-6 shadow-card">
            <div className="font-heading text-h3 text-heading">Trending lists</div>
            <ul className="mt-4 space-y-3 text-sm">
              {TRENDING_LISTS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-heading hover:underline">
                    {l.title}
                  </Link>
                  <div className="text-xs text-text-muted">{l.count}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
