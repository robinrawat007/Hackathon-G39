export const SITE_NAME = "ShelfAI"

/** Ensures `new URL()` always works (adds http/https if the scheme is missing). */
function normalizeSiteOrigin(raw: string): string {
  const t = raw.trim().replace(/\/$/, "")
  if (!t) return "http://localhost:3000"
  if (/^https?:\/\//i.test(t)) return t
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(t)) return `http://${t}`
  return `https://${t}`
}

/** Canonical site origin for metadata, JSON-LD, and absolute URLs (no trailing slash). */
export function getSiteUrl(): string {
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL
  if (typeof fromPublic === "string" && fromPublic.trim().length > 0) {
    return normalizeSiteOrigin(fromPublic)
  }
  const vercel = process.env.VERCEL_URL
  if (typeof vercel === "string" && vercel.trim().length > 0) {
    return normalizeSiteOrigin(vercel)
  }
  return "http://localhost:3000"
}

/** Safe for `metadataBase` — never throws. */
export function getMetadataBaseUrl(): URL {
  try {
    return new URL(getSiteUrl())
  } catch {
    return new URL("http://localhost:3000")
  }
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}
