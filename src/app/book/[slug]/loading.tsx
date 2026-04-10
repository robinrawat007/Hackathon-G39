import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function BookDetailLoading() {
  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <Skeleton className="aspect-[2/3] w-full max-w-[280px] rounded-md" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full max-w-md" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <Skeleton className="h-11 w-full max-w-xs rounded-md" />
              </div>
            </div>
            <Skeleton className="mt-8 min-h-[140px] w-full rounded-md" />
            <Skeleton className="mt-6 min-h-[120px] w-full rounded-md" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Loading this title…
          </span>
        </p>
        <div className="mt-6 text-center">
          <Link href="/browse" className="text-sm text-primary hover:text-primary-hover">
            ← Back to browse
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
