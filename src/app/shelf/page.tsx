import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ShelfClient } from "@/components/shelf/shelf-client"
import { requireUser } from "@/lib/auth/require-user"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Your shelf",
  description: "Manage your Want to Read, Currently Reading, and Read shelves.",
}

export default async function ShelfPage() {
  await requireUser()

  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="flex-1 pt-24">
        <ShelfClient />
      </main>
      <Footer />
    </div>
  )
}

