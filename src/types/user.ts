import type { LLMProvider, TasteProfile } from "@/types/chat"

export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  bio: string
  readingGoal: number
  tasteProfile?: TasteProfile
}

export interface UserSettings {
  llmProvider: LLMProvider
  llmModel: string
  llmBaseUrl?: string
  notificationPrefs: { email: boolean; inapp: boolean }
}

