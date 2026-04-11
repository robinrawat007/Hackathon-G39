import type { Metadata } from "next"

import { BrandLogo } from "@/components/brand/brand-logo"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to BooksyAI.",
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const nextRaw = searchParams.next
  const next = typeof nextRaw === "string" ? nextRaw : undefined

  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-md rounded-md border border-border bg-surface p-8 shadow-card">
          <div className="mb-6 flex justify-center">
            <BrandLogo href={null} variant="header" className="justify-center" />
          </div>
          <h1 className="font-heading text-h2 text-heading">Welcome back</h1>
          <p className="mt-2 text-sm text-text-muted">Sign in to save picks, manage shelves, and join the community.</p>
          <LoginForm redirectTo={next} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

