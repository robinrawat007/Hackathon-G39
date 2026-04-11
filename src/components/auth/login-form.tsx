"use client"

import * as React from "react"
import Link from "next/link"

import { StaticSignInForm } from "@/components/auth/static-sign-in-form"

export function LoginForm() {
  return (
    <div className="mt-6 space-y-4">
      <StaticSignInForm redirectToDashboard />

      <div className="text-sm text-text-muted">
        New here?{" "}
        <Link href="/auth/signup" className="text-primary hover:text-primary-hover">
          Create an account
        </Link>
      </div>
    </div>
  )
}
