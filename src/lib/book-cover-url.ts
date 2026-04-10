/**
 * Google Books cover URLs are fragile: high zoom values, invented fife sizes, or
 * appended params often 404 or return the wrong crop. We only bump the common
 * default `zoom=1` slightly; everything else is left as the API returned it.
 */
export type CoverUrlTier = "list" | "detail"

function normalizeHttps(url: string): string {
  return url.trim().replace(/^http:\/\//i, "https://")
}

export function upgradeGoogleBooksCoverUrl(url: string, tier: CoverUrlTier = "list"): string {
  const trimmed = url?.trim()
  if (!trimmed) return ""

  const u = normalizeHttps(trimmed)
  const isGoogle = /books\.google\.com/i.test(u) || /googleusercontent\.com/i.test(u)
  if (!isGoogle) return u

  // Detail: 1→3, list: 1→2. Never add zoom, never change fife=, never force zoom≥4 (breaks many volumes).
  const z = tier === "detail" ? 3 : 2
  if (/[?&]zoom=1(?:&|$|#)/i.test(u)) {
    return u.replace(/([?&])zoom=1\b/i, `$1zoom=${z}`)
  }

  return u
}
