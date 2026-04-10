import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ShelfAI.",
}

export default function LoginPage() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-md rounded-md border border-border bg-surface p-8 shadow-card">
          <h1 className="font-heading text-h2 text-heading">Welcome back</h1>
          <p className="mt-2 text-sm text-text-muted">Sign in to save picks, manage shelves, and join the community.</p>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

