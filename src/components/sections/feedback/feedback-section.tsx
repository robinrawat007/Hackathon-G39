"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

export function FeedbackSection() {
  const reduced = usePrefersReducedMotion()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg(null)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim(),
          page: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.")
        setStatus("error")
        return
      }
      setStatus("success")
      setMessage("")
    } catch {
      setErrorMsg("Network error. Try again.")
      setStatus("error")
    }
  }

  return (
    <section className="border-t border-border/60 bg-gradient-to-b from-bg-secondary/30 to-bg py-16 md:py-20">
      <div className="container max-w-2xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-border/70 bg-surface/40 p-8 shadow-card backdrop-blur-md md:p-10"
        >
          <h2 className="font-heading text-h2 text-heading">Send us feedback</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Spotted a bug, a confusing screen, or an idea that would make ShelfAI better? Tell us. We read every message
            and use it to improve the product.
          </p>

          {status === "success" ? (
            <div className="mt-6 rounded-xl border border-success/35 bg-success/10 px-4 py-3 text-sm text-success" role="status">
              Thank you — your feedback was sent. We appreciate you taking the time.
            </div>
          ) : (
            <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fb-name" className="text-sm font-medium text-heading">
                    Name <span className="font-normal text-text-muted">(optional)</span>
                  </label>
                  <Input
                    id="fb-name"
                    name="name"
                    className="mt-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="fb-email" className="text-sm font-medium text-heading">
                    Email <span className="font-normal text-text-muted">(optional)</span>
                  </label>
                  <Input
                    id="fb-email"
                    name="email"
                    type="email"
                    className="mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="fb-msg" className="text-sm font-medium text-heading">
                  Your feedback <span className="text-error">*</span>
                </label>
                <p id="fb-msg-hint" className="mt-1 text-xs text-text-muted">
                  A sentence or two is enough. Include steps to reproduce if something broke.
                </p>
                <Textarea
                  id="fb-msg"
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  className="mt-2"
                  placeholder="Example: On Browse, when I filter by Sci-Fi and change the sort order, the list jumps back to page 1 without warning."
                  aria-describedby="fb-msg-hint"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              {errorMsg ? (
                <p className="text-sm text-error" role="alert">
                  {errorMsg}
                </p>
              ) : null}
              <Button type="submit" variant="primary" size="md" loading={status === "loading"}>
                Submit feedback
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
