import { Suspense } from "react"
import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BrowseClient } from "@/components/browse/browse-client"

export const metadata: Metadata = {
  title: "Browse books by genre, mood & era",
  description: "Browse books with filters for genre, mood, era, rating, and page count.",
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

