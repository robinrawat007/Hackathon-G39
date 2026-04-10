import { Suspense } from "react"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { JsonLd } from "@/components/seo/json-ld"
import { HeroSection } from "@/components/sections/hero/hero-section"
import { HowItWorksSection } from "@/components/sections/how-it-works/how-it-works-section"
import { MoodStripSection } from "@/components/sections/mood-strip/mood-strip-section"
import {
  FeaturedBooksFallback,
  FeaturedBooksSection,
} from "@/components/sections/featured-books/featured-books-server"
import { CommunityProofSection } from "@/components/sections/community-proof/community-proof-section"
import { CTABannerSection } from "@/components/sections/cta-banner/cta-banner-section"
import { SITE_NAME, getSiteUrl } from "@/lib/site"

export default function Home() {
  const siteUrl = getSiteUrl()

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: SITE_NAME,
              url: siteUrl,
              description: "AI-powered book discovery, shelves, and a reader community.",
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: SITE_NAME,
              description: "Your shelf. Your taste. Your AI.",
              publisher: { "@id": `${siteUrl}/#organization` },
            },
          ],
        }}
      />
      <div className="min-h-full bg-bg text-text">
      <Navbar />
      <main id="main" className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <MoodStripSection />
        <Suspense fallback={<FeaturedBooksFallback />}>
          <FeaturedBooksSection />
        </Suspense>
        <CommunityProofSection />
        <CTABannerSection />
      </main>
      <Footer />
    </div>
    </>
  )
}
