"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { AuthCardShell } from "@/components/auth/auth-card-shell"
import { AuthDialogContext, type AuthDialogContextValue } from "@/components/auth/auth-dialog-context"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export type { AuthDialogContextValue }
export { useAuthDialog, useAuthDialogOptional } from "@/components/auth/auth-dialog-context"

function isSafeRedirectPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")
}

/** URL-driven auth modal — uses props so we never read AuthDialogContext under Suspense (avoids rare invalid hook / context races). */
function AuthSearchParamsSync({
  openSignIn,
  openSignUp,
}: Pick<AuthDialogContextValue, "openSignIn" | "openSignUp">) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    const auth = searchParams.get("auth")
    if (auth !== "signin" && auth !== "signup") return

    const nextRaw = searchParams.get("next")
    const redirectTo =
      nextRaw && isSafeRedirectPath(nextRaw) ? nextRaw : undefined
    const errRaw = searchParams.get("auth_error")
    const authError = errRaw ? decodeURIComponent(errRaw) : null

    if (auth === "signup") {
      openSignUp({ redirectTo })
    } else {
      openSignIn({ redirectTo, authError })
    }

    const params = new URLSearchParams(searchParams.toString())
    params.delete("auth")
    params.delete("next")
    params.delete("auth_error")
    const q = params.toString()
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }, [searchParams, pathname, router, openSignIn, openSignUp])

  return null
}

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<"signin" | "signup">("signin")
  const [pendingRedirect, setPendingRedirect] = React.useState<string | undefined>(undefined)
  const [bannerError, setBannerError] = React.useState<string | null>(null)

  const openSignIn = React.useCallback((options?: { redirectTo?: string; authError?: string | null }) => {
    setView("signin")
    setPendingRedirect(options?.redirectTo)
    setBannerError(options?.authError ?? null)
    setOpen(true)
  }, [])

  const openSignUp = React.useCallback((options?: { redirectTo?: string }) => {
    setView("signup")
    setPendingRedirect(options?.redirectTo)
    setBannerError(null)
    setOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setOpen(false)
    setPendingRedirect(undefined)
    setBannerError(null)
  }, [])

  const ctx = React.useMemo<AuthDialogContextValue>(
    () => ({ openSignIn, openSignUp, close }),
    [openSignIn, openSignUp, close]
  )

  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next)
    if (!next) {
      setPendingRedirect(undefined)
      setBannerError(null)
    }
  }, [])

  return (
    <AuthDialogContext.Provider value={ctx}>
      <React.Suspense fallback={null}>
        <AuthSearchParamsSync openSignIn={openSignIn} openSignUp={openSignUp} />
      </React.Suspense>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[min(92vh,40rem)] overflow-y-auto rounded-2xl border-[rgba(139,90,43,0.14)] bg-[#FFFCF7] p-8 shadow-hover sm:max-w-md">
          <DialogTitle className="sr-only">
            {view === "signin" ? "Sign in to BooksyAI" : "Create a BooksyAI account"}
          </DialogTitle>
          {bannerError ? (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {bannerError}
            </p>
          ) : null}
          <AuthCardShell
            layout="embedded"
            title={view === "signin" ? "Welcome back" : "Create your account"}
            description={
              view === "signin"
                ? "Sign in to save picks, manage shelves, and join the community."
                : "Start building your shelf and get smarter recommendations."
            }
          >
            {view === "signin" ? (
              <LoginForm
                redirectTo={pendingRedirect ?? undefined}
                onSuccess={close}
                onSwitchToSignup={() => setView("signup")}
              />
            ) : (
              <SignupForm
                redirectAfterSession={pendingRedirect}
                onSuccess={close}
                onSwitchToSignIn={() => setView("signin")}
              />
            )}
          </AuthCardShell>
        </DialogContent>
      </Dialog>

      {children}
    </AuthDialogContext.Provider>
  )
}
