import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How ShelfAI handles information you share with the product.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container max-w-3xl flex-1 space-y-6 py-24 pb-16">
        <div>
          <h1 className="font-heading text-h1 text-heading">Privacy policy</h1>
          <p className="mt-2 text-sm text-text-muted">Last updated: April 10, 2026 · draft for development</p>
        </div>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Summary</h2>
          <p>
            ShelfAI is built for readers. This page describes, at a high level, what the app may collect and why. Replace
            this draft with counsel-reviewed text before launch.
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Information you provide</h2>
          <p>
            Accounts, onboarding answers, reviews, shelf data, and chat messages you submit may be stored to operate the
            service (recommendations, community features, support). Do not submit sensitive personal data you would not
            want processed by vendors listed in your deployment.
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Third parties</h2>
          <p>
            Hosted deployments typically rely on infrastructure and AI providers (for example database, auth, analytics,
            and model APIs). Their processing is governed by their respective terms and privacy policies.
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Cookies & storage</h2>
          <p>
            The product may use browser storage for auth sessions and client-side shelf
            previews before backend sync is enabled.
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Contact</h2>
          <p>
            For privacy requests, use the contact channel you configure for production. Until then, reach your team through
            your internal process.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
