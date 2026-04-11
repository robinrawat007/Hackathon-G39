"use client"

import * as React from "react"
import Link from "next/link"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewCard } from "@/components/community/review-card"
import { fetchJson } from "@/lib/api/client-fetch"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

type ReviewEntry = {
  id: string
  userId: string
  userName: string
  avatarUrl: string
  bookTitle: string
  bookSlug: string
  rating: number
  body: string
  createdAt: string
}

type ListEntry = {
  id: string
  title: string
  href: string
  count: string
}

const FEED_PAGE_SIZE = 50

type FeedPage = { reviews: ReviewEntry[]; nextOffset: number; hasMore: boolean }

async function fetchFeedPage(offset: number): Promise<FeedPage> {
  const json = await fetchJson<{ reviews?: ReviewEntry[]; nextOffset?: number; hasMore?: boolean }>(
    `/api/community/feed?limit=${FEED_PAGE_SIZE}&offset=${offset}`,
    { cache: "no-store" }
  )
  return {
    reviews: Array.isArray(json.reviews) ? json.reviews : [],
    nextOffset: typeof json.nextOffset === "number" ? json.nextOffset : offset,
    hasMore: Boolean(json.hasMore),
  }
}

async function fetchLists(): Promise<ListEntry[]> {
  const json = await fetchJson<{ lists?: ListEntry[] }>("/api/community/lists", { cache: "no-store" })
  return Array.isArray(json.lists) ? json.lists : []
}

export function CommunityClient() {
  const { user, isLoading: authLoading } = useAuthUser()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const {
    data: feedPages,
    isPending: feedPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["community-feed"],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    staleTime: 2 * 60 * 1000,
    enabled: mounted,
  })
  const feed = feedPages?.pages.flatMap((p) => p.reviews) ?? []

  const { data: listsData } = useQuery({
    queryKey: ["community-lists"],
    queryFn: fetchLists,
    staleTime: 5 * 60 * 1000,
    enabled: mounted,
  })
  const lists = Array.isArray(listsData) ? listsData : []

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-bg-secondary/50 to-accent/10 p-6 shadow-card md:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 10% 0%, rgba(196,149,106,0.18), transparent 50%), radial-gradient(ellipse 65% 45% at 95% 100%, rgba(139,90,43,0.12), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-h1 text-gradient-hero">The reading room</h1>
            <p className="mt-2 text-sm text-text-muted md:text-base">
              Hot takes, curated lists, people who finish what they start.
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
                className="rounded-lg border border-transparent data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15 data-[state=active]:shadow-[0_0_16px_rgba(139,90,43,0.12)]"
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
                {feedPending || !mounted ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-surface/60" />
                    ))}
                  </div>
                ) : feed.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-8 text-center">
                    <p className="text-sm text-text-muted">No reviews yet — be the first to post one from a book page!</p>
                  </div>
                ) : (
                  <>
                    {feed.map((r) => (
                      <ReviewCard key={r.id} review={r} />
                    ))}
                    {hasNextPage ? (
                      <div className="flex justify-center pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          loading={isFetchingNextPage}
                          onClick={() => void fetchNextPage()}
                        >
                          Load more reviews
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="following">
              <div className="mt-6 rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
                {!authLoading && !user ? (
                  <p className="text-sm text-text-muted">
                    <Link href="/auth/login" className="text-primary hover:text-primary-hover underline underline-offset-2">
                      Sign in
                    </Link>{" "}
                    to follow readers and build your personal feed.
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-text-muted">
                      Follow readers you vibe with — this tab becomes your personal hype reel. Until then, the{" "}
                      <span className="font-medium text-heading">All</span> tab has the goods.
                    </p>
                    <div className="mt-4">
                      <Link href="/browse" className="text-sm font-medium text-primary hover:text-primary-hover">
                        Find your people via books →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="lists">
              <div className="mt-6 space-y-3 rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
                {lists.length === 0 ? (
                  <p className="text-sm text-text-muted">No public lists yet.</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-heading">Public lists</p>
                    <ul className="space-y-3 text-sm">
                      {lists.map((l) => (
                        <li key={l.id} className="flex flex-col gap-0.5 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                          <Link href={l.href} className="font-medium text-heading underline-offset-4 hover:underline">
                            {l.title}
                          </Link>
                          <span className="text-xs text-text-muted">{l.count}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="mt-6 space-y-4">
                {feedPending || !mounted ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-surface/60" />
                    ))}
                  </div>
                ) : feed.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-surface/40 p-8 text-center">
                    <p className="text-sm text-text-muted">No reviews yet.</p>
                  </div>
                ) : (
                  <>
                    {feed.map((r) => (
                      <ReviewCard key={`${r.id}-rev`} review={r} />
                    ))}
                    {hasNextPage ? (
                      <div className="flex justify-center pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          loading={isFetchingNextPage}
                          onClick={() => void fetchNextPage()}
                        >
                          Load more reviews
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
            <div className="font-heading text-h3 text-heading">Recent lists</div>
            {lists.length === 0 ? (
              <p className="mt-3 text-xs text-text-muted">No lists yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {lists.slice(0, 5).map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-2">
                    <Link href={l.href} className="min-w-0 flex-1 truncate font-medium text-heading hover:underline">
                      {l.title}
                    </Link>
                    <span className="shrink-0 text-xs text-text-muted">{l.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
            <div className="font-heading text-h3 text-heading">Looking for a list?</div>
            <p className="mt-2 text-xs text-text-muted">
              Create your own curated list from any book page and share it with the community.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
