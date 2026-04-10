"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Menu } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/community", label: "Community" },
  { href: "/#how-it-works", label: "How It Works" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const scrim = useTransform(scrollY, [0, 72], [0, 1])
  const backgroundColor = useTransform(scrim, (t) => {
    const a = 0.52 + t * 0.38
    return `rgba(8, 11, 20, ${a})`
  })
  const user = useAuthUser()

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-border backdrop-blur-xl"
      style={{ backgroundColor }}
    >
      <div className="relative">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-lg font-semibold tracking-tight text-gradient-hero">ShelfAI</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => {
              const isActive =
                l.href === pathname ||
                (l.href !== "/#how-it-works" && pathname.startsWith(l.href))
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative text-sm transition-colors duration-200",
                    isActive ? "text-primary" : "text-text-muted hover:text-text"
                  )}
                >
                  <span
                    className={cn(
                      "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:rounded-full after:bg-primary after:transition-transform after:duration-200",
                      isActive
                        ? "after:scale-x-100 after:shadow-[0_0_10px_var(--color-primary-glow)]"
                        : "after:origin-left after:scale-x-0 hover:after:scale-x-100"
                    )}
                  >
                    {l.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? <NotificationBell userId={user.id} /> : null}
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/shelf">
                  <Button variant="primary" size="sm">
                    My Shelf
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button variant="primary" size="sm" className="max-sm:px-2.5 max-sm:text-xs">
                    <span className="sm:hidden">Next book →</span>
                    <span className="hidden sm:inline">Find My Next Book →</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {user ? <NotificationBell userId={user.id} /> : null}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open menu" leftIcon={<Menu className="h-4 w-4" />}>
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-[min(100vw,380px)] border-border bg-bg-secondary/95 backdrop-blur-xl sm:max-w-sm">
                <div className="flex flex-col gap-4">
                  <div className="font-heading text-h3 font-semibold text-gradient-hero">ShelfAI</div>
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((l) => (
                      <Link key={l.href} href={l.href} className="text-base text-text hover:text-primary">
                        {l.label}
                      </Link>
                    ))}
                    {user ? (
                      <>
                        <Link href="/dashboard" className="text-base text-text hover:text-primary">
                          Dashboard
                        </Link>
                        <Link href="/shelf" className="text-base text-text hover:text-primary">
                          My Shelf
                        </Link>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    {user ? (
                      <Link href="/settings">
                        <Button variant="secondary" size="md" fullWidth>
                          Settings
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/auth/login">
                          <Button variant="secondary" size="md" fullWidth>
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/onboarding">
                          <Button variant="primary" size="md" fullWidth>
                            Next book →
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-40"
          style={{
            background: "linear-gradient(90deg, transparent, #63b3ed, #9f7aea, transparent)",
          }}
          aria-hidden
        />
      </div>
    </motion.header>
  )
}
