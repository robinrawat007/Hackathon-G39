"use client"

import { Sparkles, User } from "lucide-react"

import { cn } from "@/lib/utils"

export function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user"
  return (
    <div className={cn("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/15 shadow-[0_0_12px_rgba(99,179,237,0.2)]">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
        </span>
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-primary via-sky-400 to-accent/80 text-heading shadow-[0_0_20px_rgba(99,179,237,0.35),0_4px_12px_rgba(0,0,0,0.3)]"
            : "rounded-bl-sm border border-primary/15 bg-[rgba(6,10,22,0.88)] text-text shadow-[0_0_16px_rgba(99,179,237,0.07),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
        )}
      >
        {content ? (
          <span className="whitespace-pre-wrap break-words">{content}</span>
        ) : (
          <span className="text-text-muted italic">…</span>
        )}
      </div>

      {isUser && (
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08]">
          <User className="h-3.5 w-3.5 text-text-muted" aria-hidden />
        </span>
      )}
    </div>
  )
}
