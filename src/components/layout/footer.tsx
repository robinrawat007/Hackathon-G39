import Link from "next/link"
import { BookOpen, Sparkles } from "lucide-react"

import { FooterAccountSection } from "@/components/layout/footer-account-section"
import { APP_NAME, APP_TAGLINE, FOOTER_FEATURE_STRIP } from "@/lib/constants"

const linkCol = "space-y-3"
const linkHeading = "text-xs font-semibold uppercase tracking-[0.12em] text-primary/90"
const linkClass = "block text-sm text-text-muted transition-colors hover:text-heading"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-primary/20 bg-bg-secondary">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196, 149, 106, 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(139, 90, 43, 0.07), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <div className="container py-14 md:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" aria-hidden />
                </span>
                <span className="font-heading text-lg font-semibold text-gradient-hero">{APP_NAME}</span>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">{APP_TAGLINE}</p>
              <p className="flex items-start gap-2 text-xs leading-snug text-text-muted">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                <span>{FOOTER_FEATURE_STRIP}</span>
              </p>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-8 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-10 lg:max-w-2xl lg:justify-items-end">
              <div className={linkCol}>
                <div className={linkHeading}>Explore</div>
                <Link className={linkClass} href="/browse">
                  Browse
                </Link>
                <Link className={linkClass} href="/onboarding">
                  Taste profile
                </Link>
                <Link className={linkClass} href="/community/lists">
                  Lists
                </Link>
              </div>
              <div className={linkCol}>
                <div className={linkHeading}>Community</div>
                <Link className={linkClass} href="/community">
                  Feed
                </Link>
              </div>
              <FooterAccountSection />
            </div>
          </div>

          <div className="mt-12 border-t border-border/60 pt-8 text-sm text-text-muted">
            <div>© {new Date().getFullYear()} ShelfAI</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
