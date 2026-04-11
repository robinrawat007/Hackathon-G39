"use client"

import Link from "next/link"

import { useAuthUser } from "@/lib/hooks/use-auth-user"

const linkHeading = "text-xs font-semibold uppercase tracking-[0.12em] text-primary/90"
const linkClass = "block text-sm text-text-muted transition-colors hover:text-heading"

export function FooterAccountSection() {
  const { user, isLoading } = useAuthUser()

  return (
    <div className="space-y-3">
      <div className={linkHeading}>Account</div>
      {!isLoading && user ? (
        <Link className={linkClass} href="/dashboard">
          My shelf
        </Link>
      ) : !isLoading ? (
        <>
          <Link className={linkClass} href="/auth/login">
            Sign in
          </Link>
          <Link className={linkClass} href="/auth/signup">
            Create account
          </Link>
        </>
      ) : null}
      <Link className={linkClass} href="/legal/privacy">
        Privacy policy
      </Link>
      <Link className={linkClass} href="/legal/terms">
        Terms & conditions
      </Link>
    </div>
  )
}
