import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { BookCardMini } from "@/components/books/book-card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getBookById } from "@/lib/knowledge-books"
import { absoluteUrl } from "@/lib/site"

async function fetchList(id: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from("book_lists")
    .select("id, title, description, book_ids, is_public, profiles(display_name, username)")
    .eq("id", id)
    .maybeSingle()
  return data
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params
  const list = await fetchList(id)
  if (!list || !list.is_public) return { title: "List not found" }
  const title = list.title as string
  const description = (list.description as string | null) ?? "A curated book list on BooksyAI."
  const url = absoluteUrl(`/community/lists/${encodeURIComponent(id)}`)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  }
}

export default async function ListDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const list = await fetchList(id)

  if (!list || !list.is_public) notFound()

  const profile = list.profiles as { display_name?: string; username?: string } | null
  const bookIds = Array.isArray(list.book_ids) ? (list.book_ids as string[]) : []
  const books = bookIds.map((bid) => getBookById(bid)).filter(Boolean)

  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-h1 text-heading">{list.title as string}</h1>
            {list.description ? (
              <p className="mt-2 max-w-2xl text-sm text-text-muted">{list.description as string}</p>
            ) : null}
            {profile ? (
              <p className="mt-1 text-xs text-text-muted">
                by {profile.display_name ?? profile.username}
              </p>
            ) : null}
          </div>
          <Link href="/community/lists">
            <Button variant="secondary" size="sm">
              Back to lists
            </Button>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-border/80 bg-surface/60 p-6 shadow-card backdrop-blur-sm">
          {books.length === 0 ? (
            <p className="text-sm text-text-muted">This list has no books yet.</p>
          ) : (
            <>
              <div className="font-heading text-h3 text-heading">
                {books.length} book{books.length !== 1 ? "s" : ""}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {books.map((b) => (
                  <BookCardMini key={b!.id} book={b!} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
