"use client"

import * as React from "react"
import Link from "next/link"

import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignupForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const onEmailSignup = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createBrowserSupabaseClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (signUpError) throw signUpError
      window.location.href = "/onboarding"
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-up failed")
    } finally {
      setLoading(false)
    }
  }

  const onGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createBrowserSupabaseClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (oauthError) throw oauthError
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed")
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <Button variant="secondary" size="md" fullWidth onClick={() => void onGoogle()} disabled={loading}>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <div className="text-xs text-text-muted">or</div>
        <div className="h-px flex-1 bg-border" />
      </div>

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

