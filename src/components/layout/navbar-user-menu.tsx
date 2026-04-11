"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { LayoutDashboard, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSignOut } from "@/lib/hooks/use-sign-out"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

function initialsFromUser(user: User): string {
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined
  const name = meta?.full_name ?? meta?.name
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    const a = parts[0]?.[0] ?? ""
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : parts[0]?.[1] ?? ""
    return (a + b).toUpperCase().slice(0, 2) || "?"
  }
  const email = user.email?.trim()
  if (email) return email[0]!.toUpperCase()
  return "?"
}

type Props = {
  user: User
  /** Smaller trigger for tight layouts (e.g. mobile sheet header). */
  size?: "default" | "sm"
}

export function NavbarUserMenu({ user, size = "default" }: Props) {
  const reduced = usePrefersReducedMotion()
  const signOut = useSignOut()
  const [open, setOpen] = React.useState(false)
  const initials = initialsFromUser(user)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative shrink-0 rounded-full ring-2 ring-transparent transition-[box-shadow,ring-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            open && "ring-primary/40 shadow-[0_0_20px_rgba(139,90,43,0.25)]",
            size === "sm" ? "h-9 w-9" : "h-10 w-10"
          )}
          aria-label="Account menu"
          aria-expanded={open}
        >
          <Avatar
            className={cn(
              "border border-primary/25 bg-gradient-to-br from-primary/15 to-accent/20",
              size === "sm" ? "h-9 w-9" : "h-10 w-10"
            )}
          >
            <AvatarFallback
              className={cn(
                "bg-gradient-to-br from-primary/25 to-accent/20 font-heading font-semibold text-primary",
                size === "sm" ? "text-xs" : "text-sm"
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(100vw-2rem,15rem)] border-0 bg-transparent p-0 shadow-none"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="overflow-hidden rounded-xl border border-border/80 bg-bg/95 shadow-[0_12px_40px_rgba(139,90,43,0.15),0_4px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl"
        >
          <div
            className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-primary/35 to-transparent"
            aria-hidden
          />
          <nav className="flex flex-col p-1.5" aria-label="Account">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-primary/10"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              My shelf
            </Link>
                <div className="my-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
                <button
              type="button"
              onClick={() => {
                setOpen(false)
                void signOut()
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text-muted transition-colors hover:bg-error/10 hover:text-error"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              Log out
            </button>
          </nav>
        </motion.div>
      </PopoverContent>
    </Popover>
  )
}
