import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_NAME, absoluteUrl } from "@/lib/site"
import { createServerSupabaseClient } from "@/lib/supabase/server"

async function fetchProfile(handle: string) {
  const supabase = createServerSupabaseClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, reading_goal, created_at")
    .eq("username", handle)
    .maybeSingle()

  if (!profile) return null

  const userId = profile.id as string

  // Stats: books read, avg rating from reviews, follower count
  const [{ count: booksRead }, { count: followers }, { data: reviews }, { data: recentShelf }] = await Promise.all([
    supabase.from("shelf_items").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "read"),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
    supabase
      .from("reviews")
      .select("rating, body, created_at, books(title, slug)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("shelf_items")
      .select("status, added_at, books(title, slug)")
      .eq("user_id", userId)
      .order("added_at", { ascending: false })
      .limit(5),
  ])

  const allRatings = (reviews ?? []).map((r) => r.rating as number).filter(Boolean)
  const avgRating =
    allRatings.length > 0
      ? Math.round((allRatings.reduce((s, r) => s + r, 0) / allRatings.length) * 10) / 10
      : null

  return {
    profile,
    stats: {
      booksRead: booksRead ?? 0,
      avgRating,
      followers: followers ?? 0,
    },
    reviews: (reviews ?? []).map((r) => {
      const book = r.books as { title?: string; slug?: string } | null
      return { rating: r.rating as number, body: r.body as string, bookTitle: book?.title ?? "", bookSlug: book?.slug ?? "" }
    }),
    recentActivity: (recentShelf ?? []).map((item) => {
      const book = item.books as { title?: string } | null
      const title = book?.title ?? "a book"
      const status = item.status as string
      const label =
        status === "read" ? `Finished "${title}"` :
        status === "reading" ? `Started reading "${title}"` :
        `Added "${title}" to Want to Read`
      return { label, addedAt: item.added_at as string }
    }),
  }
}

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params
  const handle = username.replace(/^@/, "")
  return {
    title: `@${handle}`,
    description: `Reader profile for @${handle} on ${SITE_NAME} — shelves and community activity.`,
    alternates: { canonical: absoluteUrl(`/profile/${encodeURIComponent(handle)}`) },
    openGraph: {
      title: `@${handle} · ${SITE_NAME}`,
      description: `See what @${handle} is reading and recommending.`,
      url: absoluteUrl(`/profile/${encodeURIComponent(handle)}`),
      type: "website",
    },
    twitter: { card: "summary", title: `@${handle} · ${SITE_NAME}` },
  }
}

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const { username } = await props.params
  const handle = username.replace(/^@/, "")
  const result = await fetchProfile(handle)

  if (!result) notFound()

  const { profile, stats, reviews, recentActivity } = result
  const displayName = (profile.display_name as string | null) ?? `@${handle}`
  const profileUrl = absoluteUrl(`/profile/${encodeURIComponent(handle)}`)

  return (
    <div className="min-h-full bg-transparent text-text">
      <JsonLd
        id="profile-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: profileUrl,
          name: displayName,
          description: `Public reader profile for @${handle}.`,
          mainEntity: { "@type": "Person", name: displayName, identifier: handle },
        }}
      />
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="rounded-2xl border border-border/80 bg-surface/60 p-8 shadow-card backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-h1 text-heading">{displayName}</h1>
              <div className="mt-0.5 text-sm text-text-muted">@{handle}</div>
              {profile.bio ? (
                <p className="mt-2 max-w-xl text-sm text-text-muted">{profile.bio as string}</p>
              ) : null}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-bg-secondary/80 p-5">
              <div className="text-xs text-text-muted">Books read</div>
              <div className="mt-1 font-heading text-h2 text-heading tabular-nums">{stats.booksRead}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-bg-secondary/80 p-5">
              <div className="text-xs text-text-muted">Avg rating given</div>
              <div className="mt-1 font-heading text-h2 text-heading tabular-nums">
                {stats.avgRating !== null ? `${stats.avgRating}★` : "—"}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-bg-secondary/80 p-5">
              <div className="text-xs text-text-muted">Followers</div>
              <div className="mt-1 font-heading text-h2 text-heading tabular-nums">{stats.followers}</div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="mt-10">
            <div className="font-heading text-h3 text-heading">Recent activity</div>
            {recentActivity.length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">No activity yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                {recentActivity.map((a, i) => (
                  <li key={i}>{a.label}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent reviews */}
          {reviews.length > 0 && (
            <div className="mt-10">
              <div className="font-heading text-h3 text-heading">Recent reviews</div>
              <div className="mt-4 space-y-3">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-bg-secondary/80 p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/book/${r.bookSlug}`} className="text-sm font-medium text-heading hover:underline">
                        {r.bookTitle}
                      </Link>
                      <span className="text-xs text-primary">{r.rating}★</span>
                    </div>
                    <p className="mt-1 text-sm text-text-muted line-clamp-2">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/community">
              <Button variant="secondary" size="sm">Community feed</Button>
            </Link>
            <Link href="/browse">
              <Button variant="ghost" size="sm">Browse books</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
