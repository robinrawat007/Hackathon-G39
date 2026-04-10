export type LLMProvider = "openai" | "anthropic" | "gemini" | "groq" | "openai-compatible"

export interface BookMention {
  title: string
  slug: string
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  bookMentions?: BookMention[]
}

export interface ChatOptions {
  model?: string
  temperature?: number
}

export interface LLMAdapter {
  chat(messages: ChatMessage[], options: ChatOptions): Promise<ReadableStream>
  embed(text: string): Promise<number[]>
}

export interface TasteProfile {
  ratedBooks: { bookId: string; rating: "love" | "liked" | "meh" }[]
  moods: string[]
  goals: string[]
  readingGoal: number
}

export interface ChatWidgetProps {
  isGuest: boolean
  userProfile?: TasteProfile
  initialMessage?: string
}

