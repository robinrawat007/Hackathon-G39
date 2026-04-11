"use client"

import dynamic from "next/dynamic"

import { SectionErrorBoundary } from "@/components/error-boundary/section-error-boundary"

const ChatWidget = dynamic(
  () => import("@/components/chat/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
)

export function ChatWidgetBoundary() {
  return (
    <SectionErrorBoundary
      title="Chat is temporarily unavailable"
      description="You can keep browsing; try opening chat again in a moment."
    >
      <ChatWidget />
    </SectionErrorBoundary>
  )
}
