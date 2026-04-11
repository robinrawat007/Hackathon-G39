"use client"

import Link from "next/link"

import { useAuthDialog } from "@/components/auth/auth-dialog-context"
import { useAuthUser } from "@/lib/hooks/use-auth-user"

const linkHeading = "text-xs font-semibold uppercase tracking-[0.12em] text-primary/90"
const linkClass = "block text-sm text-text-muted transition-colors hover:text-heading"

export function FooterAccountSection() {
  const { openSignIn, openSignUp } = useAuthDialog()
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
          <button type="button" className={`${linkClass} text-left`} onClick={() => openSignIn()}>
            Sign in
          </button>
          <button type="button" className={`${linkClass} text-left`} onClick={() => openSignUp()}>
            Create account
          </button>
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
