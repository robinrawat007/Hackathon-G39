import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"
import {
  buildChatSearchQuery,
  fetchBooksContextForChat,
  formatCatalogForPrompt,
} from "@/lib/chat/books-catalog-context"
import { formatSiteKnowledgeForPrompt } from "@/lib/chat/site-knowledge"
import { createLLMAdapter, getProviderFromEnv } from "@/lib/llm/adapter"
import { rateLimitResponse } from "@/lib/rate-limit"
import type { ChatMessage } from "@/types/chat"

type RequestMessage = { role: "user" | "assistant"; content: string }

type ChatRequest = {
  messages: RequestMessage[]
  sessionKey?: string
}

function nowIso() {
  return new Date().toISOString()
}

function buildSystemPrompt(catalog: string): string {
  const siteKb = formatSiteKnowledgeForPrompt()
  const catalogBlocks = catalog.split("\n\n").filter(Boolean).length

  return `You are BooksyAI — a sharp, warm book discovery assistant for this website, backed by a real local book catalog.

SITE KNOWLEDGE (authoritative for “what is Shelf?”, features, routes, and how things work — not the book list):
${siteKb}

BOOK CATALOG (${catalogBlocks} matched titles from the BooksyAI books knowledge base for this conversation):
${catalog}

INSTRUCTIONS:
- If the user asks about BooksyAI, the app, pages, signing in, shelves, onboarding, community, or the chat widget itself, answer from SITE KNOWLEDGE. Do not invent features, URLs, or policies that are not described there.
- For book recommendations, rely on BOOK CATALOG. Mention title, author, and why it fits. Link with paths like /book/<slug> using slugs from the catalog block.
- If the catalog has no good match for a book request, say so honestly and still offer general reading guidance.
- Do NOT invent books, authors, ISBNs, or ratings that are not in BOOK CATALOG.
- Keep replies concise and conversational. Use a short list when recommending multiple titles.
- You may reason about mood, genre, pacing, themes, and reader taste when connecting catalog titles to the user.`
}

export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/chat", async () => {
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

    const userMessages = json.messages.filter((m) => m.role === "user")
    if (userMessages.length === 0) {
      return NextResponse.json({ error: "Missing user message" }, { status: 400 })
    }

    // Build search query from the full conversation context so follow-up turns
    // ("give me more", "something darker") still retrieve relevant catalog books.
    const searchQuery = buildChatSearchQuery(json.messages)
    const catalogBooks = fetchBooksContextForChat(searchQuery, 12)
    const catalog = formatCatalogForPrompt(catalogBooks)
    const system = buildSystemPrompt(catalog)

    const messages: ChatMessage[] = [
      { role: "system", content: system, timestamp: nowIso() },
      ...json.messages.map((m) => ({ role: m.role, content: m.content, timestamp: nowIso() })),
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
  })
}
