"use client"

import * as React from "react"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Surface in console during development; swap for reporting in production.
    console.error(error)
  }, [error])

  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex flex-1 flex-col items-center justify-center py-28 text-center">
        <h1 className="font-heading text-h1 text-heading">Something went wrong</h1>
        <p className="mt-3 max-w-md text-sm text-text-muted">
          An unexpected error occurred while rendering this route. You can retry or head back to a stable page.
        </p>
        {error.digest ? <p className="mt-4 font-mono text-xs text-text-muted">Ref: {error.digest}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="md" type="button" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="secondary" size="md">
              Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
