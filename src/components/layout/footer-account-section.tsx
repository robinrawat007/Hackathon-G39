"use client"

import Link from "next/link"

import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { useSignOut } from "@/lib/hooks/use-sign-out"

const linkHeading = "text-xs font-semibold uppercase tracking-[0.12em] text-primary/90"
const linkClass = "block text-sm text-text-muted transition-colors hover:text-heading"
const buttonClass =
  "block w-full text-left text-sm text-text-muted transition-colors hover:text-heading"

export function FooterAccountSection() {
  const { user, isLoading } = useAuthUser()
  const signOut = useSignOut()

  return (
    <div className="space-y-3">
      <div className={linkHeading}>Account</div>
      {!isLoading && user ? (
        <button type="button" className={buttonClass} onClick={() => void signOut()}>
          Sign out
        </button>
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
