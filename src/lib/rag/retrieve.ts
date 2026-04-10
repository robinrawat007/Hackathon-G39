import { createServerSupabaseClient } from "@/lib/supabase/server"

type RetrievedBook = {
  id: string
  title: string
  author: string
  description: string | null
  genres: string[] | null
  average_rating: number | null
}

export async function retrieveBooksByVector(queryVector: number[], limit = 8): Promise<RetrievedBook[]> {
  // Requires a Supabase SQL function:
  // match_books(query_embedding vector(1536), match_count int)
  // returning (id, title, author, description, genres, average_rating)
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.rpc("match_books", {
    query_embedding: queryVector,
    match_count: limit,
  })

  if (error || !Array.isArray(data)) return []
  return data as RetrievedBook[]
}

