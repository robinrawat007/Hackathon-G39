"use client"

import * as React from "react"
import Link from "next/link"

import { StaticSignInForm } from "@/components/auth/static-sign-in-form"

type LoginFormProps = {
  /** Post-login path from `?next=` (only same-origin paths are allowed). */
  redirectTo?: string | null
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  return (
    <div className="mt-6 space-y-4">
      <StaticSignInForm redirectToDashboard redirectTo={redirectTo ?? undefined} />

      <div className="text-sm text-text-muted">
        New here?{" "}
        <Link href="/auth/signup" className="text-primary hover:text-primary-hover">
          Create an account
        </Link>
      </div>
    </div>
  )
}
