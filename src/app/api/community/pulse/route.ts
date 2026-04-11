import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { createServerSupabaseClient } from "@/lib/supabase/server"

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

const STAR = "★"

export async function GET() {
  return withApiErrorHandling("GET /api/community/pulse", async () => {
    const supabase = createServerSupabaseClient()

    // Recent reviews (public) with profile + book info
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, rating, created_at, profiles(display_name, username), books(title)")
      .order("created_at", { ascending: false })
      .limit(5)

    // Recent lists (public)
    const { data: lists } = await supabase
      .from("book_lists")
      .select("id, title, book_ids, created_at, profiles(display_name, username)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3)

    type PulseItem = { id: string; title: string; meta: string; createdAt: string }
    const items: PulseItem[] = []

    for (const r of reviews ?? []) {
      const profile = r.profiles as { display_name?: string; username?: string } | null
      const book = r.books as { title?: string } | null
      const name = profile?.display_name ?? profile?.username ?? "Someone"
      const bookTitle = book?.title ?? "a book"
      const stars = typeof r.rating === "number" ? ` · ${r.rating}${STAR}` : ""
      items.push({
        id: `review-${r.id}`,
        title: `${name} reviewed "${bookTitle}"`,
        meta: `${timeAgo(r.created_at as string)}${stars}`,
        createdAt: r.created_at as string,
      })
    }

    for (const l of lists ?? []) {
      const profile = l.profiles as { display_name?: string; username?: string } | null
      const name = profile?.display_name ?? profile?.username ?? "Someone"
      const bookCount = Array.isArray(l.book_ids) ? l.book_ids.length : 0
      items.push({
        id: `list-${l.id}`,
        title: `New list by ${name}: "${l.title}"`,
        meta: `${timeAgo(l.created_at as string)} · ${bookCount} book${bookCount !== 1 ? "s" : ""}`,
        createdAt: l.created_at as string,
      })
    }

    // Sort merged feed by date desc, take top 5
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const top5 = items.slice(0, 5).map(({ id, title, meta }) => ({ id, title, meta }))

    return NextResponse.json({ items: top5 })
  })
}
