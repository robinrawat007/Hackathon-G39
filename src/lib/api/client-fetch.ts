/**
 * Typed fetch helpers for same-origin `/api/*` routes that return JSON `{ error?: string }` on failure.
 */

export class ApiRequestError extends Error {
  readonly status: number
  readonly body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.body = body
  }
}

/** Parse a failed response body for a user-visible message (works for JSON or plain text). */
export async function getApiErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const parsed = JSON.parse(text) as { error?: unknown }
    if (typeof parsed?.error === "string" && parsed.error.trim()) return parsed.error
  } catch {
    /* not JSON */
  }
  const t = text.trim()
  if (t) return t.length > 280 ? `${t.slice(0, 280)}…` : t
  return res.statusText || "Request failed"
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  const contentType = res.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")

  if (!res.ok) {
    const text = await res.text()
    let message = res.statusText || "Request failed"
    let body: unknown
    try {
      body = JSON.parse(text) as unknown
      if (
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error: unknown }).error === "string"
      ) {
        message = (body as { error: string }).error
      } else if (text.trim()) {
        message = text.length > 280 ? `${text.slice(0, 280)}…` : text
      }
    } catch {
      if (text.trim()) message = text.length > 280 ? `${text.slice(0, 280)}…` : text
    }
    throw new ApiRequestError(message, res.status, body)
  }

  if (res.status === 204) return undefined as T

  if (!isJson) {
    throw new ApiRequestError("Expected JSON response", res.status)
  }

  return (await res.json()) as T
}
