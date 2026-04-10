import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Rules for using ShelfAI.",
}

export default function TermsPage() {
  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="container max-w-3xl flex-1 space-y-6 py-24 pb-16">
        <div>
          <h1 className="font-heading text-h1 text-heading">Terms of service</h1>
          <p className="mt-2 text-sm text-text-muted">Last updated: April 10, 2026 · draft for development</p>
        </div>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Use of the service</h2>
          <p>
            By accessing ShelfAI you agree to use it lawfully and respectfully. Harassment, spam, scraping that degrades
            the service, or attempts to bypass security are prohibited. Replace this draft with counsel-reviewed language.
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Content & rights</h2>
          <p>
            You retain rights to content you post. You grant ShelfAI a license to host, display, and process that
            content to operate features (for example showing your reviews to other readers).
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">AI disclaimer</h2>
          <p>
            Recommendations and chat answers may be incorrect or incomplete. They are informational, not professional
            advice. Always verify facts, especially for editions, availability, and pricing.
          </p>
        </section>
        <section className="space-y-3 text-sm text-text-muted">
          <h2 className="font-heading text-h3 text-heading">Warranty</h2>
          <p>
            The service is provided “as is” during development. Uptime, accuracy, and feature availability are not
            guaranteed until you publish production terms.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
