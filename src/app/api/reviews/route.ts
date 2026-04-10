import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import { reviewSchema } from "@/lib/validations/review.schema"

export async function POST(request: Request) {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse

  const json = (await request.json().catch(() => null)) as unknown
  if (!json || typeof json !== "object") return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const parsed = reviewSchema.safeParse((json as Record<string, unknown>) ?? {})
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 })

  // Supabase persistence will use userOrResponse.id once the reviews table + RLS are in place.
  void userOrResponse.id
  return NextResponse.json({ ok: true })
}

