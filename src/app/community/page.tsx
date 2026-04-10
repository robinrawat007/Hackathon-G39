import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CommunityClient } from "@/components/community/community-client"

export const metadata: Metadata = {
  title: "Community — reviews, lists, heat",
  description: "See what readers are finishing, steal their lists, and flex your own stack.",
}

export default function CommunityPage() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <CommunityClient />
      </main>
      <Footer />
    </div>
  )
}

