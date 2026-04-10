import type { Metadata } from "next"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export const metadata: Metadata = {
  title: "Train your taste",
  description: "Quick vibe check so AI picks feel like they actually know you.",
}

export default function OnboardingPage() {
  return (
    <div className="min-h-full bg-transparent text-text">
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <OnboardingWizard />
      </main>
      <Footer />
    </div>
  )
}

