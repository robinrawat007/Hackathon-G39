"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Menu } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

import { useAuthDialog } from "@/components/auth/auth-dialog-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BrandLogo } from "@/components/brand/brand-logo"
import { NavbarUserMenu } from "@/components/layout/navbar-user-menu"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About Us" },
] as const

function navLinkIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()
  const { openSignIn } = useAuthDialog()
  const { scrollY } = useScroll()
  const scrim = useTransform(scrollY, [0, 72], [0, 1])
  const backgroundColor = useTransform(scrim, (t) => {
    const a = 0.82 + t * 0.14
    return `rgba(254, 252, 248, ${a})`
  })
  const { user, isLoading } = useAuthUser()

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b border-border backdrop-blur-xl"
        style={{ backgroundColor }}
      >
      <div className="relative">
        <div className="container flex h-16 items-center justify-between">
          <BrandLogo variant="header" priority />

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => {
              const isActive = navLinkIsActive(pathname, l.href)
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

          <div className="hidden items-center gap-3 md:flex">
            {user ? <NotificationBell userId={user.id} /> : null}
            {isLoading ? (
              <span className="h-10 w-10 shrink-0 rounded-full bg-bg-secondary/80" aria-hidden />
            ) : user ? (
              <NavbarUserMenu user={user} />
            ) : (
              <Button variant="primary" size="md" className="min-h-10 px-4 font-semibold shadow-card" onClick={() => openSignIn()}>
                Sign In
              </Button>
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
                  <BrandLogo variant="header" className="max-w-[min(360px,88vw)]" />
                  {user && !isLoading ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 p-3">
                      <NavbarUserMenu user={user} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Signed in</div>
                        <div className="truncate text-sm font-medium text-heading">{user.email ?? "Account"}</div>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((l) => (
                      <Link key={l.href} href={l.href} className="text-base text-text hover:text-primary">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                  {!isLoading && !user ? (
                    <div className="mt-4">
                      <Button variant="primary" size="md" fullWidth onClick={() => openSignIn()}>
                        Sign In
                      </Button>
                    </div>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-40"
          style={{
            background: "linear-gradient(90deg, transparent, #C4956A, #8B5E3C, transparent)",
          }}
          aria-hidden
        />
      </div>
    </motion.header>
    </>
  )
}
