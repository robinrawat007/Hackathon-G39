import { NextResponse } from "next/server"

import { requireUserForApi } from "@/lib/auth/require-user"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { encryptString } from "@/lib/crypto/encrypt"

type Req = {
  llmProvider: string
  llmModel: string
  llmBaseUrl?: string
  llmApiKey?: string
}

export async function POST(request: Request) {
  const userOrResponse = await requireUserForApi()
  if (userOrResponse instanceof NextResponse) return userOrResponse
  const user = userOrResponse
  const json = (await request.json().catch(() => null)) as Req | null
  if (!json?.llmProvider || !json.llmModel) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  let encrypted: string | null = null
  if (json.llmApiKey) {
    try {
      encrypted = encryptString(json.llmApiKey)
    } catch {
      return NextResponse.json(
        { error: "Server encryption is not configured (set ENCRYPTION_SECRET, at least 32 characters)." },
        { status: 503 }
      )
    }
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>
  try {
    admin = createSupabaseAdminClient()
  } catch {
    return NextResponse.json({ error: "Server database admin is not configured." }, { status: 503 })
  }

  const { error } = await admin.from("user_settings").upsert({
    user_id: user.id,
    llm_provider: json.llmProvider,
    llm_model: json.llmModel,
    llm_base_url: json.llmBaseUrl ?? null,
    llm_api_key_encrypted: encrypted,
    updated_at: new Date().toISOString(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

