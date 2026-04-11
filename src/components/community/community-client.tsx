"use client"

import * as React from "react"
import { useInfiniteQuery } from "@tanstack/react-query"

import { useAuthDialog } from "@/components/auth/auth-dialog-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewCard } from "@/components/community/review-card"
import { fetchJson } from "@/lib/api/client-fetch"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

type ReviewEntry = {
  id: string
  userId: string
  userName: string
  username?: string
  avatarUrl: string
  bookTitle: string
  bookSlug: string
  rating: number
  body: string
  createdAt: string
  isFollowing?: boolean
}

const FEED_PAGE_SIZE = 50

type FeedPage = { reviews: ReviewEntry[]; nextOffset: number; hasMore: boolean }

async function fetchFeedPage(offset: number, scope: "all" | "following"): Promise<FeedPage> {
  const json = await fetchJson<{
    reviews?: ReviewEntry[]
    nextOffset?: number
    hasMore?: boolean
  }>(`/api/community/feed?limit=${FEED_PAGE_SIZE}&offset=${offset}&scope=${scope}`, { cache: "no-store" })
  return {
    reviews: Array.isArray(json.reviews) ? json.reviews : [],
    nextOffset: typeof json.nextOffset === "number" ? json.nextOffset : offset,
    hasMore: Boolean(json.hasMore),
  }
}

export function CommunityClient() {
  const { openSignIn } = useAuthDialog()
  const { user, isLoading: authLoading } = useAuthUser()
  const [mounted, setMounted] = React.useState(false)
  const [mainTab, setMainTab] = React.useState("all")

  React.useEffect(() => setMounted(true), [])

  const feedScope: "all" | "following" = mainTab === "following" ? "following" : "all"

  const {
    data: feedPages,
    isPending: feedPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["community-feed", feedScope],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam as number, feedScope),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    staleTime: 2 * 60 * 1000,
    enabled: mounted && (feedScope !== "following" || Boolean(user)),
  })
  const feed = feedPages?.pages.flatMap((p) => p.reviews) ?? []

  const followingEmpty = feedScope === "following" && !feedPending && user && feed.length === 0

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
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-heading text-h1 text-gradient-hero">The reading room</h1>
            <p className="mt-2 text-sm text-text-muted md:text-base">
              Hot takes, reader follows, and people who finish what they start.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Tabs value={mainTab} onValueChange={setMainTab}>
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
                    <ReviewCard key={r.id} review={r} viewerUserId={user?.id} />
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
            <div className="mt-6 space-y-4">
              {!authLoading && !user ? (
                <div className="rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
                  <p className="text-sm text-text-muted">
                    <button
                      type="button"
                      className="text-primary underline underline-offset-2 hover:text-primary-hover"
                      onClick={() => openSignIn({ redirectTo: "/community" })}
                    >
                      Sign in
                    </button>{" "}
                    to follow readers and see their reviews here.
                  </p>
                </div>
              ) : feedPending || !mounted ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-surface/60" />
                  ))}
                </div>
              ) : followingEmpty ? (
                <div className="rounded-2xl border border-border/80 bg-surface/50 p-6 shadow-card backdrop-blur-sm">
                  <p className="text-sm text-text-muted">
                    You are not following anyone yet, or they have not posted reviews. Use{" "}
                    <span className="font-medium text-heading">Follow</span> on review cards in the{" "}
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => setMainTab("all")}
                    >
                      All
                    </button>{" "}
                    tab, or visit reader profiles.
                  </p>
                </div>
              ) : (
                <>
                  {feed.map((r) => (
                    <ReviewCard key={r.id} review={r} viewerUserId={user?.id} />
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
                    <ReviewCard key={`${r.id}-rev`} review={r} viewerUserId={user?.id} />
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
    </div>
  )
}
