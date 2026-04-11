import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getBookById } from "@/lib/knowledge-books"
import { dbBookRowToBook, kbBookToDbRow, type DbBookRow } from "@/lib/books/kb-book-to-db"
import type { ShelfStatus } from "@/types/book"

const STATUSES: ShelfStatus[] = ["want_to_read", "reading", "read"]

function progressForStatus(status: ShelfStatus): number {
  if (status === "read") return 100
  if (status === "want_to_read") return 0
  return 0
}

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
  if (error && !/duplicate|unique/i.test(error.message)) {
    throw new Error(error.message)
  }
}

export async function GET() {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("shelf_items")
    .select("status, progress, user_rating, books (id, title, author, cover_url, description, genres, published_year, page_count, isbn, average_rating, ratings_count, slug)")
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const items =
    data?.map((row) => {
      const raw = row.books as unknown
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
      const book = dbBookRowToBook(raw as DbBookRow)
      return {
        status: row.status as ShelfStatus,
        progress: typeof row.progress === "number" ? row.progress : 0,
        userRating: row.user_rating as number | undefined,
        book,
      }
    }).filter(Boolean) ?? []

  return NextResponse.json({ items })
}

export async function POST(request: Request) {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  let body: { bookId?: string; status?: ShelfStatus }
  try {
    body = (await request.json()) as { bookId?: string; status?: ShelfStatus }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const bookId = body.bookId?.trim()
  const status = body.status
  if (!bookId || !status || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "bookId and valid status required" }, { status: 400 })
  }

  const book = getBookById(bookId)
  if (!book) {
    return NextResponse.json({ error: "Unknown book — titles must come from the catalog." }, { status: 404 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Server cannot sync catalog to the database (missing SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 503 }
    )
  }

  try {
    await ensureProfile(user.id, user.email ?? undefined)
    const admin = createSupabaseAdminClient()
    const { error: bookErr } = await admin.from("books").upsert(kbBookToDbRow(book), { onConflict: "id" })
    if (bookErr) {
      return NextResponse.json({ error: bookErr.message }, { status: 500 })
    }

    const supabase = createServerSupabaseClient()
    const { error: shelfErr } = await supabase.from("shelf_items").upsert(
      {
        user_id: user.id,
        book_id: book.id,
        status,
        progress: progressForStatus(status),
      },
      { onConflict: "user_id,book_id" }
    )
    if (shelfErr) {
      return NextResponse.json({ error: shelfErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Sync failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse

  const url = new URL(request.url)
  const bookId = url.searchParams.get("bookId")?.trim()
  if (!bookId) {
    return NextResponse.json({ error: "bookId query required" }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("shelf_items").delete().eq("user_id", user.id).eq("book_id", bookId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
