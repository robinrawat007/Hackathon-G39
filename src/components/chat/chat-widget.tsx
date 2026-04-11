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

const STARTER_ICONS = ["⚡", "🕯️", "🪐", "💬"]

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
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
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
      {/* FAB */}
      <div className="fixed z-[60] bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "group relative flex h-16 w-16 items-center justify-center rounded-full",
            !open && !reduced ? "chat-fab-glow-shadow" : "shadow-[0_4px_20px_rgba(139,90,43,0.3)]",
            "bg-gradient-to-br from-primary to-accent text-white shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          )}
          aria-label={open ? "Close ShelfAI chat" : "Open ShelfAI chat"}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <span className="relative z-10" key={open ? "close" : "open"}>
            {open ? (
              <X className="h-6 w-6 drop-shadow-sm" aria-hidden />
            ) : (
              <BookOpen className="h-7 w-7 drop-shadow-sm" aria-hidden />
            )}
          </span>
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-50 blur-md"
            style={{
              background:
                "radial-gradient(circle, rgba(196,149,106,0.8) 0%, rgba(139,90,43,0.3) 50%, transparent 70%)",
            }}
            aria-hidden
          />
          {!open && (
            <span className="pointer-events-none absolute -top-11 right-0 hidden whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-medium text-heading shadow-card backdrop-blur-md group-hover:block">
              Ask the book brain →
            </span>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {open ? (
          <motion.aside
            id={panelId}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.95 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed z-[60] flex w-[min(100vw-1rem,420px)] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-[0_8px_40px_rgba(139,90,43,0.18),0_32px_64px_rgba(0,0,0,0.12)] backdrop-blur-xl bottom-[max(5.5rem,calc(4.5rem+env(safe-area-inset-bottom,0px)))] right-[max(0.5rem,env(safe-area-inset-right,0px))] max-h-[min(560px,calc(100dvh-6rem))] h-[min(560px,calc(100dvh-6rem))] sm:right-6 sm:max-h-[min(620px,calc(100dvh-7rem))] sm:h-[min(580px,calc(100dvh-7rem))] md:bottom-[max(8rem,calc(7rem+env(safe-area-inset-bottom,0px)))]"
            role="dialog"
            aria-modal="true"
            aria-label="ShelfAI chat"
          >
            {/* Ambient top glow inside panel */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,149,106,0.2) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            {/* Header */}
            <div className="relative z-10 overflow-hidden border-b border-border px-4 py-3.5 bg-bg-secondary/60">
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/20 to-accent/15 text-primary shadow-[0_0_18px_rgba(139,90,43,0.2)]">
                    <Sparkles className="h-5 w-5" aria-hidden />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/25 shadow-[0_0_22px_rgba(139,90,43,0.12)]"
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-heading text-base font-semibold tracking-tight text-heading">ShelfAI</div>
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" aria-hidden />
                        online
                      </span>
                    </div>
                    <p className="text-xs leading-snug text-text-muted">Live catalog · AI librarian</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close chat"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-heading"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            {/* Message list */}
            <div
              ref={listRef}
              className="relative z-10 flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {showStarters ? (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="space-y-3"
                >
                  {/* Welcome card */}
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-secondary/60 p-4">
                    <div className="relative">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                        Quick asks
                      </p>
                      <p className="mb-3 text-sm font-medium text-heading">
                        Pick a vibe — or type your own.
                      </p>
                      <div className="flex flex-col gap-2">
                        {CHAT_STARTER_PROMPTS.map((q, i) => (
                          <button
                            key={q}
                            type="button"
                            disabled={isStreaming}
                            onClick={() => onStarter(q)}
                            className="group relative overflow-hidden rounded-xl border border-border bg-bg px-3 py-2.5 text-left text-sm leading-snug text-text transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-heading disabled:opacity-50"
                          >
                            <span
                              className="absolute left-0 top-0 h-full w-[2px] rounded-r bg-gradient-to-b from-primary to-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              aria-hidden
                            />
                            <span className="relative flex items-center gap-2.5 pl-1">
                              <span className="text-base leading-none">{STARTER_ICONS[i % STARTER_ICONS.length]}</span>
                              <span>{q}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {visibleMessages.map((m, idx) => (
                <motion.div
                  key={`${m.timestamp}-${idx}`}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatBubble role={m.role} content={m.content} />
                </motion.div>
              ))}
              {isStreaming ? <TypingIndicator /> : null}
              {error ? (
                <div className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
                  That didn't land — {error}
                </div>
              ) : null}
              {guestMessageCount >= UI.chat.guestNudgeAfterMessages ? (
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs text-text-muted">
                  <span className="font-medium text-heading">Level up:</span> create an account and your next obsession stays on your shelf.
                </div>
              ) : null}
            </div>

            {/* Composer */}
            <div className="relative z-10 border-t border-border bg-bg-secondary/60 px-3 py-3 sm:px-3.5">
              <div className="group/composer rounded-xl border border-border bg-bg p-[1px] shadow-[0_0_20px_rgba(139,90,43,0.08)] transition-shadow duration-300 focus-within:border-primary/50 focus-within:shadow-[0_0_28px_rgba(139,90,43,0.14)] sm:rounded-2xl">
                <div className="flex flex-col gap-1.5 rounded-xl bg-bg p-1.5 sm:flex-row sm:items-end sm:gap-2 sm:rounded-2xl sm:p-2">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={'Mood, last 5-star, or \u201csomething like\u2026\u201d \u2014 go.'}
                    rows={2}
                    className="min-h-[2.625rem] w-full flex-1 resize-none border-0 bg-transparent py-2 text-sm leading-snug text-heading shadow-none placeholder:text-text-muted/60 focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none sm:min-h-[3rem] sm:py-2"
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
                    className="h-10 w-full shrink-0 rounded-lg transition-shadow sm:mb-px sm:h-10 sm:w-10 sm:min-w-[2.5rem] sm:rounded-xl sm:p-0"
                    loading={isStreaming}
                    onClick={() => void onSubmit()}
                    aria-label="Send message"
                    leftIcon={!isStreaming ? <Send className="h-5 w-5" strokeWidth={2.25} aria-hidden /> : undefined}
                  />
                </div>
              </div>
              <p className="mt-1.5 text-center text-[10px] leading-tight text-text-muted sm:text-[11px]">
                <span className="text-text-muted">Enter</span> to send ·{" "}
                <span className="text-text-muted">Shift+Enter</span> new line
              </p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}
