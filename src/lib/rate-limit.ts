import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

type LimiterKind = "chat" | "search" | "onboarding" | "llmFeature" | "feedback"

const cache = new Map<LimiterKind, Ratelimit | null>()

function getLimiter(kind: LimiterKind, max: number, window: `${number} s` | `${number} m`) {
  if (cache.has(kind)) return cache.get(kind) ?? null
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    cache.set(kind, null)
    return null
  }
  const redis = new Redis({ url, token })
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix: `booksyai:${kind}`,
    analytics: false,
  })
  cache.set(kind, limiter)
  return limiter
}

export function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return `ip:${first}`
  }
  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return `ip:${realIp}`
  return "ip:unknown"
}

/**
 * Returns a 429 Response when rate limited, or null when allowed / limiting disabled.
 */
export async function rateLimitResponse(
  request: Request,
  kind: LimiterKind,
  limits: { max: number; window: `${number} s` | `${number} m` }
): Promise<Response | null> {
  const limiter = getLimiter(kind, limits.max, limits.window)
  if (!limiter) return null
  const key = getClientKey(request)
  let success: boolean
  let limit: number
  let reset: number
  let remaining: number
  try {
    const result = await limiter.limit(key)
    success = result.success
    limit = result.limit
    reset = result.reset
    remaining = result.remaining
  } catch {
    // Invalid Redis URL/token or network failure — do not block the request
    return null
  }
  if (success) return null
  return new Response(
    JSON.stringify({
      error: "Too many requests. Try again shortly.",
      limit,
      remaining,
      reset,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
      },
    }
  )
}
