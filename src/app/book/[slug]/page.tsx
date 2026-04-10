import type { Metadata } from "next"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookCardMini } from "@/components/books/book-card"
import { BookAddToShelf } from "@/components/books/book-add-to-shelf"
import { WhyYoullLoveIt } from "@/components/books/why-youll-love-it"
import { WriteReview } from "@/components/books/write-review"
import { JsonLd } from "@/components/seo/json-ld"
import { searchGoogleBooks, getBookBySlug } from "@/lib/google-books"
import { upgradeGoogleBooksCoverUrl } from "@/lib/book-cover-url"
import { BookDetailCover } from "@/components/books/book-detail-cover"
import { absoluteUrl } from "@/lib/site"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const book = await getBookBySlug(slug)
  if (!book) return { title: "Book not found" }
  const description =
    book.description?.replace(/\s+/g, " ").trim().slice(0, 160) ??
    `Read reviews and recommendations for ${book.title}.`
  const pageUrl = absoluteUrl(`/book/${slug}`)
  const ogTitle = `${book.title} · ${book.author}`
  return {
    title: `${book.title} — ${book.author}`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: ogTitle,
      description,
      images: book.coverUrl
        ? [
            {
              url: upgradeGoogleBooksCoverUrl(book.coverUrl, "detail"),
              width: 600,
              height: 900,
              alt: `${book.title} cover`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: book.coverUrl ? "summary_large_image" : "summary",
      title: ogTitle,
      description,
      images: book.coverUrl ? [upgradeGoogleBooksCoverUrl(book.coverUrl, "detail")] : undefined,
    },
  }
}

function DetailsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3">
      <div className="text-sm text-text-muted">{label}</div>
      <div className="text-sm text-text text-right">{value}</div>
    </div>
  )
}

export default async function BookPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const book = await getBookBySlug(slug)

  if (!book) {
    return (
      <div className="min-h-full bg-bg text-text">
        <Navbar />
        <main id="main" className="container flex-1 pt-24 pb-16">
          <div className="rounded-md border border-border bg-surface p-8">
            <div className="font-heading text-h2 text-heading">Book not found</div>
            <div className="mt-2 text-sm text-text-muted">
              We couldn’t find that title. Try browsing or searching again.
            </div>
            <div className="mt-6">
              <Link href="/browse">
                <Button variant="secondary" size="md">
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

  const similar = await searchGoogleBooks({
    q: book.genres[0] ? `subject:${book.genres[0]}` : "subject:fiction",
    maxResults: 4,
  })

  const pageUrl = absoluteUrl(`/book/${slug}`)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    url: pageUrl,
    description: book.description?.replace(/\s+/g, " ").trim().slice(0, 5000) ?? undefined,
    image: book.coverUrl ? upgradeGoogleBooksCoverUrl(book.coverUrl, "detail") : undefined,
    isbn: book.isbn ?? undefined,
    datePublished: book.publishedYear ? `${book.publishedYear}` : undefined,
    numberOfPages: book.pageCount ?? undefined,
    aggregateRating:
      book.ratingsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: book.averageRating,
            ratingCount: book.ratingsCount,
          }
        : undefined,
  }

  return (
    <div className="min-h-full bg-bg text-text">
      <JsonLd data={jsonLd} id="book-jsonld" />
      <Navbar />
      <main id="main" className="container flex-1 pt-24 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div>
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="relative aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-md border border-border shadow-glow">
                {book.coverUrl ? (
                  <BookDetailCover src={book.coverUrl} title={book.title} author={book.author} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-bg-secondary text-text-muted">
                    <span className="font-mono text-sm">No cover</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="font-heading text-h1 text-heading">{book.title}</h1>
                <div className="mt-2 text-sm text-text-muted">{book.author}</div>
                <div className="mt-2 text-sm text-text-muted">{book.publishedYear ? `Published ${book.publishedYear}` : ""}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {book.genres.map((g) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <StarRating value={Math.round(book.averageRating)} interactive={false} size="md" />
                  <div className="text-sm text-text-muted">
                    {book.averageRating.toFixed(1)} · {book.ratingsCount.toLocaleString()} reviews
                  </div>
                </div>

                <BookAddToShelf book={book} />
              </div>
            </div>

            <div className="mt-8 rounded-md border border-border bg-surface p-6 shadow-card">
              <div className="font-heading text-h3 text-heading">Description</div>
              <p className="mt-3 text-sm text-text-muted">{book.description || "No description available for this title yet."}</p>
            </div>

            <div className="mt-6 rounded-md border border-border bg-surface p-6 shadow-card">
              <div className="font-heading text-h3 text-heading">Book details</div>
              <div className="mt-2">
                <DetailsRow label="Pages" value={book.pageCount ? String(book.pageCount) : "—"} />
                <DetailsRow label="ISBN" value={book.isbn || "—"} />
                <DetailsRow label="Language" value={book.language?.toUpperCase() || "—"} />
                <DetailsRow label="Publisher" value={book.publisher || "—"} />
              </div>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="reviews">
                <TabsList>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="lists">Lists containing this book</TabsTrigger>
                  <TabsTrigger value="similar">Similar Books</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews">
                  <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                    <div className="font-heading text-h3 text-heading">Write a review</div>
                    <div className="mt-2 text-sm text-text-muted">
                      Drafts submit to the preview pipeline here; after sign-in, the same form will post to your public profile.
                    </div>
                    <WriteReview bookId={book.id} />
                  </div>

                  <div className="mt-4 rounded-md border border-border bg-surface p-6 shadow-card">
                    <div className="font-heading text-h3 text-heading">Recent reviews</div>
                    <div className="mt-2 text-sm text-text-muted">No reviews yet for this title.</div>
                  </div>
                </TabsContent>

                <TabsContent value="lists">
                  <div className="rounded-md border border-border bg-surface p-6 shadow-card">
                    <div className="font-heading text-h3 text-heading">Lists</div>
                    <p className="mt-2 text-sm text-text-muted">
                      Lists that include this title will show here once list data is connected. Browse reader lists in the
                      meantime.
                    </p>
                    <div className="mt-4">
                      <Link href="/community/lists">
                        <Button variant="secondary" size="sm">
                          Browse community lists
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="similar">
                  <div className="grid gap-3 md:grid-cols-2">
                    {similar.map((b) => (
                      <BookCardMini key={b.id} book={b} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right */}
          <aside className="space-y-4">
            <div className="rounded-md border border-border bg-surface p-6 shadow-card">
              <div className="font-heading text-h3 text-heading">Why readers like you loved this</div>
              <WhyYoullLoveIt book={book} />
            </div>

            <div className="rounded-md border border-border bg-surface p-6 shadow-card">
              <div className="font-heading text-h3 text-heading">Readers Also Enjoyed</div>
              <div className="mt-3 space-y-3">
                {similar.slice(0, 4).map((b) => (
                  <BookCardMini key={b.id} book={b} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

