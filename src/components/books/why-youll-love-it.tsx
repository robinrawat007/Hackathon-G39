"use client"

import * as React from "react"

import type { Book } from "@/types/book"

export function WhyYoullLoveIt({ book }: { book: Book }) {
  const [text, setText] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!book.isbn) return
      setLoading(true)
      setError(null)
      setText("")

      try {
        const res = await fetch(`/api/books/${encodeURIComponent(book.isbn)}/why-youll-love-it`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            book: {
              title: book.title,
              author: book.author,
              description: book.description,
              genres: book.genres,
              averageRating: book.averageRating,
              ratingsCount: book.ratingsCount,
            },
          }),
        })
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          let msg = `Request failed (${res.status})`
          try {
            const j = JSON.parse(text) as { error?: string }
            if (j.error) msg = j.error
          } catch {
            if (text) msg = text.length > 200 ? `${text.slice(0, 200)}…` : text
          }
          throw new Error(msg)
        }
        if (!res.body) throw new Error("Empty response")

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split("\n\n")
          buffer = parts.pop() ?? ""
          for (const part of parts) {
            const line = part.split("\n").find((l) => l.startsWith("data:"))
            if (!line) continue
            const raw = line.slice("data:".length).trim()
            let parsed: { token?: string; done?: boolean; error?: string }
            try {
              parsed = JSON.parse(raw) as { token?: string; done?: boolean; error?: string }
            } catch {
              continue
            }
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.token && !cancelled) setText((t) => t + parsed.token)
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [book])

  if (!book.isbn) {
    return <div className="mt-2 text-sm text-text-muted">Add an ISBN to enable the AI blurb.</div>
  }

  if (error) return <div className="mt-2 text-sm text-error">AI error: {error}</div>
  if (loading && text.length === 0) return <div className="mt-2 text-sm text-text-muted">Generating…</div>

  return <p className="mt-2 text-sm text-text-muted whitespace-pre-wrap">{text}</p>
}

