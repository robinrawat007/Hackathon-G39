"use client"

import { motion } from "framer-motion"

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

export function TypingIndicator() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">ShelfAI is typing</span>
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={reduced ? { opacity: 0.55 } : { opacity: [0.2, 1, 0.2] }}
            transition={reduced ? undefined : { duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

