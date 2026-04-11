import { NextResponse } from "next/server"

/** Consistent JSON shape for API failures (clients can read `error`). */
export type ApiErrorBody = {
  error: string
  code?: "INTERNAL" | string
}

export function logApiError(routeLabel: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err)
  const stack = err instanceof Error ? err.stack : undefined
  console.error(`[api] ${routeLabel}`, message, stack ?? "")
}

function publicErrorMessage(err: unknown): string {
  if (process.env.NODE_ENV === "development" && err instanceof Error) {
    return err.message
  }
  return "Something went wrong. Please try again."
}

export function apiInternalError(routeLabel: string, err: unknown): NextResponse {
  logApiError(routeLabel, err)
  return NextResponse.json(
    { error: publicErrorMessage(err), code: "INTERNAL" } satisfies ApiErrorBody,
    { status: 500 }
  )
}

/**
 * Wrap a route handler so unexpected throws become a 500 JSON response and are logged.
 * Use for the whole handler; keep explicit 4xx/5xx returns inside the callback.
 */
function isNextDynamicUsageError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  return /Dynamic server usage/i.test(err.message)
}

export async function withApiErrorHandling(
  routeLabel: string,
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler()
  } catch (err) {
    // Let Next.js static generation / dynamic marking propagate (do not JSON-wrap).
    if (isNextDynamicUsageError(err)) throw err
    return apiInternalError(routeLabel, err)
  }
}
