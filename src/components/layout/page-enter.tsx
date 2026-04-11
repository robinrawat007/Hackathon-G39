"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

/**
 * Subtle page shell motion — design-only; does not affect routing or data.
 * Uses the same reduced-motion hook as the rest of the app so SSR + first client
 * paint match (framer's useReducedMotion can diverge and cause hydration errors).
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.div
      className="relative flex min-h-full flex-1 flex-col"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
      }
    >
      {children}
    </motion.div>
  )
}
