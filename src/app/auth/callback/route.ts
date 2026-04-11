import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const error = url.searchParams.get("error")
  const errorDescription = url.searchParams.get("error_description")

  if (error) {
    return NextResponse.redirect(
      new URL(`/?auth=signin&auth_error=${encodeURIComponent(errorDescription ?? error)}`, url.origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?auth=signin&auth_error=Missing%20code", url.origin))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/?auth=signin&auth_error=Missing%20Supabase%20env", url.origin))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const c of cookiesToSet) cookieStore.set(c.name, c.value, c.options)
      },
    },
  })

  const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    return NextResponse.redirect(
      new URL(`/?auth=signin&auth_error=${encodeURIComponent(exchangeError.message)}`, url.origin)
    )
  }

  // Redirect new users to onboarding; returning users to dashboard.
  const userId = sessionData.user?.id
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()
    if (profile) {
      return NextResponse.redirect(new URL("/dashboard", url.origin))
    }
  }

  return NextResponse.redirect(new URL("/onboarding", url.origin))
}

