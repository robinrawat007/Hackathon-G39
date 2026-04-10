import { NextResponse } from "next/server"

import { fetchBooksContextForChat } from "@/lib/chat/google-books-context"
import { createLLMAdapter, getProviderFromEnv } from "@/lib/llm/adapter"
import { rateLimitResponse } from "@/lib/rate-limit"
import type { ChatMessage } from "@/types/chat"

type ChatRequest = {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  sessionKey?: string
}

function nowIso() {
  return new Date().toISOString()
}

function asChatMessages(req: ChatRequest): ChatMessage[] {
  return req.messages.map((m) => ({ role: m.role, content: m.content, timestamp: nowIso() }))
}

function buildSystemPrompt(catalogBooks: Awaited<ReturnType<typeof fetchBooksContextForChat>>) {
  const payload = catalogBooks.length > 0 ? JSON.stringify(catalogBooks) : "[]"
  return (
    `You are ShelfAI, a sharp, friendly book discovery assistant powered by live catalog data and AI reasoning.\n\n` +
    `Below is a JSON array of books pulled from the Google Books catalog using the user's latest message as the search query. ` +
    `Each entry includes real metadata: title, author, description excerpt, genres, ratings, slug, isbn.\n\n` +
    `Rules:\n` +
    `- When recommending or describing specific titles, draw from this list first and mention real titles and authors from it.\n` +
    `- Do not invent books, ISBNs, or claim something is in the list when it is not.\n` +
    `- If the list is empty or none fit, say so honestly and offer general reading guidance or suggest the user rephrase (e.g. genre, mood, comp title).\n` +
    `- You may mention that on ShelfAI readers can open a book page at path /book/{slug} using the slug field when useful.\n\n` +
    `Catalog results (JSON):\n${payload}`
  )
}

export async function POST(request: Request) {
  const limited = await rateLimitResponse(request, "chat", { max: 20, window: "1 m" })
  if (limited) return limited

  if (!process.env.LLM_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Chat requires LLM_API_KEY. Add an OpenAI-compatible key to .env.local and restart the dev server.",
      },
      { status: 503 }
    )
  }

  const json = (await request.json().catch(() => null)) as ChatRequest | null
  if (!json || !Array.isArray(json.messages) || json.messages.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const userLast = json.messages.slice().reverse().find((m) => m.role === "user")?.content?.trim()
  if (!userLast) return NextResponse.json({ error: "Missing user message" }, { status: 400 })

  const catalogBooks = await fetchBooksContextForChat(userLast, 8)
  const system = buildSystemPrompt(catalogBooks)

  const messages: ChatMessage[] = [
    { role: "system", content: system, timestamp: nowIso() },
    ...asChatMessages(json),
  ]

  const adapter = createLLMAdapter(getProviderFromEnv())
  let tokenStream: ReadableStream<string>
  try {
    tokenStream = await adapter.chat(messages, {})
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
}
