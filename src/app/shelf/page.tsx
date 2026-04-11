import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { requireUser } from "@/lib/auth/require-user"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Your shelf",
  description: "Manage your Want to Read, Currently Reading, and Read shelves.",
}

/** Shelf UI lives on the dashboard; keep /shelf for bookmarks and redirect. */
export default async function ShelfPage() {
  await requireUser()
  redirect("/dashboard")
}
