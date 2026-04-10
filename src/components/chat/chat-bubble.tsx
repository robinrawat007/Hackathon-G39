"use client"

import { cn } from "@/lib/utils"

export function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg border border-border px-4 py-3 text-sm leading-6",
          isUser ? "bg-primary text-heading" : "bg-surface text-text"
        )}
      >
        {content}
      </div>
    </div>
  )
}

