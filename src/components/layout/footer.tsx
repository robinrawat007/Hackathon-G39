import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="font-heading text-h3 text-heading">ShelfAI</div>
            <p className="text-sm text-text-muted">Your shelf. Your taste. Your AI.</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-heading">Explore</div>
            <div className="flex flex-col gap-1 text-sm">
              <Link className="text-text-muted hover:text-text" href="/browse">
                Browse
              </Link>
              <Link className="text-text-muted hover:text-text" href="/community/lists">
                Lists
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-heading">Community</div>
            <div className="flex flex-col gap-1 text-sm">
              <Link className="text-text-muted hover:text-text" href="/community">
                Feed
              </Link>
              <Link className="text-text-muted hover:text-text" href="/onboarding">
                Taste profile
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-heading">Account</div>
            <div className="flex flex-col gap-1 text-sm">
              <Link className="text-text-muted hover:text-text" href="/auth/login">
                Sign in
              </Link>
              <Link className="text-text-muted hover:text-text" href="/auth/signup">
                Create account
              </Link>
              <Link className="text-text-muted hover:text-text" href="/settings">
                Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <div>© 2026 ShelfAI</div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
            <Link className="hover:text-text" href="/legal/privacy">
              Privacy policy
            </Link>
            <Link className="hover:text-text" href="/legal/terms">
              Terms of service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
