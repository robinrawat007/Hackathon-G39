import { NextResponse } from "next/server"

import { searchKnowledgeBooks } from "@/lib/knowledge-books"

export async function GET() {
  const books = searchKnowledgeBooks({ q: "fiction literary", maxResults: 8 })
  return NextResponse.json(books)
}

