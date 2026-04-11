/**
 * Some cover hosts reject Next.js image optimization (403). Use `unoptimized` for those URLs.
 */
export function bookCoverNeedsUnoptimized(src: string | undefined | null): boolean {
  if (!src) return false
  // Open Library often 403s or flakes through the optimizer; load covers directly.
  return (
    /books\.google\.com|googleusercontent\.com|books\.googleusercontent/i.test(src) ||
    /covers\.openlibrary\.org/i.test(src)
  )
}
