import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import { withApiErrorHandling } from "@/lib/api/server-response"
import { createServerSupabaseClient } from "@/lib/supabase/server"

type FollowBody = { followingId?: string; userId?: string }

/** POST /api/community/follow — follow a reader (body: { followingId } or { userId }) */
export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/community/follow", async () => {
    const userOr = await requireUserForApi()
    if (userOr instanceof NextResponse) return userOr
    const me = userOr

    const json = (await request.json().catch(() => null)) as FollowBody | null
    const followingId = (json?.followingId ?? json?.userId ?? "").trim()
    if (!followingId) {
      return NextResponse.json({ error: "followingId is required" }, { status: 400 })
    }
    if (followingId === me.id) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("follows").insert({ follower_id: me.id, following_id: followingId })

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, following: true })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, following: true })
  })
}

/** DELETE /api/community/follow?userId=uuid — unfollow */
export async function DELETE(request: Request) {
  return withApiErrorHandling("DELETE /api/community/follow", async () => {
    const userOr = await requireUserForApi()
    if (userOr instanceof NextResponse) return userOr
    const me = userOr

    const url = new URL(request.url)
    const followingId = (url.searchParams.get("userId") ?? "").trim()
    if (!followingId) {
      return NextResponse.json({ error: "userId query param is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("follows").delete().eq("follower_id", me.id).eq("following_id", followingId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, following: false })
  })
}
