import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Curated lists",
  description: "Reader-made book lists to explore moods, genres, and themes.",
}

export default function CommunityListsPage() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-h1 text-heading">Curated Lists</h1>
            <p className="mt-2 text-sm text-text-muted">Browse reader-made lists — full authoring and discovery ships with accounts.</p>
          </div>
          <Link href="/community">
            <Button variant="secondary" size="sm">
              Back to feed
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/community/lists/1" className="rounded-md border border-border bg-surface p-6 shadow-card hover:bg-surface-hover">
            <div className="font-heading text-h3 text-heading">Short sci‑fi that still hits hard</div>
            <div className="mt-2 text-sm text-text-muted">Tight, idea-dense reads under ~300 pages.</div>
          </Link>
          <Link href="/community/lists/2" className="rounded-md border border-border bg-surface p-6 shadow-card hover:bg-surface-hover">
            <div className="font-heading text-h3 text-heading">Cozy mysteries for late nights</div>
            <div className="mt-2 text-sm text-text-muted">Low gore, high charm, clever reveals.</div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

