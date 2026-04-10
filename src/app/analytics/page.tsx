import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { requireUser } from "@/lib/auth/require-user"
import { AnalyticsClient } from "@/components/analytics/analytics-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Reading analytics",
  description: "Personal reading insights dashboard.",
}

export default async function AnalyticsPage() {
  await requireUser()
  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <AnalyticsClient />
      </main>
      <Footer />
    </div>
  )
}

