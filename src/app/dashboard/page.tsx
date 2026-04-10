import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { requireUser } from "@/lib/auth/require-user"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized reading dashboard.",
}

export default async function DashboardPage() {
  await requireUser()

  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="flex-1 pt-24">
        <DashboardClient />
      </main>
      <Footer />
    </div>
  )
}

