/**
 * Google Books often returns titles/authors in ALL CAPS. Normalize for display
 * without changing strings that already look intentionally mixed case.
 */
export function formatBookDisplayName(raw: string): string {
  const s = raw.trim()
  if (!s) return s

  let alpha = 0
  let upper = 0
  for (const c of s) {
    if (/[A-Za-z]/.test(c)) {
      alpha++
      if (c >= "A" && c <= "Z") upper++
    }
  }
  if (alpha < 2 || upper / alpha < 0.65) return s

  return s
    .toLowerCase()
    .split(/(\s+|[-–—])/)
    .map((part) => {
      if (/^\s+$/.test(part) || /^[-–—]$/.test(part)) return part
      if (!part) return part
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join("")
}
