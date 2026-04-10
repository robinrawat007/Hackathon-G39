import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free ShelfAI account.",
}

export default function SignupPage() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-md rounded-md border border-border bg-surface p-8 shadow-card">
          <h1 className="font-heading text-h2 text-heading">Create your account</h1>
          <p className="mt-2 text-sm text-text-muted">Start building your shelf and get smarter recommendations.</p>
          <SignupForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

