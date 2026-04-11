import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const MAX_LIMIT = 200

function followStatusForUsers(reviewUserIds: string[], rows: { following_id: string }[] | null): Record<string, boolean> {
  const set = new Set((rows ?? []).map((r) => r.following_id))
  const out: Record<string, boolean> = {}
  for (const id of reviewUserIds) {
    out[id] = set.has(id)
  }
  return out
}

/** GET /api/community/feed — reviews (?limit=&offset=&scope=all|following) */
export async function GET(request: Request) {
  return withApiErrorHandling("GET /api/community/feed", async () => {
    const url = new URL(request.url)
    const limitRaw = parseInt(url.searchParams.get("limit") ?? "50", 10)
    const limit = Math.min(Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 50, MAX_LIMIT)
    const offsetRaw = parseInt(url.searchParams.get("offset") ?? "0", 10)
    const offset = Math.max(0, Number.isFinite(offsetRaw) ? offsetRaw : 0)
    const scope = url.searchParams.get("scope") ?? "all"

    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (scope === "following") {
      if (!user) {
        return NextResponse.json({
          reviews: [],
          nextOffset: 0,
          hasMore: false,
        })
      }

      const { data: followRows, error: followErr } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id)

      if (followErr) return NextResponse.json({ error: followErr.message }, { status: 500 })

      const followingIds = [...new Set((followRows ?? []).map((r) => r.following_id as string))]
      if (followingIds.length === 0) {
        return NextResponse.json({
          reviews: [],
          nextOffset: 0,
          hasMore: false,
        })
      }

      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, body, created_at, user_id, profiles(display_name, username, avatar_url), books(title, slug)")
        .in("user_id", followingIds)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const raw = data ?? []
      const reviewUserIds = [...new Set(raw.map((r) => r.user_id as string))]

      let followRowsForStatus: { following_id: string }[] | null = null
      if (user && reviewUserIds.length > 0) {
        const fr = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id)
          .in("following_id", reviewUserIds)
        followRowsForStatus = fr.data
      }

      const followStatus = user ? followStatusForUsers(reviewUserIds, followRowsForStatus) : {}

      const reviews = raw.map((r) => {
        const profile = r.profiles as { display_name?: string; username?: string; avatar_url?: string } | null
        const book = r.books as { title?: string; slug?: string } | null
        const uid = r.user_id as string
        return {
          id: r.id as string,
          userId: uid,
          userName: profile?.display_name ?? profile?.username ?? "Reader",
          username: profile?.username ?? "",
          avatarUrl: profile?.avatar_url ?? "",
          bookTitle: book?.title ?? "Unknown",
          bookSlug: book?.slug ?? "",
          rating: r.rating as number,
          body: r.body as string,
          createdAt: r.created_at as string,
          isFollowing: user ? Boolean(followStatus[uid]) : undefined,
        }
      })

      return NextResponse.json({
        reviews,
        nextOffset: offset + reviews.length,
        hasMore: reviews.length === limit,
      })
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, body, created_at, user_id, profiles(display_name, username, avatar_url), books(title, slug)")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const raw = data ?? []
    const reviewUserIds = [...new Set(raw.map((r) => r.user_id as string))]

    let followRowsForStatus: { following_id: string }[] | null = null
    if (user && reviewUserIds.length > 0) {
      const fr = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id)
        .in("following_id", reviewUserIds)
      followRowsForStatus = fr.data
    }

    const followStatus = user ? followStatusForUsers(reviewUserIds, followRowsForStatus) : {}

    const reviews = raw.map((r) => {
      const profile = r.profiles as { display_name?: string; username?: string; avatar_url?: string } | null
      const book = r.books as { title?: string; slug?: string } | null
      const uid = r.user_id as string
      return {
        id: r.id as string,
        userId: uid,
        userName: profile?.display_name ?? profile?.username ?? "Reader",
        username: profile?.username ?? "",
        avatarUrl: profile?.avatar_url ?? "",
        bookTitle: book?.title ?? "Unknown",
        bookSlug: book?.slug ?? "",
        rating: r.rating as number,
        body: r.body as string,
        createdAt: r.created_at as string,
        isFollowing: user ? Boolean(followStatus[uid]) : undefined,
      }
    })

    return NextResponse.json({
      reviews,
      nextOffset: offset + reviews.length,
      hasMore: reviews.length === limit,
    })
  })
}
