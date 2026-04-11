import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/** Legacy `/auth/login` and `/auth/signup` URLs open the global auth dialog via query params. */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname === "/auth/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("auth", "signin")
    const next = searchParams.get("next")
    if (next) url.searchParams.set("next", next)
    const err = searchParams.get("error")
    if (err) url.searchParams.set("auth_error", err)
    url.searchParams.delete("error")
    return NextResponse.redirect(url)
  }

  if (pathname === "/auth/signup") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("auth", "signup")
    const next = searchParams.get("next")
    if (next) url.searchParams.set("next", next)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/login", "/auth/signup"],
}
