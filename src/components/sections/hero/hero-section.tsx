"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { HeroNeonBackdrop } from "@/components/sections/hero/hero-neon-backdrop"
import { BookStack3D } from "@/components/sections/hero/book-stack-3d"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

function requestOpenChat() {
  try {
    window.dispatchEvent(new CustomEvent("shelfai:open-chat"))
  } catch {
    // ignore
  }
}

const HERO_CAPSULES = [
  "Curated knowledge base",
  "AI that gets your taste",
  "Readers who get it",
] as const

export function HeroSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-14">
      <div className="absolute inset-0 -z-10">
        <HeroNeonBackdrop />
      </div>

      <div className="container min-w-0">
        <div className="grid items-center gap-8 md:grid-cols-5 md:gap-10">
          <div className="min-w-0 md:col-span-3">
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-balance font-heading text-display text-gradient-hero tracking-tight"
            >
              Your AI Knows What to Read Next
            </motion.h1>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="mt-4 max-w-2xl text-body text-text-muted"
            >
              Your next read is one conversation away — recommendations from a real catalog, shelves you control, and
              readers who share your taste.
            </motion.p>

            <motion.div
              className="mt-6 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            >
              <motion.div
                className="w-full sm:w-auto sm:min-w-0 sm:flex-1"
                whileHover={reduced ? undefined : { scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
              >
                <Link href="/onboarding" className="block w-full sm:inline-block sm:w-auto">
                  <Button variant="primary" size="lg" fullWidth className="sm:w-auto sm:min-w-[12rem] shadow-glow transition-shadow duration-300 hover:shadow-hover">
                    Find My Next Book →
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.ul
              className="mt-8 flex list-none flex-wrap items-center gap-2.5 p-0 sm:gap-3"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.45 }}
              aria-label="Product highlights"
            >
              {HERO_CAPSULES.map((label, i) => (
                <motion.li
                  key={label}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                >
                  <motion.span
                    className="group relative isolate inline-flex cursor-default select-none rounded-full p-[1px] shadow-[0_0_18px_rgba(139,90,43,0.1)] transition-shadow duration-300 group-hover:shadow-[0_0_32px_rgba(139,90,43,0.22)]"
                    whileHover={reduced ? undefined : { y: -3, scale: 1.03 }}
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  >
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 via-accent/40 to-accent/30 opacity-75 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <span
                      className="relative block rounded-full border border-primary/20 bg-bg/90 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-text backdrop-blur-md transition-colors duration-300 group-hover:border-primary/40 group-hover:text-heading sm:px-4 sm:py-2 sm:text-[13px]"
                      style={{
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(139,90,43,0.1)",
                      }}
                    >
                      {label}
                    </span>
                  </motion.span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="min-w-0 md:col-span-2">
            <BookStack3D />
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-8 flex justify-center md:mt-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          whileInView={reduced ? undefined : { opacity: 0.55, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-text-muted"
          aria-hidden="true"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </div>
    </section>
  )
}

