import { NextResponse } from "next/server"

import { searchGoogleBooks } from "@/lib/google-books"

export async function GET() {
  // Real data (no hardcoded books). Uses Google Books without exposing secrets.
  const books = await searchGoogleBooks({ q: "subject:fiction", maxResults: 8 })
  return NextResponse.json(books)
}

