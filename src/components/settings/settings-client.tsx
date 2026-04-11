"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const PROVIDERS = ["openai", "anthropic", "gemini", "groq", "openai-compatible"] as const

export function SettingsClient() {
  const [llmProvider, setLlmProvider] = React.useState<(typeof PROVIDERS)[number]>("openai")
  const [llmModel, setLlmModel] = React.useState("gpt-4o")
  const [llmBaseUrl, setLlmBaseUrl] = React.useState("")
  const [llmApiKey, setLlmApiKey] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [status, setStatus] = React.useState<string | null>(null)

  const onSave = async () => {
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch("/api/settings/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ llmProvider, llmModel, llmBaseUrl: llmBaseUrl || undefined, llmApiKey: llmApiKey || undefined }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || "Failed to save")
      }
      setLlmApiKey("")
      setStatus("Saved securely.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-h1 text-heading">Settings</h1>
        <p className="mt-2 text-sm text-text-muted">
          Configure your LLM provider. Your API key is stored encrypted server-side (never in localStorage).
        </p>
      </div>

      <section className="rounded-md border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="font-heading text-h3 text-heading">LLM configuration</div>
          <Badge variant="secondary">Encrypted at rest</Badge>
        </div>

        <div className="mt-4 grid gap-4">
          <div>
            <label className="text-sm text-text-muted">Provider</label>
            <select
              className="mt-2 h-11 w-full rounded-md border border-border bg-bg-secondary px-3 font-sans text-sm text-text"
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value as (typeof PROVIDERS)[number])}
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-text-muted">Model</label>
            <Input value={llmModel} onChange={(e) => setLlmModel(e.target.value)} placeholder="e.g. gpt-4o, claude-3-5-sonnet..." />
          </div>

          <div>
            <label className="text-sm text-text-muted">Base URL (openai-compatible only)</label>
            <Input value={llmBaseUrl} onChange={(e) => setLlmBaseUrl(e.target.value)} placeholder="https://api.openai.com/v1" />
          </div>

          <div>
            <label className="text-sm text-text-muted">API Key</label>
            <Input value={llmApiKey} onChange={(e) => setLlmApiKey(e.target.value)} placeholder="sk-..." type="password" />
            <div className="mt-1 text-xs text-text-muted">Leave blank to keep your existing key unchanged.</div>
          </div>

          {status ? <div className="text-sm text-text-muted">{status}</div> : null}

          <div className="pt-2">
            <Button variant="primary" size="md" loading={saving} onClick={() => void onSave()}>
              Save settings
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

