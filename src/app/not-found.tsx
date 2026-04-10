import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex flex-1 flex-col items-center justify-center py-28 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 font-heading text-h1 text-heading">Page not found</h1>
        <p className="mt-3 max-w-md text-sm text-text-muted">
          The page you asked for is missing or the link is out of date. Try home, browse, or your dashboard.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              Home
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="secondary" size="md">
              Browse
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
