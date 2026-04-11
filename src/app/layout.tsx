import type { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"

import { Providers } from "@/app/providers"
import { PageEnter } from "@/components/layout/page-enter"

const ChatWidget = dynamic(
  () => import("@/components/chat/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
)
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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
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
              <ChatWidget />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
