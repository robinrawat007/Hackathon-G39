"use client"

import * as React from "react"
import { BookOpen, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChatBubble } from "@/components/chat/chat-bubble"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { useChat } from "@/lib/hooks/use-chat"
import { UI } from "@/lib/constants"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

export function ChatWidget() {
  const reduced = usePrefersReducedMotion()
  const panelId = React.useId()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const { messages, isStreaming, error, sendMessage, guestMessageCount } = useChat()
  const listRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener("shelfai:open-chat", onOpen as EventListener)
    return () => window.removeEventListener("shelfai:open-chat", onOpen as EventListener)
  }, [])

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length, isStreaming])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const onSubmit = async () => {
    const text = draft.trim()
    if (!text || isStreaming) return
    setDraft("")
    await sendMessage(text)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          aria-label={open ? "Close ShelfAI chat" : "Open ShelfAI chat"}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <BookOpen className="h-6 w-6 text-heading" aria-hidden="true" />
          <span className="pointer-events-none absolute -top-10 right-0 hidden rounded-full bg-surface px-3 py-1 text-xs text-text shadow-card group-hover:block">
            Ask ShelfAI
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.aside
            id={panelId}
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-6 z-[60] flex w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-hover md:h-[520px]"
            style={{ width: UI.chat.desktopWidthPx, height: UI.chat.heightPx }}
            role="dialog"
            aria-modal="true"
            aria-label="ShelfAI chat"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-heading text-base text-heading">ShelfAI</div>
                  <Badge variant="secondary">Guest Session</Badge>
                </div>
                <div className="text-xs text-text-muted">Ask me anything about books</div>
              </div>
              <Button variant="ghost" size="sm" aria-label="Close chat" onClick={() => setOpen(false)} leftIcon={<X className="h-4 w-4" />}>
                Close
              </Button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages
                .filter((m): m is { role: "user" | "assistant"; content: string; timestamp: string } => m.role !== "system")
                .map((m, idx) => (
                  <ChatBubble key={`${m.timestamp}-${idx}`} role={m.role} content={m.content} />
              ))}
              {isStreaming ? <TypingIndicator /> : null}
              {error ? <div className="text-xs text-error">Error: {error}</div> : null}
              {guestMessageCount >= UI.chat.guestNudgeAfterMessages ? (
                <div className="rounded-md border border-border bg-surface p-3 text-xs text-text-muted">
                  Sign up to save your recommendations to your shelf →
                </div>
              ) : null}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask for a recommendation…"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      void onSubmit()
                    }
                  }}
                />
                <Button variant="primary" size="md" loading={isStreaming} onClick={() => void onSubmit()}>
                  Send
                </Button>
              </div>
              <div className="mt-2 text-[11px] text-text-muted">Enter to send · Shift+Enter for a new line</div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}

