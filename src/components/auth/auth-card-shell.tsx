import type { ReactNode } from "react"

import { BrandLogo } from "@/components/brand/brand-logo"
import { cn } from "@/lib/utils"

/** Shared with forms — pill inputs, warm cream field (matches reference sign-in UI). */
export const authFieldInputClassName =
  "h-12 rounded-full border-[rgba(139,90,43,0.22)] bg-[#FFFCF7] shadow-[inset_0_1px_4px_rgba(139,90,43,0.06)]"

type AuthCardShellProps = {
  title: string
  description: string
  children: ReactNode
  /** Dedicated auth routes: full-width cream page strip + card. */
  layout?: "page" | "embedded"
  /** Extra classes on the page card (layout=`page` only). */
  className?: string
}

/**
 * One visual system for sign-in / sign-up: logo, heading, subtitle, form.
 * Use `layout="page"` for full-page auth screens; `embedded` matches the global sign-in dialog.
 */
export function AuthCardShell({ title, description, children, layout = "page", className }: AuthCardShellProps) {
  const Heading = layout === "page" ? "h1" : "h2"
  const inner = (
    <>
      <div className="mb-6 flex justify-center">
        <BrandLogo href={null} variant="header" className="justify-center" />
      </div>
      <Heading className="text-center font-heading text-h2 text-heading">{title}</Heading>
      <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">{description}</p>
      <div className={layout === "page" ? "mt-6" : "mt-5"}>{children}</div>
    </>
  )

  if (layout === "embedded") {
    return <div className="text-text">{inner}</div>
  }

  return (
    <main id="main" className="flex-1 bg-[#F9F5F1] pt-24 pb-16 text-text">
      <div className="container">
        <div
          className={cn(
            "mx-auto max-w-md rounded-2xl border border-[rgba(139,90,43,0.14)] bg-[#FFFCF7] p-8 shadow-card",
            className
          )}
        >
          {inner}
        </div>
      </div>
    </main>
  )
}
