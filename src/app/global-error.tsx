"use client"

import * as React from "react"

import "./globals.css"

import { APP_NAME } from "@/lib/constants"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("[global-error]", error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-full bg-[#FEFCF8] font-sans text-[#1c1917] antialiased">
        <main className="flex min-h-full flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-3 max-w-md text-sm text-stone-600">
            {APP_NAME} hit an unexpected error. You can try reloading the page.
          </p>
          {error.digest ? (
            <p className="mt-4 font-mono text-xs text-stone-500">Ref: {error.digest}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
              onClick={() => reset()}
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100"
            >
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
