import { Suspense } from "react"
import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BrowseClient } from "@/components/browse/browse-client"

export const metadata: Metadata = {
  title: "Browse — hunt by vibe, genre & era",
  description: "Filter the catalog like a pro: mood, genre, era, ratings, length — AI-ready picks start here.",
}

export default function BrowsePage() {
  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="flex-1 pt-20">
        {/* Suspense required because BrowseClient uses useSearchParams() */}
        <Suspense>
          <BrowseClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

