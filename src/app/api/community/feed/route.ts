import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

/** GET /api/community/feed — recent public reviews */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10) || 20, 50)

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, user_id, profiles(display_name, username, avatar_url), books(title, slug)")
    .order("created_at", { ascending: false })
    .limit(limit)

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

  return NextResponse.json({ reviews })
}
