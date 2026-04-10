/**
 * Google Books returns small thumbnails by default. Prefer larger `imageLinks`
 * when present, and bump URL params (zoom / fife) for sharper covers in the UI.
 */
export type CoverUrlTier = "list" | "detail"

export function upgradeGoogleBooksCoverUrl(url: string, tier: CoverUrlTier = "list"): string {
  const trimmed = url?.trim()
  if (!trimmed) return ""

  let u = trimmed.replace(/^http:\/\//i, "https://")
  const isGoogleBooks = /books\.google\.com/i.test(u) || /googleusercontent\.com/i.test(u)

  if (!isGoogleBooks) return u

  const zoom = tier === "detail" ? 5 : 3
  if (/[?&]zoom=\d+/i.test(u)) {
    u = u.replace(/([?&])zoom=\d+/gi, `$1zoom=${zoom}`)
  } else {
    u += (u.includes("?") ? "&" : "?") + `zoom=${zoom}`
  }

  // Publisher / content URLs often use fife=wNNN-hNNN — request more pixels for retina.
  u = u.replace(/fife=w(\d+)-h(\d+)/i, (_, w: string, h: string) => {
    const nw = tier === "detail" ? Math.max(Number(w), 600) : Math.max(Number(w), 400)
    const nh = tier === "detail" ? Math.max(Number(h), 900) : Math.max(Number(h), 600)
    return `fife=w${nw}-h${nh}`
  })

  return u
}
