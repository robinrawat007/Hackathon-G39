import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { createLLMAdapter, getProviderFromEnv } from "@/lib/llm/adapter"
import { rateLimitResponse } from "@/lib/rate-limit"
import type { ChatMessage } from "@/types/chat"

type Req = {
  book: {
    title: string
    author: string
    description: string
    genres: string[]
    averageRating: number
    ratingsCount: number
  }
  userProfile?: unknown
}

function nowIso() {
  return new Date().toISOString()
}

export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/books/[isbn]/why-youll-love-it", async () => {
    const limited = await rateLimitResponse(request, "llmFeature", { max: 15, window: "1 m" })
    if (limited) return limited

    if (!process.env.LLM_API_KEY) {
      return NextResponse.json(
        { error: "This feature requires LLM_API_KEY to be configured on the server." },
        { status: 503 }
      )
    }

    const json = (await request.json().catch(() => null)) as Req | null
    if (!json?.book?.title || !json.book.author) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const system = `You are ShelfAI, a warm but intelligent bookstore owner who loves data.
Write a short, specific blurb (3-6 sentences) explaining why readers like the user may enjoy this book.
Do not mention any book titles other than the provided one. No spoilers.`

    const user = `Book: ${JSON.stringify(json.book)}\nUser profile (optional): ${JSON.stringify(json.userProfile ?? null)}`

    const messages: ChatMessage[] = [
      { role: "system", content: system, timestamp: nowIso() },
      { role: "user", content: user, timestamp: nowIso() },
    ]

    const adapter = createLLMAdapter(getProviderFromEnv())
    let tokenStream: ReadableStream<string>
    try {
      tokenStream = await adapter.chat(messages, { temperature: 0.5 })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "LLM request failed"
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    const encoder = new TextEncoder()
    const transform = new TransformStream<Uint8Array, Uint8Array>()
    const writer = transform.writable.getWriter()

    ;(async () => {
      const reader = tokenStream.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = typeof value === "string" ? value : String(value)
          await writer.write(encoder.encode(`data: ${JSON.stringify({ token: chunk })}\n\n`))
        }
        await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
      } catch {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: "stream_error" })}\n\n`))
      } finally {
        await writer.close()
      }
    })()

    return new NextResponse(transform.readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  })
}

