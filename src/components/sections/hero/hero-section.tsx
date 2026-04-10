"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { HeroParticles } from "@/components/sections/hero/hero-particles"
import { BookStack3D } from "@/components/sections/hero/book-stack-3d"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

function requestOpenChat() {
  try {
    window.dispatchEvent(new CustomEvent("shelfai:open-chat"))
  } catch {
    // ignore
  }
}

export function HeroSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="relative min-h-[calc(100vh-64px)] pt-28 md:pt-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,179,237,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(159,122,234,0.10),transparent_55%)]" />
        <HeroParticles />
      </div>

      <div className="container">
        <div className="grid items-center gap-10 md:grid-cols-5">
          <div className="md:col-span-3">
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-heading text-display text-gradient-hero tracking-tight"
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
              ShelfAI combines a powerful RAG-based chatbot, personalised AI picks, and a passionate reader community —
              all in one place.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            >
              <motion.div whileHover={reduced ? undefined : { scale: 1.02 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
                <Link href="/onboarding">
                  <Button variant="primary" size="lg" className="shadow-glow transition-shadow duration-300 hover:shadow-hover">
                    Find My Next Book →
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={reduced ? undefined : { scale: 1.02 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
                <Button variant="secondary" size="lg" onClick={requestOpenChat} className="border-primary/30 hover:border-primary/60 hover:shadow-primary-glow">
                  Ask ShelfAI →
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="rounded-full border border-border/60 bg-surface/50 px-3 py-1 text-xs text-text-muted backdrop-blur-sm">
                1,142+ books indexed
              </span>
              <span aria-hidden>·</span>
              <span>RAG-matched picks</span>
              <span aria-hidden>·</span>
              <span>Growing reader community</span>
            </motion.div>
          </div>

          <div className="md:col-span-2">
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

