import { createLLMAdapter, getProviderFromEnv } from "@/lib/llm/adapter"

export async function embedText(text: string) {
  const adapter = createLLMAdapter(getProviderFromEnv())
  return adapter.embed(text)
}

