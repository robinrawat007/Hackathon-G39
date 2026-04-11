"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

const ctaButtonClass =
  "border-primary/60 bg-bg-secondary/90 text-heading shadow-card backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-surface hover:shadow-primary-glow"

export function CTABannerSection() {
  const reduced = usePrefersReducedMotion()
  const { user, isLoading } = useAuthUser()

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="shelfai-cta-shimmer relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/25 via-accent/20 to-primary/20 p-10 shadow-glow backdrop-blur-md md:p-12"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(196,149,106,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(139,90,43,0.2), transparent 50%)",
            }}
            aria-hidden
          />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="font-heading text-h2 text-heading drop-shadow-sm">Lock in your next obsession</div>
              <div className="mt-2 max-w-xl text-sm text-text-muted">
                Free account: saved picks, shelves that sync, and a crew who reads like you do.
              </div>
            </div>
            <motion.div whileHover={reduced ? undefined : { scale: 1.04 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
              {isLoading ? (
                <Button variant="secondary" size="lg" className={ctaButtonClass} loading disabled aria-busy="true">
                  Loading
                </Button>
              ) : user ? (
                <Link href="/dashboard">
                  <Button variant="secondary" size="lg" className={ctaButtonClass}>
                    Open your shelf →
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <Button variant="secondary" size="lg" className={ctaButtonClass}>
                    Claim my shelf →
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

