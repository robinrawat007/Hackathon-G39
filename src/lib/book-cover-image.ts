/**
 * Google often rejects requests from Next.js's image optimization endpoint (403).
 * Use `unoptimized` so covers load straight in the browser like a normal <img>.
 */
export function bookCoverNeedsUnoptimized(src: string | undefined | null): boolean {
  if (!src) return false
  return /books\.google\.com|googleusercontent\.com|books\.googleusercontent/i.test(src)
}
