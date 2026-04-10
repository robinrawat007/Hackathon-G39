"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

/**
 * Subtle page shell motion — design-only; does not affect routing or data.
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="flex min-h-full flex-1 flex-col"
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
