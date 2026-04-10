"use client"

import * as React from "react"

import type { ChatMessage } from "@/types/chat"
import { UI } from "@/lib/constants"

type UseChatState = {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  reset: () => void
  guestMessageCount: number
}

const GUEST_STORAGE_KEY = "shelfai-guest-chat"

function nowIso() {
  return new Date().toISOString()
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function getOrCreateSessionKey() {
  const key = "shelfai-chat-session-key"
  const existing = sessionStorage.getItem(key)
  if (existing) return existing
  const created = crypto.randomUUID()
  sessionStorage.setItem(key, created)
  return created
}

const MAX_USER_MESSAGE_CHARS = 4000
const MAX_HISTORY_MESSAGES = 30

export function useChat(): UseChatState {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [guestMessageCount, setGuestMessageCount] = React.useState(0)
  const messagesRef = React.useRef<ChatMessage[]>([])
  const streamReceivedTokenRef = React.useRef(false)
  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(GUEST_STORAGE_KEY)
      if (!stored) return
      const parsed = safeJsonParse<{ messages: ChatMessage[]; guestMessageCount: number }>(stored)
      if (!parsed) return
      setMessages(Array.isArray(parsed.messages) ? parsed.messages : [])
      setGuestMessageCount(typeof parsed.guestMessageCount === "number" ? parsed.guestMessageCount : 0)
    } catch {
      /* quota / private mode */
    }
  }, [])

  React.useEffect(() => {
    try {
      sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify({ messages, guestMessageCount }))
    } catch {
      /* quota / private mode */
    }
  }, [messages, guestMessageCount])

  const sendMessage = React.useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    const safeContent =
      trimmed.length > MAX_USER_MESSAGE_CHARS ? trimmed.slice(0, MAX_USER_MESSAGE_CHARS) : trimmed

    setError(null)
    setIsStreaming(true)

    const user: ChatMessage = { role: "user", content: safeContent, timestamp: nowIso() }
    const assistant: ChatMessage = { role: "assistant", content: "", timestamp: nowIso() }

    const prior = messagesRef.current.filter((m) => m.role !== "system").slice(-MAX_HISTORY_MESSAGES)
    const sessionKey = getOrCreateSessionKey()
    const payload = {
      messages: [...prior, user].map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      sessionKey,
    }

    streamReceivedTokenRef.current = false
    setMessages((prev) => [...prev, user, assistant])
    setGuestMessageCount((c) => c + 1)

    const rollbackOptimistic = () => {
      if (streamReceivedTokenRef.current) return
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === "assistant" && last.content === "") next.pop()
        const u = next[next.length - 1]
        if (u?.role === "user" && u.content === safeContent) next.pop()
        return next
      })
      setGuestMessageCount((c) => Math.max(0, c - 1))
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "")
        let msg = `Request failed (${res.status})`
        if (text) {
          try {
            const j = safeJsonParse<{ error?: string }>(text)
            if (j?.error) msg = j.error
            else msg = text.length > 280 ? `${text.slice(0, 280)}…` : text
          } catch {
            msg = text.length > 280 ? `${text.slice(0, 280)}…` : text
          }
        }
        throw new Error(msg)
      }

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
          const parsed = safeJsonParse<{ token?: string; done?: boolean; error?: string }>(raw)
          if (!parsed) continue
          if (parsed.error) throw new Error(parsed.error)
          if (parsed.done) continue
          const token = parsed.token ?? ""
          if (!token) continue
          streamReceivedTokenRef.current = true
          setMessages((prev) => {
            const next = prev.slice()
            const lastIdx = next.length - 1
            const last = next[lastIdx]
            if (!last || last.role !== "assistant") return next
            next[lastIdx] = { ...last, content: last.content + token }
            return next
          })
        }
      }
    } catch (e) {
      rollbackOptimistic()
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setIsStreaming(false)
    }
  }, [])

  const reset = React.useCallback(() => {
    setMessages([])
    setGuestMessageCount(0)
    setError(null)
    setIsStreaming(false)
    sessionStorage.removeItem(GUEST_STORAGE_KEY)
  }, [])

  // Soft nudge is handled by the widget UI; keep count here.
  void UI.chat.guestNudgeAfterMessages

  return { messages, isStreaming, error, sendMessage, reset, guestMessageCount }
}

