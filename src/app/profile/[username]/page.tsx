import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/seo/json-ld"
import { absoluteUrl } from "@/lib/site"

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params
  const handle = username.replace(/^@/, "")
  return {
    title: `@${handle}`,
    description: `Reader profile for @${handle} on ShelfAI — shelves, lists, and community activity.`,
    alternates: { canonical: absoluteUrl(`/profile/${encodeURIComponent(handle)}`) },
    openGraph: {
      title: `@${handle} · ShelfAI`,
      description: `See what @${handle} is reading and recommending.`,
      url: absoluteUrl(`/profile/${encodeURIComponent(handle)}`),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `@${handle} · ShelfAI`,
    },
  }
}

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const { username } = await props.params
  const handle = username.replace(/^@/, "")

  const profileUrl = absoluteUrl(`/profile/${encodeURIComponent(handle)}`)

  return (
    <div className="min-h-full bg-bg text-text">
      <JsonLd
        id="profile-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: profileUrl,
          name: `@${handle}`,
          description: `Public reader profile for @${handle}.`,
          mainEntity: {
            "@type": "Person",
            name: `@${handle}`,
            identifier: handle,
          },
        }}
      />
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="rounded-md border border-border bg-surface p-8 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-h1 text-heading">@{handle}</h1>
              <p className="mt-2 max-w-xl text-sm text-text-muted">
                Public profiles will sync with your ShelfAI account when signed in. Below is sample layout and copy — no
                live account data yet.
              </p>
            </div>
            <Badge variant="secondary">Public preview</Badge>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-border bg-bg-secondary p-6">
              <div className="text-sm text-text-muted">Books read (sample)</div>
              <div className="mt-2 font-heading text-h2 text-heading">42</div>
            </div>
            <div className="rounded-md border border-border bg-bg-secondary p-6">
              <div className="text-sm text-text-muted">Avg rating given</div>
              <div className="mt-2 font-heading text-h2 text-heading">4.2</div>
            </div>
            <div className="rounded-md border border-border bg-bg-secondary p-6">
              <div className="text-sm text-text-muted">Followers (sample)</div>
              <div className="mt-2 font-heading text-h2 text-heading">128</div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="font-heading text-h3 text-heading">Recent lists</div>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/community/lists/1" className="text-text-muted hover:text-heading">
                    Short sci‑fi that still hits hard
                  </Link>
                </li>
                <li>
                  <Link href="/community/lists/2" className="text-text-muted hover:text-heading">
                    Cozy mysteries for late nights
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-heading text-h3 text-heading">Activity</div>
              <ul className="mt-4 space-y-3 text-sm text-text-muted">
                <li>Finished <span className="text-heading">Project Hail Mary</span> · 5★</li>
                <li>Added <span className="text-heading">Babel</span> to Want to Read</li>
                <li>Posted a review on <span className="text-heading">Tomorrow, and Tomorrow, and Tomorrow</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/community">
              <Button variant="secondary" size="sm">
                Community feed
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="ghost" size="sm">
                Browse books
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
