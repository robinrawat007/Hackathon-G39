import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { searchKnowledgeBooks } from "@/lib/knowledge-books"

export async function GET() {
  return withApiErrorHandling("GET /api/books/trending", async () => {
    const books = searchKnowledgeBooks({ q: "fiction literary", maxResults: 8 })
    return NextResponse.json(books)
  })
}

