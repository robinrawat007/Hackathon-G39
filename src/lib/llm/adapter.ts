import type { ChatMessage, ChatOptions, LLMAdapter, LLMProvider } from "@/types/chat"

type AdapterConfig = {
  apiKey: string
  baseUrl?: string
  model: string
  embeddingModel: string
}

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

function getConfigFromEnv(): AdapterConfig {
  return {
    apiKey: requireEnv("LLM_API_KEY"),
    baseUrl: process.env.LLM_BASE_URL,
    model: process.env.LLM_MODEL ?? "gpt-4o",
    embeddingModel: process.env.LLM_EMBEDDING_MODEL ?? "text-embedding-3-small",
  }
}

function toOpenAIMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({ role: m.role, content: m.content }))
}

async function* streamOpenAIChat(params: {
  baseUrl: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  temperature?: number
}): AsyncGenerator<string> {
  const res = await fetch(`${params.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      messages: toOpenAIMessages(params.messages),
      temperature: params.temperature ?? 0.4,
      stream: true,
    }),
  })

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "")
    throw new Error(`LLM chat failed (${res.status}): ${text}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split("\n\n")
    buffer = parts.pop() ?? ""

    for (const part of parts) {
      const lines = part.split("\n").map((l) => l.trim())
      for (const line of lines) {
        if (!line.startsWith("data:")) continue
        const data = line.slice("data:".length).trim()
        if (!data) continue
        if (data === "[DONE]") return
        try {
          const json = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>
          }
          const token = json.choices?.[0]?.delta?.content
          if (token) yield token
        } catch {
          // ignore malformed chunks
        }
      }
    }
  }
}

async function embedOpenAI(params: { baseUrl: string; apiKey: string; model: string; text: string }) {
  const res = await fetch(`${params.baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      input: params.text,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`LLM embed failed (${res.status}): ${text}`)
  }
  const json = (await res.json()) as { data?: Array<{ embedding?: number[] }> }
  const emb = json.data?.[0]?.embedding
  if (!Array.isArray(emb)) throw new Error("Embedding response missing vector")
  return emb
}

class OpenAICompatibleAdapter implements LLMAdapter {
  private config: AdapterConfig
  private baseUrl: string

  constructor(config: AdapterConfig) {
    this.config = config
    this.baseUrl = (config.baseUrl ?? "https://api.openai.com/v1").replace(/\/+$/, "")
  }

  async chat(messages: ChatMessage[], options: ChatOptions): Promise<ReadableStream> {
    const config = this.config
    const stream = new ReadableStream<string>({
      async start(controller) {
        try {
          for await (const token of streamOpenAIChat({
            baseUrl: (config.baseUrl ?? "https://api.openai.com/v1").replace(/\/+$/, ""),
            apiKey: config.apiKey,
            model: options.model ?? config.model,
            messages,
            temperature: options.temperature,
          })) {
            controller.enqueue(token)
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    })

    return stream
  }

  async embed(text: string): Promise<number[]> {
    return embedOpenAI({
      baseUrl: this.baseUrl,
      apiKey: this.config.apiKey,
      model: this.config.embeddingModel,
      text,
    })
  }
}

class UnsupportedAdapter implements LLMAdapter {
  constructor(private provider: string) {}
  async chat(): Promise<ReadableStream> {
    throw new Error(`Provider not implemented yet: ${this.provider}`)
  }
  async embed(): Promise<number[]> {
    throw new Error(`Provider not implemented yet: ${this.provider}`)
  }
}

export function createLLMAdapter(provider: LLMProvider): LLMAdapter {
  const cfg = getConfigFromEnv()
  // Groq exposes an OpenAI-compatible REST API — route it through the same adapter.
  // Set LLM_BASE_URL=https://api.groq.com/openai/v1 in .env.local.
  if (provider === "openai" || provider === "openai-compatible" || provider === "groq") {
    return new OpenAICompatibleAdapter(cfg)
  }
  if (provider === "anthropic" || provider === "gemini") {
    return new UnsupportedAdapter(provider)
  }
  return new UnsupportedAdapter(provider)
}

export function getProviderFromEnv(): LLMProvider {
  const p = (process.env.LLM_PROVIDER ?? "openai") as LLMProvider
  return p
}

