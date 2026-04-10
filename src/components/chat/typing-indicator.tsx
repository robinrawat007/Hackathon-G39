"use client"

import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

export function TypingIndicator() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex items-end gap-2">
      <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/15 shadow-[0_0_12px_rgba(99,179,237,0.2)]">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
      </span>
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-primary/15 bg-[rgba(6,10,22,0.88)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
        <span className="text-xs text-text-muted">thinking</span>
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={
                reduced
                  ? { opacity: 0.55 }
                  : { opacity: [0.15, 1, 0.15], y: [0, -3, 0] }
              }
              transition={
                reduced
                  ? undefined
                  : { duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
