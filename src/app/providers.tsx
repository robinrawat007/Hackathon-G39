"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { SectionErrorBoundary } from "@/components/error-boundary/section-error-boundary"

const ShelfSync = dynamic(
  () => import("@/components/shelf/shelf-sync").then((m) => ({ default: m.ShelfSync })),
  { ssr: false }
)

const STALE_TIME_BOOKS_MS = 5 * 60 * 1000

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error("[react-query]", query.queryKey, error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _v, _c, mutation) => {
        console.error("[react-query mutation]", mutation.options.mutationKey ?? mutation.mutationId, error)
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_BOOKS_MS,
        refetchOnWindowFocus: false,
        retry: (failureCount, err) => {
          if (err && typeof err === "object" && "status" in err) {
            const s = (err as { status?: number }).status
            if (typeof s === "number" && s >= 400 && s < 500) return false
          }
          return failureCount < 2
        },
      },
    },
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(createQueryClient)
  return (
    <QueryClientProvider client={client}>
      <ShelfSync />
      <SectionErrorBoundary title="This page had a problem" description="Try again or use the navigation to continue.">
        {children}
      </SectionErrorBoundary>
    </QueryClientProvider>
  )
}

