"use client"

import { Sparkles, User } from "lucide-react"

import { cn } from "@/lib/utils"

export function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user"
  return (
    <div className={cn("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/15 shadow-[0_0_10px_rgba(139,90,43,0.18)]">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
        </span>
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-primary to-accent/80 text-white shadow-[0_4px_16px_rgba(139,90,43,0.3)]"
            : "rounded-bl-sm border border-border bg-bg text-text shadow-[0_2px_12px_rgba(139,90,43,0.08)]"
        )}
      >
        {content ? (
          <span className="whitespace-pre-wrap break-words">{content}</span>
        ) : (
          <span className="text-text-muted italic">…</span>
        )}
      </div>

      {isUser && (
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-border bg-surface">
          <User className="h-3.5 w-3.5 text-text-muted" aria-hidden />
        </span>
      )}
    </div>
  )
}
