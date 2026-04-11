import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Curated lists",
  description: "Reader-made book lists to explore moods, genres, and themes.",
}

export default async function CommunityListsPage() {
  const supabase = createServerSupabaseClient()
  const { data: lists } = await supabase
    .from("book_lists")
    .select("id, title, description, book_ids, profiles(display_name, username)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20)

  const rows = (lists ?? []).map((l) => {
    const profile = l.profiles as { display_name?: string; username?: string } | null
    const bookCount = Array.isArray(l.book_ids) ? l.book_ids.length : 0
    return {
      id: l.id as string,
      title: l.title as string,
      description: (l.description as string | null) ?? "",
      bookCount,
      by: profile?.display_name ?? profile?.username ?? null,
    }
  })

  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-h1 text-heading">Curated Lists</h1>
            <p className="mt-2 text-sm text-text-muted">Browse reader-made lists.</p>
          </div>
          <Link href="/community">
            <Button variant="secondary" size="sm">
              Back to feed
            </Button>
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border/60 bg-surface/40 p-12 text-center">
            <p className="text-sm text-text-muted">No public lists yet — they appear here once readers create them.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {rows.map((l) => (
              <Link
                key={l.id}
                href={`/community/lists/${l.id}`}
                className="rounded-2xl border border-border/80 bg-surface/80 p-6 shadow-card backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-surface"
              >
                <div className="font-heading text-h3 text-heading">{l.title}</div>
                {l.description ? (
                  <div className="mt-2 text-sm text-text-muted line-clamp-2">{l.description}</div>
                ) : null}
                <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                  <span>{l.bookCount} book{l.bookCount !== 1 ? "s" : ""}</span>
                  {l.by ? <span>· by {l.by}</span> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
