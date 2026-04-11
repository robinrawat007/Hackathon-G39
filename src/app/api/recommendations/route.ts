import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { requireUserForApi } from "@/lib/auth/require-user"
import { getRecommendationBooksForUser } from "@/lib/knowledge-books"

type Req = {
  userId?: string
  limit?: number
  context?: "similar" | "mood" | "new"
}

export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/recommendations", async () => {
    const userOrResponse = await requireUserForApi()
    if (userOrResponse instanceof NextResponse) return userOrResponse
    const user = userOrResponse
    const json = (await request.json().catch(() => ({}))) as Req

    const limit = Math.min(12, Math.max(1, json.limit ?? 8))
    void json.userId
    void json.context

    const books = getRecommendationBooksForUser(user.id, limit)

    return NextResponse.json({ items: books })
  })
}

