import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import { searchGoogleBooks } from "@/lib/google-books"

type Req = {
  userId?: string
  limit?: number
  context?: "similar" | "mood" | "new"
}

export async function POST(request: Request) {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse
  const json = (await request.json().catch(() => ({}))) as Req

  const limit = Math.min(12, Math.max(1, json.limit ?? 8))
  void json.userId
  void json.context

  // Stub (real data, no hardcoded titles): until Supabase taste profile + pgvector cache are wired,
  // return a stable-but-varied set for the signed-in user.
  const q = `subject:fiction ${user.id.slice(0, 6)}`
  let books: Awaited<ReturnType<typeof searchGoogleBooks>> = []
  try {
    books = await searchGoogleBooks({ q, maxResults: limit })
  } catch {
    books = []
  }

  return NextResponse.json({ items: books })
}

