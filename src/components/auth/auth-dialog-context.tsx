"use client"

import * as React from "react"

export type AuthDialogContextValue = {
  openSignIn: (options?: { redirectTo?: string; authError?: string | null }) => void
  openSignUp: (options?: { redirectTo?: string }) => void
  close: () => void
}

export const AuthDialogContext = React.createContext<AuthDialogContextValue | null>(null)

export function useAuthDialog(): AuthDialogContextValue {
  const ctx = React.useContext(AuthDialogContext)
  if (!ctx) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider")
  }
  return ctx
}

export function useAuthDialogOptional(): AuthDialogContextValue | null {
  return React.useContext(AuthDialogContext)
}
