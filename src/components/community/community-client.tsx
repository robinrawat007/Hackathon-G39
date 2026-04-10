"use client"

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
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-bg-secondary/50 to-accent/10 p-6 shadow-card md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 10% 0%, rgba(99,179,237,0.22), transparent 50%), radial-gradient(ellipse 65% 45% at 95% 100%, rgba(159,122,234,0.16), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-h1 text-gradient-hero">The reading room</h1>
            <p className="mt-2 text-sm text-text-muted md:text-base">
              Hot takes, curated lists, people who finish what they start. Sample feed for now — layout stays legit while
              live social pipes land.
            </p>
          </div>
          <Link
            href="/community/lists"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-bg-secondary/80 px-4 py-2.5 text-sm font-medium text-heading shadow-card backdrop-blur-sm transition-colors hover:border-primary hover:bg-surface"
          >
            Browse lists →
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <Tabs defaultValue="all">
            <TabsList className="h-auto min-h-0 w-full flex-wrap justify-start gap-1 bg-transparent p-0 py-1">
              <TabsTrigger
                value="all"
                className="rounded-lg border border-transparent data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15 data-[state=active]:shadow-[0_0_20px_rgba(99,179,237,0.12)]"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-lg border border-transparent data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15"
              >
                Following
              </TabsTrigger>
              <TabsTrigger
                value="lists"
                className="rounded-lg border border-transparent data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15"
              >
                Lists
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg border border-transparent data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="mt-6 space-y-4">
                {FEED.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="following">
              <div className="mt-6 rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
                <p className="text-sm text-text-muted">
                  Follow readers you vibe with — this tab becomes your personal hype reel. Until then, the{" "}
                  <span className="font-medium text-heading">All</span> tab has the goods.
                </p>
                <div className="mt-4">
                  <Link href="/browse" className="text-sm font-medium text-primary hover:text-primary-hover">
                    Find your people via books →
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lists">
              <div className="mt-6 space-y-3 rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
                <p className="text-sm font-medium text-heading">Starter lists — open and run</p>
                <ul className="space-y-3 text-sm">
                  {TRENDING_LISTS.map((l) => (
                    <li key={l.href} className="flex flex-col gap-0.5 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <Link href={l.href} className="font-medium text-heading underline-offset-4 hover:underline">
                        {l.title}
                      </Link>
                      <span className="text-xs text-text-muted">{l.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mt-6 space-y-4">
                {FEED.map((r) => (
                  <ReviewCard key={`${r.id}-rev`} review={r} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
            <div className="font-heading text-h3 text-heading">Top readers</div>
            <p className="mt-1 text-xs text-text-muted">Sample leaderboard — real ranks ship with profiles.</p>
            <ul className="mt-4 space-y-3 text-sm">
              {TOP_READERS.map((r, i) => (
                <li key={r.handle} className="flex items-center justify-between gap-2">
                  <span className="w-5 text-text-muted">{i + 1}</span>
                  <Link href={`/profile/${r.handle}`} className="min-w-0 flex-1 truncate font-medium text-heading hover:underline">
                    {r.name}
                  </Link>
                  <span className="shrink-0 text-xs text-text-muted">{r.books} books</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
            <div className="font-heading text-h3 text-heading">Lists on fire</div>
            <ul className="mt-4 space-y-3 text-sm">
              {TRENDING_LISTS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-medium text-heading hover:underline">
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
