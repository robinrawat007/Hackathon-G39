"use client"

import * as React from "react"
import { BookOpen, Send, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChatBubble } from "@/components/chat/chat-bubble"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { useChat } from "@/lib/hooks/use-chat"
import { CHAT_STARTER_PROMPTS, UI } from "@/lib/constants"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

export function ChatWidget() {
  const reduced = usePrefersReducedMotion()
  const panelId = React.useId()
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const { messages, isStreaming, error, sendMessage, guestMessageCount } = useChat()
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const visibleMessages = messages.filter(
    (m): m is { role: "user" | "assistant"; content: string; timestamp: string } => m.role !== "system"
  )
  const showStarters = visibleMessages.length === 0 && !isStreaming

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

  const onStarter = (text: string) => {
    if (isStreaming) return
    void sendMessage(text)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]">
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "group relative flex h-16 w-16 items-center justify-center rounded-full",
            !open && !reduced ? "chat-fab-glow-shadow" : "shadow-[0_0_24px_rgba(99,179,237,0.35)]",
            "bg-gradient-to-br from-primary via-sky-400 to-accent text-heading shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          )}
          aria-label={open ? "Close ShelfAI chat" : "Open ShelfAI chat"}
          aria-expanded={open}
          aria-controls={panelId}
          animate={reduced || open ? {} : { y: [0, -10, 0] }}
          transition={
            reduced || open
              ? {}
              : {
                  y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
                }
          }
        >
          <BookOpen className="relative z-10 h-7 w-7 drop-shadow-md" aria-hidden="true" />
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-60 blur-md"
            style={{
              background: "radial-gradient(circle, rgba(99,179,237,0.9) 0%, rgba(159,122,234,0.4) 50%, transparent 70%)",
            }}
            aria-hidden
          />
          <span className="pointer-events-none absolute -top-11 right-0 hidden whitespace-nowrap rounded-full border border-primary/30 bg-bg-secondary/95 px-3 py-1.5 text-xs font-medium text-heading shadow-card backdrop-blur-md group-hover:block">
            Ask the book brain →
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.aside
            id={panelId}
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-28 right-6 z-[60] flex max-h-[min(640px,calc(100vh-7rem))] w-[min(100vw-1.5rem,400px)] flex-col overflow-hidden rounded-2xl border border-primary/30 bg-[rgba(6,10,20,0.92)] shadow-[0_0_48px_rgba(99,179,237,0.18),0_24px_56px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:bottom-32"
            style={{ height: UI.chat.heightPx }}
            role="dialog"
            aria-modal="true"
            aria-label="ShelfAI chat"
          >
            <div className="relative overflow-hidden border-b border-primary/15 px-4 py-3.5">
              <div
                className="pointer-events-none absolute inset-0 opacity-100"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(99,179,237,0.22) 0%, transparent 42%), linear-gradient(300deg, rgba(159,122,234,0.16) 0%, transparent 48%)",
                }}
                aria-hidden
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/25 to-accent/15 text-primary shadow-[0_0_24px_rgba(99,179,237,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="font-heading text-base font-semibold tracking-tight text-heading">ShelfAI</div>
                    <p className="text-xs leading-snug text-text-muted">Live catalog + AI · your hype librarian</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-text-muted transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-heading"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-transparent via-bg/[0.35] to-transparent px-4 py-4"
            >
              {showStarters ? (
                <div className="space-y-3 rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/[0.07] via-transparent to-accent/[0.04] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/90">Quick asks</p>
                  <p className="text-sm font-medium text-heading">Pick a vibe — or type your own.</p>
                  <div className="flex flex-col gap-2">
                    {CHAT_STARTER_PROMPTS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        disabled={isStreaming}
                        onClick={() => onStarter(q)}
                        className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-input-bg/80 px-3 py-2.5 text-left text-sm leading-snug text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:border-primary/40 hover:bg-[rgba(8,14,28,0.95)] hover:text-heading hover:shadow-[0_0_20px_rgba(99,179,237,0.12)] disabled:opacity-50"
                      >
                        <span
                          className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          aria-hidden
                        />
                        <span className="relative block pl-2">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {visibleMessages.map((m, idx) => (
                <ChatBubble key={`${m.timestamp}-${idx}`} role={m.role} content={m.content} />
              ))}
              {isStreaming ? <TypingIndicator /> : null}
              {error ? (
                <div className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">That didn’t land — {error}</div>
              ) : null}
              {guestMessageCount >= UI.chat.guestNudgeAfterMessages ? (
                <div className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs text-text-muted">
                  <span className="font-medium text-heading">Level up:</span> create an account and your next obsession stays on your shelf.
                </div>
              ) : null}
            </div>

            <div className="border-t border-primary/15 bg-gradient-to-t from-bg via-[rgba(6,10,20,0.97)] to-bg-secondary/90 p-4 backdrop-blur-md">
              <div className="group/composer rounded-2xl p-[1px] shadow-[0_0_28px_rgba(99,179,237,0.12)] transition-shadow duration-200 [background:linear-gradient(135deg,rgba(99,179,237,0.45),rgba(99,179,237,0.12),rgba(159,122,234,0.35))] focus-within:shadow-[0_0_36px_rgba(99,179,237,0.22)]">
                <div className="flex items-end gap-2 rounded-2xl bg-bg/95 p-2 backdrop-blur-sm">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Mood, last 5-star, or “something like…” — go."
                    rows={2}
                    className="min-h-[4.25rem] flex-1 resize-none border-0 bg-transparent py-2.5 shadow-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        void onSubmit()
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    size="md"
                    className="mb-0.5 h-11 w-11 shrink-0 rounded-xl p-0 shadow-[0_0_20px_rgba(99,179,237,0.35)]"
                    loading={isStreaming}
                    onClick={() => void onSubmit()}
                    aria-label="Send message"
                    leftIcon={!isStreaming ? <Send className="h-5 w-5" strokeWidth={2.25} aria-hidden /> : undefined}
                  />
                </div>
              </div>
              <p className="mt-2.5 text-center text-[11px] text-input-placeholder">
                <span className="text-text-muted">Enter</span> to send · <span className="text-text-muted">Shift+Enter</span> new line
              </p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}
