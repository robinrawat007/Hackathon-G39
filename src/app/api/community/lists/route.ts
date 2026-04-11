import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { createServerSupabaseClient } from "@/lib/supabase/server"

/** GET /api/community/lists — public book lists */
export async function GET() {
  return withApiErrorHandling("GET /api/community/lists", async () => {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("book_lists")
      .select("id, title, book_ids, created_at, profiles(display_name, username)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const lists = (data ?? []).map((l) => {
      const bookCount = Array.isArray(l.book_ids) ? l.book_ids.length : 0
      return {
        id: l.id,
        title: l.title,
        href: `/community/lists/${l.id}`,
        count: `${bookCount} book${bookCount !== 1 ? "s" : ""}`,
      }
    })

    return NextResponse.json({ lists })
  })
}
