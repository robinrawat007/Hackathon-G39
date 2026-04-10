"use client"

import { cn } from "@/lib/utils"

export function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user"
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-primary to-sky-500 text-heading"
            : "rounded-bl-md border border-primary/15 bg-input-bg/90 text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
        )}
      >
        {content ? (
          <span className="whitespace-pre-wrap break-words">{content}</span>
        ) : (
          <span className="text-text-muted italic">…</span>
        )}
      </div>
    </div>
  )
}
