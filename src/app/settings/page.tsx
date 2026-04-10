import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SettingsClient } from "@/components/settings/settings-client"
import { requireUser } from "@/lib/auth/require-user"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Settings",
  description: "Account and preferences.",
}

export default async function SettingsPage() {
  await requireUser()
  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <SettingsClient />
      </main>
      <Footer />
    </div>
  )
}

