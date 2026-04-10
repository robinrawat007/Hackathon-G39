"use client"

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

/**
 * Animated neon-style glows behind the hero (respects reduced motion).
 */
export function HeroNeonBackdrop() {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(99,179,237,0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(159,122,234,0.12),transparent_48%)]" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="hero-neon-sweep-conic" />
      <div className="hero-neon-arc" />
      <div className="hero-neon-blob hero-neon-blob--cyan absolute -left-[20%] top-[5%] h-[55vmin] w-[55vmin] rounded-full blur-3xl" />
      <div className="hero-neon-blob hero-neon-blob--violet absolute -right-[15%] bottom-[10%] h-[50vmin] w-[50vmin] rounded-full blur-3xl" />
      <div className="hero-neon-grid absolute inset-0 opacity-[0.35]" />
      <div className="hero-neon-scanlines absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-bg)_72%)]" />
    </div>
  )
}
