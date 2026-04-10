import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function BrowseLoading() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="flex-1 pt-20">
        <div className="container py-10 md:py-12">
          <Skeleton className="h-36 w-full max-w-3xl rounded-2xl md:h-40" />
          <div className="mt-8 grid gap-6 md:grid-cols-[320px_1fr]">
            <div className="hidden md:block">
              <Skeleton className="min-h-[420px] w-full rounded-2xl" />
            </div>
            <div>
              <Skeleton className="h-10 w-full max-w-md rounded-lg" />
              <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex min-h-[500px] flex-col gap-4 rounded-2xl border border-border/40 p-4">
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-[88%]" />
                    <Skeleton className="h-4 w-[55%]" />
                    <Skeleton className="mt-auto h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
