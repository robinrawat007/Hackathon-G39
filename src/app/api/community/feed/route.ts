import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const MAX_LIMIT = 200

/** GET /api/community/feed — recent public reviews (?limit=&offset=) */
export async function GET(request: Request) {
  return withApiErrorHandling("GET /api/community/feed", async () => {
    const url = new URL(request.url)
    const limitRaw = parseInt(url.searchParams.get("limit") ?? "50", 10)
    const limit = Math.min(Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 50, MAX_LIMIT)
    const offsetRaw = parseInt(url.searchParams.get("offset") ?? "0", 10)
    const offset = Math.max(0, Number.isFinite(offsetRaw) ? offsetRaw : 0)

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("reviews")
      .select("id, rating, body, created_at, user_id, profiles(display_name, username, avatar_url), books(title, slug)")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const reviews = (data ?? []).map((r) => {
      const profile = r.profiles as { display_name?: string; username?: string; avatar_url?: string } | null
      const book = r.books as { title?: string; slug?: string } | null
      return {
        id: r.id,
        userId: r.user_id,
        userName: profile?.display_name ?? profile?.username ?? "Reader",
        avatarUrl: profile?.avatar_url ?? "",
        bookTitle: book?.title ?? "Unknown",
        bookSlug: book?.slug ?? "",
        rating: r.rating as number,
        body: r.body as string,
        createdAt: r.created_at as string,
      }
    })

    return NextResponse.json({
      reviews,
      nextOffset: offset + reviews.length,
      hasMore: reviews.length === limit,
    })
  })
}
