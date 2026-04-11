"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { StaticSignInForm } from "@/components/auth/static-sign-in-form"

type LoginFormProps = {
  /** Post-login path from `?next=` (only same-origin paths are allowed). */
  redirectTo?: string | null
  /** Navbar modal: refresh current page instead of navigating away. */
  stayOnPage?: boolean
  onSuccess?: () => void
  /** Auth popup: switch to sign-up in the same dialog. */
  onSwitchToSignup?: () => void
}

export function LoginForm({ redirectTo, stayOnPage, onSuccess, onSwitchToSignup }: LoginFormProps) {
  const router = useRouter()
  const signupControl =
    onSwitchToSignup != null ? (
      <button
        type="button"
        className="font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline"
        onClick={onSwitchToSignup}
      >
        Create an account
      </button>
    ) : (
      <button
        type="button"
        className="font-medium text-primary underline-offset-2 hover:text-primary-hover hover:underline"
        onClick={() => router.push("/?auth=signup")}
      >
        Create an account
      </button>
    )

  return (
    <div className="space-y-4">
      <StaticSignInForm
        redirectToDashboard={!stayOnPage}
        redirectTo={redirectTo ?? undefined}
        onSuccess={onSuccess}
      />

      <div className="text-center text-sm text-text-muted">
        New here? {signupControl}
      </div>
    </div>
  )
}
