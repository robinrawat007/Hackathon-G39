/**
 * Some cover CDNs (notably Google Books) return fragile URLs: wrong zoom or crop.
 * We only bump a common `zoom=1` slightly; other hosts pass through unchanged.
 */
export type CoverUrlTier = "list" | "detail"

function normalizeHttps(url: string): string {
  return url.trim().replace(/^http:\/\//i, "https://")
}

export function normalizeBookCoverUrl(url: string, tier: CoverUrlTier = "list"): string {
  const trimmed = url?.trim()
  if (!trimmed) return ""

  const u = normalizeHttps(trimmed)
  const isGoogle = /books\.google\.com/i.test(u) || /googleusercontent\.com/i.test(u)
  if (!isGoogle) return u

  const z = tier === "detail" ? 3 : 2
  if (/[?&]zoom=1(?:&|$|#)/i.test(u)) {
    return u.replace(/([?&])zoom=1\b/i, `$1zoom=${z}`)
  }

  return u
}
