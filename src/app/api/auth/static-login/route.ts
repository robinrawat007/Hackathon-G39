import { timingSafeEqual } from "crypto"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { withApiErrorHandling } from "@/lib/api/server-response"

function safeEqualPassword(a: string, b: string): boolean {
  try {
    const ab = Buffer.from(a, "utf8")
    const bb = Buffer.from(b, "utf8")
    if (ab.length !== bb.length) return false
    return timingSafeEqual(ab, bb)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  return withApiErrorHandling("POST /api/auth/static-login", async () => {
    const expectedEmail = process.env.STATIC_AUTH_EMAIL?.trim()
    const expectedPassword = process.env.STATIC_AUTH_PASSWORD ?? ""
    if (!expectedEmail || !expectedPassword) {
      return NextResponse.json({ error: "Static sign-in is not configured on the server." }, { status: 503 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Authentication service is unavailable." }, { status: 503 })
    }

    const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null
    const emailIn = body?.email?.trim() ?? ""
    const passwordIn = body?.password ?? ""

    if (emailIn !== expectedEmail || !safeEqualPassword(passwordIn, expectedPassword)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // ignore when called from a context that cannot set cookies
          }
        },
      },
    })

    const { error } = await supabase.auth.signInWithPassword({
      email: expectedEmail,
      password: expectedPassword,
    })

    if (error) {
      return NextResponse.json(
        {
          error:
            "Sign-in failed. Create a Supabase user whose email/password match STATIC_AUTH_EMAIL and STATIC_AUTH_PASSWORD.",
        },
        { status: 401 }
      )
    }

    return NextResponse.json({ ok: true })
  })
}
