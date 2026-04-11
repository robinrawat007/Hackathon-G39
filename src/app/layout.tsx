import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"

import { Providers } from "@/app/providers"
import { ChatWidgetBoundary } from "@/components/chat/chat-widget-boundary"
import { PageEnter } from "@/components/layout/page-enter"
import { SITE_NAME, getMetadataBaseUrl, getSiteUrl } from "@/lib/site"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  adjustFontFallback: true,
})

/** Mono is secondary — defer download so Inter + headings win the network. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: `${SITE_NAME} — AI book recommendations tailored to you`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "AI-powered book discovery, shelves that slap, and readers who get it.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — AI book recommendations tailored to you`,
    description: "AI-powered book discovery, shelves that slap, and readers who get it.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI book recommendations tailored to you`,
    description: "AI-powered book discovery, shelves that slap, and readers who get it.",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FEFCF8" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        {/* Warm connection for hero / grid covers (Open Library) — improves LCP when the largest paint is a cover */}
        <link rel="preconnect" href="https://covers.openlibrary.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://covers.openlibrary.org" />
      </head>
      <body className="min-h-full">
        <div className="app-backdrop" aria-hidden />
        <div className="app-shell flex min-h-full min-w-0 flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-heading focus:shadow-card focus:outline-none focus:backdrop-blur-md"
          >
            Skip to content
          </a>
          <div className="relative z-10 flex min-h-full min-w-0 flex-1 flex-col overflow-x-clip bg-[color-mix(in_srgb,var(--color-bg)_50%,transparent)]">
            <Providers>
              <PageEnter>{children}</PageEnter>
              <ChatWidgetBoundary />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
