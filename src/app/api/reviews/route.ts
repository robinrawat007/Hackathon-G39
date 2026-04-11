import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getBookById } from "@/lib/knowledge-books"
import { kbBookToDbRow } from "@/lib/books/kb-book-to-db"
import { reviewSchema } from "@/lib/validations/review.schema"

async function ensureProfile(userId: string, email: string | undefined) {
  const admin = createSupabaseAdminClient()
  const { data: existing } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle()
  if (existing) return
  const username = `r_${userId.replace(/-/g, "")}`
  const { error } = await admin.from("profiles").insert({
    id: userId,
    username,
    display_name: email?.split("@")[0] ?? "Reader",
  })
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(error.message)
}

export async function POST(request: Request) {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  const json = (await request.json().catch(() => null)) as unknown
  if (!json || typeof json !== "object") return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const body = json as Record<string, unknown>
  const bookId = typeof body.bookId === "string" ? body.bookId.trim() : ""
  if (!bookId) return NextResponse.json({ error: "bookId is required" }, { status: 400 })

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation failed" }, { status: 400 })
  }

  // Ensure the book exists in the DB (upsert from KB)
  const book = getBookById(bookId)
  if (!book) return NextResponse.json({ error: "Unknown book" }, { status: 404 })

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server misconfiguration (missing SUPABASE_SERVICE_ROLE_KEY)" }, { status: 503 })
  }

  try {
    await ensureProfile(user.id, user.email ?? undefined)

    const admin = createSupabaseAdminClient()
    const { error: bookErr } = await admin.from("books").upsert(kbBookToDbRow(book), { onConflict: "id" })
    if (bookErr) return NextResponse.json({ error: bookErr.message }, { status: 500 })

    const supabase = createServerSupabaseClient()

    // One review per user+book — upsert on (user_id, book_id) using a DELETE + INSERT pattern
    // since the reviews table has no unique constraint we use a select-then-upsert approach
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .maybeSingle()

    if (existing) {
      const { error: updateErr } = await supabase
        .from("reviews")
        .update({ rating: parsed.data.rating, body: parsed.data.body })
        .eq("id", existing.id)
      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })
    } else {
      const { error: insertErr } = await supabase.from("reviews").insert({
        user_id: user.id,
        book_id: bookId,
        rating: parsed.data.rating,
        body: parsed.data.body,
      })
      if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    // Mirror rating to shelf_items.user_rating if item exists
    await supabase
      .from("shelf_items")
      .update({ user_rating: parsed.data.rating })
      .eq("user_id", user.id)
      .eq("book_id", bookId)

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save review"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const bookId = url.searchParams.get("bookId")?.trim()
  if (!bookId) return NextResponse.json({ error: "bookId query required" }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, user_id, profiles(username, display_name, avatar_url)")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}
