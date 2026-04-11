"use client"

import * as React from "react"
import Link from "next/link"

import type { Book } from "@/types/book"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

export function WhyYoullLoveIt({ book }: { book: Book }) {
  const { user, isLoading: authLoading } = useAuthUser()
  const [text, setText] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  // Stable primitives as deps — avoid re-running when the parent re-renders with a new object ref
  const isbn = book.isbn
  const bookId = book.id

  React.useEffect(() => {
    if (!user || !isbn) return

    let cancelled = false
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

    const run = async () => {
      setLoading(true)
      setError(null)
      setText("")

      try {
        const res = await fetch(`/api/books/${encodeURIComponent(isbn)}/why-youll-love-it`, {
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

        reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done || cancelled) break
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
      reader?.cancel().catch(() => undefined)
    }
    // isbn and bookId are stable primitives; user.id ensures we re-run after login
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbn, bookId, user?.id])

  if (authLoading) return null

  if (!user) {
    return (
      <div className="mt-2 text-sm text-text-muted">
        <Link href="/auth/login" className="text-primary hover:text-primary-hover underline underline-offset-2">
          Sign in
        </Link>{" "}
        to see why you'll love this book.
      </div>
    )
  }

  if (!isbn) {
    return <div className="mt-2 text-sm text-text-muted">No ISBN — AI blurb unavailable.</div>
  }

  if (error) return <div className="mt-2 text-sm text-error">AI error: {error}</div>
  if (loading && text.length === 0) return <div className="mt-2 text-sm text-text-muted">Generating…</div>

  const paras = text.split(/\n\n+/).filter((p) => p.trim().length > 0)
  if (paras.length === 0 && text.trim()) {
    return <p className="mt-3 text-sm leading-relaxed text-text-muted text-pretty">{text.trim()}</p>
  }
  if (paras.length === 0) return null

  return (
    <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-muted">
      {paras.map((p, i) => (
        <p key={i} className="text-pretty">
          {p.trim()}
        </p>
      ))}
    </div>
  )
}
