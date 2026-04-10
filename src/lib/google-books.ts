import type { Book } from "@/types/book"
import { upgradeGoogleBooksCoverUrl } from "@/lib/book-cover-url"

type GoogleImageLinks = {
  extraLarge?: string
  large?: string
  medium?: string
  small?: string
  thumbnail?: string
  smallThumbnail?: string
}

type GoogleBooksVolume = {
  id: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    description?: string
    publishedDate?: string
    pageCount?: number
    industryIdentifiers?: { type: string; identifier: string }[]
    categories?: string[]
    imageLinks?: GoogleImageLinks
    averageRating?: number
    ratingsCount?: number
    language?: string
    publisher?: string
  }
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function extractIsbn(ids?: { type: string; identifier: string }[]) {
  const list = Array.isArray(ids) ? ids : []
  const isbn13 = list.find((i) => i.type === "ISBN_13")?.identifier
  const isbn10 = list.find((i) => i.type === "ISBN_10")?.identifier
  return isbn13 ?? isbn10 ?? ""
}

function pickBestCoverLink(links: GoogleImageLinks | undefined): string {
  if (!links) return ""
  const order: (keyof GoogleImageLinks)[] = [
    "extraLarge",
    "large",
    "medium",
    "thumbnail",
    "small",
    "smallThumbnail",
  ]
  for (const key of order) {
    const u = links[key]
    if (typeof u === "string" && u.trim()) return u.trim().replace(/^http:\/\//i, "https://")
  }
  return ""
}

function coverUrlFromVolume(v: GoogleBooksVolume) {
  const raw = pickBestCoverLink(v.volumeInfo?.imageLinks)
  if (!raw) return ""
  return upgradeGoogleBooksCoverUrl(raw, "list")
}

export function mapGoogleVolumeToBook(v: GoogleBooksVolume): Book | null {
  const title = v.volumeInfo?.title?.trim()
  const author = v.volumeInfo?.authors?.[0]?.trim() ?? "Unknown author"
  if (!title) return null

  const publishedYear = Number.parseInt((v.volumeInfo?.publishedDate ?? "").slice(0, 4), 10)
  const safeYear = Number.isFinite(publishedYear) ? publishedYear : 0

  const genres = Array.isArray(v.volumeInfo?.categories) ? v.volumeInfo!.categories!.slice(0, 3) : []
  const averageRating = typeof v.volumeInfo?.averageRating === "number" ? v.volumeInfo.averageRating : 0
  const ratingsCount = typeof v.volumeInfo?.ratingsCount === "number" ? v.volumeInfo.ratingsCount : 0

  return {
    id: v.id,
    title,
    author,
    coverUrl: coverUrlFromVolume(v),
    description: v.volumeInfo?.description ?? "",
    genres,
    publishedYear: safeYear,
    pageCount: v.volumeInfo?.pageCount ?? 0,
    isbn: extractIsbn(v.volumeInfo?.industryIdentifiers),
    averageRating,
    ratingsCount,
    slug: toSlug(`${title}-${author}`),
    language: v.volumeInfo?.language?.trim() || undefined,
    publisher: v.volumeInfo?.publisher?.trim() || undefined,
  }
}

export async function searchGoogleBooks(params: {
  q: string
  maxResults: number
  /** Google Books API offset (0-based). */
  startIndex?: number
}): Promise<Book[]> {
  const key = process.env.GOOGLE_BOOKS_API_KEY
  const url = new URL("https://www.googleapis.com/books/v1/volumes")
  url.searchParams.set("q", params.q)
  const max = Math.min(40, Math.max(1, params.maxResults))
  url.searchParams.set("maxResults", String(max))
  url.searchParams.set("startIndex", String(Math.max(0, params.startIndex ?? 0)))
  url.searchParams.set("printType", "books")
  if (key) url.searchParams.set("key", key)

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        const errText = await res.text().catch(() => "")
        console.warn("[Google Books] HTTP", res.status, errText.slice(0, 400))
      }
      return []
    }
    const json = (await res.json()) as { items?: GoogleBooksVolume[] }
    const items = Array.isArray(json.items) ? json.items : []
    return items.map(mapGoogleVolumeToBook).filter((b): b is Book => b !== null)
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Google Books] fetch failed", e)
    }
    return []
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const query = slug.replace(/-/g, " ").trim()
  const candidates = await searchGoogleBooks({ q: query, maxResults: 6 })
  // best-effort exact slug match first, then fallback to first result
  const exact = candidates.find((c) => c.slug === slug)
  return exact ?? candidates[0] ?? null
}


