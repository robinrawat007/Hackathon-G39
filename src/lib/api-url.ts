import { getSiteUrl } from "@/lib/site"

/**
 * Origin for same-app API routes. Required because relative `fetch("/api/...")` is invalid during
 * React SSR / static prerender (Node has no URL base), so the browser may never hydrate a real request.
 */
export function getApiOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin
  }
  return getSiteUrl()
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${getApiOrigin()}${p}`
}
