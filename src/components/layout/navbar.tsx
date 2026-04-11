"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Menu } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

import { StaticSignInForm } from "@/components/auth/static-sign-in-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { useAuthUser } from "@/lib/hooks/use-auth-user"
import { useSignOut } from "@/lib/hooks/use-sign-out"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About Us" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [signInOpen, setSignInOpen] = React.useState(false)
  const { scrollY } = useScroll()
  const scrim = useTransform(scrollY, [0, 72], [0, 1])
  const backgroundColor = useTransform(scrim, (t) => {
    const a = 0.82 + t * 0.14
    return `rgba(254, 252, 248, ${a})`
  })
  const { user, isLoading } = useAuthUser()
  const signOut = useSignOut()

  return (
    <>
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="max-h-[min(92vh,40rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Use the credentials configured for this deployment (see environment variables).</DialogDescription>
          </DialogHeader>
          <StaticSignInForm redirectToDashboard={false} onSuccess={() => setSignInOpen(false)} className="mt-2" />
        </DialogContent>
      </Dialog>

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
              const isActive = l.href === pathname || pathname.startsWith(l.href)
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
            {isLoading ? (
              <span className="h-10 w-[7.5rem] shrink-0 rounded-md bg-bg-secondary/80" aria-hidden />
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    My Shelf
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" type="button" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="primary" size="md" className="min-h-10 px-4 font-semibold shadow-card" onClick={() => setSignInOpen(true)}>
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
                  <div className="font-heading text-h3 font-semibold text-gradient-hero">ShelfAI</div>
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((l) => (
                      <Link key={l.href} href={l.href} className="text-base text-text hover:text-primary">
                        {l.label}
                      </Link>
                    ))}
                    {user ? (
                      <Link href="/dashboard" className="text-base text-text hover:text-primary">
                        My Shelf
                      </Link>
                    ) : null}
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    {isLoading ? null : user ? (
                      <>
                        <Link href="/settings">
                          <Button variant="secondary" size="md" fullWidth>
                            Settings
                          </Button>
                        </Link>
                        <Button variant="ghost" size="md" fullWidth type="button" onClick={() => void signOut()}>
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" size="md" fullWidth onClick={() => setSignInOpen(true)}>
                        Sign In
                      </Button>
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
            background: "linear-gradient(90deg, transparent, #C4956A, #8B5E3C, transparent)",
          }}
          aria-hidden
        />
      </div>
    </motion.header>
    </>
  )
}
