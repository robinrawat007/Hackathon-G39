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
import { BookReviewsSection } from "@/components/books/book-reviews-section"
import { JsonLd } from "@/components/seo/json-ld"
import { normalizeBookCoverUrl } from "@/lib/book-cover-url"
import { getBookBySlug, getSimilarBooks } from "@/lib/knowledge-books"
import { BookCoverPlaceholder } from "@/components/books/book-cover-placeholder"
import { BookDetailCover } from "@/components/books/book-detail-cover"
import { absoluteUrl } from "@/lib/site"

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const book = getBookBySlug(slug)
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
              url: normalizeBookCoverUrl(book.coverUrl, "detail"),
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
      images: book.coverUrl ? [normalizeBookCoverUrl(book.coverUrl, "detail")] : undefined,
    },
  }
}

function DetailsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(6rem,9rem)_1fr] sm:items-baseline sm:gap-6">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-text sm:text-right">{value}</dd>
    </div>
  )
}

export default async function BookPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const book = getBookBySlug(slug)

  if (!book) {
    return (
      <div className="flex min-h-full min-w-0 flex-col bg-transparent text-text">
        <Navbar />
        <main id="main" className="container min-w-0 flex-1 pt-20 pb-12 sm:pt-24 sm:pb-16">
          <div className="rounded-md border border-border bg-surface p-6 sm:p-8">
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

  const similar = getSimilarBooks(book, 8)

  const pageUrl = absoluteUrl(`/book/${slug}`)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    url: pageUrl,
    description: book.description?.replace(/\s+/g, " ").trim().slice(0, 5000) ?? undefined,
    image: book.coverUrl ? normalizeBookCoverUrl(book.coverUrl, "detail") : undefined,
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
    <div className="flex min-h-full min-w-0 flex-col bg-transparent text-text">
      <JsonLd data={jsonLd} id="book-jsonld" />
      <Navbar />
      <main id="main" className="container min-w-0 flex-1 pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[1fr_minmax(0,300px)] lg:gap-8 xl:grid-cols-[1fr_minmax(0,360px)]">
          {/* Left */}
          <div className="min-w-0 space-y-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,200px)_1fr] md:grid-cols-[220px_1fr]">
              <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl border border-border shadow-glow sm:mx-0 sm:max-w-[280px]">
                {book.coverUrl ? (
                  <BookDetailCover src={book.coverUrl} title={book.title} author={book.author} />
                ) : (
                  <BookCoverPlaceholder title={book.title} />
                )}
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <h1 className="text-balance font-heading text-h1 text-heading">{book.title}</h1>
                <div className="mt-2 text-sm text-text-muted">{book.author}</div>
                {book.publishedYear ? (
                  <div className="mt-2 text-sm text-text-muted">Published {book.publishedYear}</div>
                ) : null}

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
                    {book.averageRating > 0 ? book.averageRating.toFixed(1) : "No rating"} ·{" "}
                    {book.ratingsCount > 0 ? `${book.ratingsCount.toLocaleString("en-US")} reviews` : "No reviews yet"}
                  </div>
                </div>

                <BookAddToShelf book={book} />
              </div>
            </div>

            <section className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
              <h2 className="font-heading text-h3 text-heading">Description</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {book.description || "No description available for this title yet."}
              </p>
            </section>

            <section className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
              <h2 className="font-heading text-h3 text-heading">Book details</h2>
              <dl className="mt-1 divide-y divide-border">
                <DetailsRow label="Pages" value={book.pageCount ? String(book.pageCount) : "—"} />
                <DetailsRow label="ISBN" value={book.isbn || "—"} />
                <DetailsRow label="Language" value={book.language?.toUpperCase() || "—"} />
                {book.publisher?.trim() ? <DetailsRow label="Publisher" value={book.publisher.trim()} /> : null}
              </dl>
            </section>

            <section className="min-w-0">
              <Tabs defaultValue="reviews">
                <TabsList className="no-scrollbar w-full max-w-full justify-start overflow-x-auto sm:w-auto">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="lists">Lists containing this book</TabsTrigger>
                  <TabsTrigger value="similar">Similar Books</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="mt-4 min-w-0 space-y-4">
                  <BookReviewsSection bookId={book.id} bookTitle={book.title} />
                </TabsContent>

                <TabsContent value="lists">
                  <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
                    <h3 className="font-heading text-h3 text-heading">Lists</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
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
                  {similar.length === 0 ? (
                    <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
                      <p className="text-sm text-text-muted">No similar books found for this title.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {similar.map((b) => (
                        <BookCardMini key={b.id} book={b} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          </div>

          {/* Right */}
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
              <h2 className="font-heading text-h3 text-heading">Why readers like you loved this</h2>
              <WhyYoullLoveIt book={book} />
            </div>

            <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
              <h2 className="font-heading text-h3 text-heading">Readers also enjoyed</h2>
              <div className="mt-3 space-y-2">
                {similar.slice(0, 6).map((b) => (
                  <BookCardMini key={b.id} book={b} />
                ))}
              </div>
              {similar.length > 6 ? (
                <p className="mt-3 text-xs text-text-muted">
                  +{similar.length - 6} more in <span className="font-medium text-heading">Similar Books</span> above.
                </p>
              ) : null}
              <div className="mt-4 border-t border-border/70 pt-4">
                <Link href="/browse" className="text-sm font-medium text-primary transition-colors hover:text-primary-hover">
                  Browse the catalog →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

