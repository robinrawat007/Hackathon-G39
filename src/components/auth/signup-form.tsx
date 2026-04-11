"use client"

import * as React from "react"
import Link from "next/link"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/** Supabase returns raw messages like "email rate limit exceeded" — make them actionable. */
function formatSignupError(err: unknown): string {
  const msg = err instanceof Error ? err.message : "Sign-up failed"
  if (/rate limit|too many emails|over_email_send_rate_limit|email.*quota/i.test(msg)) {
    return "Too many confirmation emails were sent from this app. Wait about an hour, then try again — or sign in if you already confirmed your account."
  }
  return msg
}

export function SignupForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  /** Set when sign-up succeeded but email confirmation is required (no session yet). */
  const [awaitingEmailConfirm, setAwaitingEmailConfirm] = React.useState(false)

  const onEmailSignup = async () => {
    setLoading(true)
    setError(null)
    setAwaitingEmailConfirm(false)
    try {
      let supabase: ReturnType<typeof createBrowserSupabaseClient>
      try {
        supabase = createBrowserSupabaseClient()
      } catch {
        throw new Error("Authentication is not configured (missing Supabase environment variables).")
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (signUpError) throw signUpError
      // If the project requires email confirmation, there is no session until the user clicks the link.
      if (!data.session) {
        setAwaitingEmailConfirm(true)
        return
      }
      window.location.href = "/onboarding"
    } catch (e) {
      setError(formatSignupError(e))
    } finally {
      setLoading(false)
    }
  }

  if (awaitingEmailConfirm) {
    return (
      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-text">
          <p className="font-medium text-heading">Check your email</p>
          <p className="mt-2 text-text-muted">
            We sent a confirmation link to <span className="text-heading">{email}</span>. Open it to activate your account,
            then you can finish onboarding.
          </p>
        </div>
        <p className="text-sm text-text-muted">
          Already confirmed?{" "}
          <Link href="/auth/login?next=/onboarding" className="text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm text-text-muted">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label className="text-sm text-text-muted">Password</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        {error ? <div className="text-sm text-error">{error}</div> : null}
        <Button variant="primary" size="md" fullWidth loading={loading} onClick={() => void onEmailSignup()}>
          Create account
        </Button>
      </div>

      <div className="text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </div>
    </div>
  )
}

