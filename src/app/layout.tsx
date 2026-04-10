import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"

import { Providers } from "@/app/providers"
import { ChatWidget } from "@/components/chat/chat-widget"
import { PageEnter } from "@/components/layout/page-enter"
import { SITE_NAME, getMetadataBaseUrl, getSiteUrl } from "@/lib/site"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
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
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#080b14" }],
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
      <body className="min-h-full">
        <div className="app-backdrop" aria-hidden />
        <div className="app-shell flex min-h-full flex-col">
          <a
            href="#main"
            className="fixed left-4 top-4 z-[100] -translate-y-[140%] rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-heading shadow-card outline-none backdrop-blur-md transition-transform duration-200 focus:translate-y-0"
          >
            Skip to content
          </a>
          <Providers>
            <PageEnter>{children}</PageEnter>
            <ChatWidget />
          </Providers>
        </div>
      </body>
    </html>
  )
}
