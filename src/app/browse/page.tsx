import { Suspense } from "react"
import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BrowseClient } from "@/components/browse/browse-client"

export const metadata: Metadata = {
  title: "Browse — hunt by vibe, genre & era",
  description: "Filter the catalog like a pro: mood, genre, era, ratings, length — AI-ready picks start here.",
}

/** Search + filters are client-driven; avoid static shell quirks with live store + React Query. */
export const dynamic = "force-dynamic"

export default function BrowsePage() {
  return (
    <div className="flex min-h-full min-w-0 flex-col bg-transparent text-text">
      <Navbar />
      <main id="main" className="min-w-0 flex-1 pt-20">
        {/* Suspense required because BrowseClient uses useSearchParams() */}
        <Suspense>
          <BrowseClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

