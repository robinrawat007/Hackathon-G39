import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { requireUser } from "@/lib/auth/require-user"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Your next-read HQ",
  description: "AI-curated picks, shortcuts, and the pulse of your reading life.",
}

export default async function DashboardPage() {
  await requireUser()

  return (
    <div className="flex min-h-full min-w-0 flex-col bg-transparent text-text">
      <Navbar />
      <main id="main" className="min-w-0 flex-1 pt-20 sm:pt-24">
        <DashboardClient />
      </main>
      <Footer />
    </div>
  )
}

