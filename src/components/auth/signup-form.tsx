"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { authFieldInputClassName } from "@/components/auth/auth-card-shell"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/** Supabase returns raw messages like "email rate limit exceeded" — make them actionable. */
function formatSignupError(err: unknown): string {
  const msg = err instanceof Error ? err.message : "Sign-up failed"
  if (/rate limit|too many emails|over_email_send_rate_limit|email.*quota/i.test(msg)) {
    return "Too many confirmation emails were sent from this app. Wait about an hour, then try again — or sign in if you already confirmed your account."
  }
  return msg
}

type SignupFormProps = {
  /** Auth popup: switch to sign-in in the same dialog. */
  onSwitchToSignIn?: () => void
  /** Called when sign-up yields a session (e.g. close auth dialog). */
  onSuccess?: () => void
  /** After immediate session, navigate here (default `/onboarding`). */
  redirectAfterSession?: string
}

function safeAppPath(path: string | undefined, fallback: string) {
  if (!path) return fallback
  if (path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")) return path
  return fallback
}

export function SignupForm({ onSwitchToSignIn, onSuccess, redirectAfterSession }: SignupFormProps = {}) {
  const router = useRouter()
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
      onSuccess?.()
      window.location.href = safeAppPath(redirectAfterSession, "/onboarding")
    } catch (e) {
      setError(formatSignupError(e))
    } finally {
      setLoading(false)
    }
  }

  if (awaitingEmailConfirm) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 text-sm text-text">
          <p className="font-medium text-heading">Check your email</p>
          <p className="mt-2 text-text-muted">
            We sent a confirmation link to <span className="text-heading">{email}</span>. Open it to activate your account,
            then you can finish onboarding.
          </p>
        </div>
        <p className="text-center text-sm text-text-muted">
          Already confirmed?{" "}
          {onSwitchToSignIn != null ? (
            <button
              type="button"
              className="font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline"
              onClick={onSwitchToSignIn}
            >
              Sign in
            </button>
          ) : (
            <button
              type="button"
              className="font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline"
              onClick={() => router.push("/?auth=signin&next=/onboarding")}
            >
              Sign in
            </button>
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-muted" htmlFor="signup-email">
            Email
          </label>
          <Input
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className={cn(authFieldInputClassName)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-muted" htmlFor="signup-password">
            Password
          </label>
          <Input
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className={cn(authFieldInputClassName)}
          />
        </div>
        {error ? <div className="text-center text-sm text-error">{error}</div> : null}
        <Button
          variant="primary"
          size="md"
          fullWidth
          className="h-12 rounded-full font-semibold shadow-card"
          loading={loading}
          onClick={() => void onEmailSignup()}
        >
          Create account
        </Button>
      </div>

      <div className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        {onSwitchToSignIn != null ? (
          <button
            type="button"
            className="font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline"
            onClick={onSwitchToSignIn}
          >
            Sign in
          </button>
        ) : (
          <button
            type="button"
            className="font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline"
            onClick={() => router.push("/?auth=signin")}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  )
}

