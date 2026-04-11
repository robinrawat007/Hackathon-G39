import { NextResponse } from "next/server"
import { z } from "zod"

import { withApiErrorHandling } from "@/lib/api/server-response"
import { rateLimitResponse } from "@/lib/rate-limit"

const feedbackSchema = z.object({
  name: z.string().max(120).optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  message: z.string().min(10, "Please write at least a few words.").max(5000),
  page: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  return withApiErrorHandling("POST /api/feedback", async () => {
  const limited = await rateLimitResponse(request, "feedback", { max: 8, window: "1 m" })
  if (limited) return limited

  const json = (await request.json().catch(() => null)) as unknown
  const parsed = feedbackSchema.safeParse(
    typeof json === "object" && json !== null
      ? {
          ...json,
          name: typeof (json as Record<string, unknown>).name === "string" ? (json as Record<string, string>).name.trim() : undefined,
          email: typeof (json as Record<string, unknown>).email === "string" ? (json as Record<string, string>).email.trim() : undefined,
          message:
            typeof (json as Record<string, unknown>).message === "string" ? (json as Record<string, string>).message.trim() : "",
        }
      : json
  )
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
  }

  const webhook =
    process.env.N8N_FEEDBACK_WORKFLOW_URL?.trim() ||
    process.env.N8N_FEEDBACK_WEBHOOK_URL?.trim()
  const payload = {
    ...parsed.data,
    source: "booksyai-web",
    sentAt: new Date().toISOString(),
  }

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        return NextResponse.json({ error: "Could not deliver feedback right now." }, { status: 502 })
      }
    } catch {
      return NextResponse.json({ error: "Could not deliver feedback right now." }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true, delivered: Boolean(webhook) })
  })
}
