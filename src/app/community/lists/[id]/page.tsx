import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { BookCardMini } from "@/components/books/book-card"
import { searchGoogleBooks } from "@/lib/google-books"
import type { Book } from "@/types/book"
import { absoluteUrl } from "@/lib/site"

function listMeta(id: string) {
  if (id === "2") {
    return {
      title: "Cozy mysteries for late nights",
      description: "Low gore, high charm, clever reveals. Ideal for winding down.",
    }
  }
  return {
    title: "Short sci‑fi that still hits hard",
    description: "Tight, idea-dense reads under ~300 pages.",
  }
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params
  const { title, description } = listMeta(id)
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
  const { title, description } = listMeta(id)

  let previewBooks: Book[] = []
  try {
    const q = id === "2" ? "subject:mystery fiction" : "subject:science fiction"
    previewBooks = await searchGoogleBooks({ q, maxResults: 6 })
  } catch {
    previewBooks = []
  }

  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-h1 text-heading">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-muted">{description}</p>
          </div>
          <Link href="/community/lists">
            <Button variant="secondary" size="sm">
              Back to lists
            </Button>
          </Link>
        </div>

        <div className="mt-8 rounded-md border border-border bg-surface p-6 shadow-card">
          <div className="font-heading text-h3 text-heading">Sample picks</div>
          <p className="mt-2 text-sm text-text-muted">
            Titles below are loaded via Google Books for layout preview. Saved lists will use your shelf and community
            data once accounts are connected.
          </p>
          {previewBooks.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {previewBooks.map((b) => (
                <BookCardMini key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-text-muted">Could not load preview books. Try again later.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
