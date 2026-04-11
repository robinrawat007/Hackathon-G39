import Link from "next/link"
import { Sparkles } from "lucide-react"

import { BrandLogo } from "@/components/brand/brand-logo"
import { FooterAccountSection } from "@/components/layout/footer-account-section"
import { APP_NAME, APP_TAGLINE, FOOTER_FEATURE_STRIP } from "@/lib/constants"

const linkCol = "space-y-3"
const linkHeading = "text-xs font-semibold uppercase tracking-[0.12em] text-primary/90"
const linkClass = "block text-sm text-text-muted transition-colors hover:text-heading"

export function Footer() {
  return (
    <footer className="section-divider-top relative overflow-hidden border-t border-primary/15 bg-gradient-to-b from-[#faf6ef] via-bg-secondary to-[#f0e8dc]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(196, 149, 106, 0.22), transparent 58%), radial-gradient(ellipse 70% 45% at 0% 100%, rgba(139, 90, 43, 0.1), transparent 52%), radial-gradient(ellipse 60% 50% at 100% 80%, rgba(212, 132, 90, 0.08), transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%238B5E3C' stroke-opacity='0.07'%3E%3Cpath d='M0 60h120M60 0v120'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
        aria-hidden
      />
      <div className="relative">
        <div className="container py-14 md:py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm space-y-4">
              <BrandLogo variant="footer" />
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

          <div className="mt-12 border-t border-border/50 pt-8 text-sm text-text-muted">
            <div>© {new Date().getFullYear()} {APP_NAME}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
