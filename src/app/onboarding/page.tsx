import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export const metadata: Metadata = {
  title: "Taste profile setup",
  description: "Tell ShelfAI what you like to get personalized recommendations.",
}

export default function OnboardingPage() {
  return (
    <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <OnboardingWizard />
      </main>
      <Footer />
    </div>
  )
}

