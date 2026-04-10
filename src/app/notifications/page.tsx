import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { NotificationsClient } from "@/components/notifications/notifications-client"
import { requireUser } from "@/lib/auth/require-user"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Activity and mentions in one place.",
}

export default async function NotificationsPage() {
  const user = await requireUser()
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <NotificationsClient userId={user.id} />
      </main>
      <Footer />
    </div>
  )
}

