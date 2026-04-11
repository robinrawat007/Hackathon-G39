"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ShelfSync } from "@/components/shelf/shelf-sync"

const STALE_TIME_BOOKS_MS = 5 * 60 * 1000

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_BOOKS_MS,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(createQueryClient)
  return (
    <QueryClientProvider client={client}>
      <ShelfSync />
      {children}
    </QueryClientProvider>
  )
}

