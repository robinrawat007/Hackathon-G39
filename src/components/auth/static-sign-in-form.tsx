"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  /** Called after session cookies are applied (e.g. close a dialog). */
  onSuccess?: () => void
  /** When false, stay on the current page after sign-in (navbar popup). Default: go to dashboard. */
  redirectToDashboard?: boolean
  className?: string
}

export function StaticSignInForm({ onSuccess, redirectToDashboard = true, className }: Props) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/static-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? "Sign-in failed")
      }

      // Sign in browser-side so @supabase/ssr writes the session into cookies
      // (not localStorage). The server's requireUser() reads those cookies.
      try {
        const supabase = createBrowserSupabaseClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw new Error(signInError.message)
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : "Session could not be established")
      }

      onSuccess?.()
      if (redirectToDashboard) {
        window.location.href = "/dashboard"
      } else {
        router.refresh()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm text-text-muted" htmlFor="static-signin-email">
            Email
          </label>
          <Input
            id="static-signin-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-text-muted" htmlFor="static-signin-password">
            Password
          </label>
          <Input
            id="static-signin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") void submit()
            }}
          />
        </div>
        {error ? <div className="text-sm text-error">{error}</div> : null}
        <Button variant="primary" size="md" fullWidth loading={loading} onClick={() => void submit()}>
          Sign In
        </Button>
      </div>
    </div>
  )
}
