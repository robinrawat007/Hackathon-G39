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
  "Live catalog sync",
  "AI that gets your taste",
  "Readers who get it",
] as const

export function HeroSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] pt-24 sm:pt-28 md:min-h-[calc(100vh-64px)] md:pt-32">
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
              Your next obsession is one smart conversation away — AI-powered picks, a killer community, and shelves that
              actually get finished.
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
              <motion.div
                className="w-full sm:w-auto sm:min-w-0 sm:flex-1"
                whileHover={reduced ? undefined : { scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="sm:w-auto sm:min-w-[12rem] border-primary/30 hover:border-primary/60 hover:shadow-primary-glow"
                  onClick={requestOpenChat}
                >
                  Ask ShelfAI →
                </Button>
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
                    className="group relative isolate inline-flex cursor-default select-none rounded-full p-[1px] shadow-[0_0_18px_rgba(99,179,237,0.1)] transition-shadow duration-300 group-hover:shadow-[0_0_32px_rgba(99,179,237,0.28)]"
                    whileHover={reduced ? undefined : { y: -3, scale: 1.03 }}
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  >
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/65 via-accent/50 to-cyan-400/40 opacity-75 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <span
                      className="relative block rounded-full border border-white/[0.14] bg-[rgba(6,10,20,0.82)] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-200 backdrop-blur-md transition-colors duration-300 group-hover:border-primary/40 group-hover:text-heading sm:px-4 sm:py-2 sm:text-[13px]"
                      style={{
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.11), inset 0 -1px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(99,179,237,0.1)",
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

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
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

