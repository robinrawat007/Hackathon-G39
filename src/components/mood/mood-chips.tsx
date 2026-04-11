"use client"

import Link from "next/link"

import { MOODS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export type MoodDef = (typeof MOODS)[number]

/** Grid: 2×4 on small+ — same as the landing mood strip. */
export const moodChipsGridClass =
  "mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-4"

const chipShell =
  "group relative flex min-h-[3.25rem] w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full px-2.5 py-2 text-center shadow-sm transition-[border-color,box-shadow,transform,background-color] duration-200 sm:min-h-[3rem] sm:flex-row sm:gap-2 sm:px-3.5 sm:py-2.5"

const chipInactive = cn(
  chipShell,
  "border border-border/60 bg-surface/90",
  "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_8px_24px_rgba(139,90,43,0.1)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  "active:scale-[0.98]"
)

/** Selected state — soft lavender, aligned with landing “hero” chip in mocks. */
const chipActive = cn(
  chipShell,
  "border border-transparent bg-violet-100/95 text-heading",
  "hover:-translate-y-0.5 hover:bg-violet-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  "active:scale-[0.98]"
)

function MoodGradientOverlay({ gradient }: { gradient: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-[0.14]",
        gradient
      )}
      aria-hidden
    />
  )
}

export function MoodChipLabel({ emoji, label }: { emoji: string; label: string }) {
  return (
    <>
      <span aria-hidden className="relative shrink-0 text-[1.05rem] leading-none sm:text-lg">
        {emoji}
      </span>
      <span className="relative max-w-[9.5rem] text-[11px] font-semibold leading-tight tracking-tight text-heading sm:max-w-none sm:text-left sm:text-xs">
        {label}
      </span>
    </>
  )
}

/** Landing / anywhere: link to browse with mood query. */
export function MoodChipLink({
  mood,
  href,
  className,
}: {
  mood: MoodDef
  href: string
  className?: string
}) {
  return (
    <Link href={href} className={cn(chipInactive, className)}>
      <MoodGradientOverlay gradient={mood.gradient} />
      <MoodChipLabel emoji={mood.emoji} label={mood.label} />
    </Link>
  )
}

/** Browse, dashboard, onboarding: toggle selection. */
export function MoodChipToggle({
  mood,
  active,
  onClick,
  className,
}: {
  mood: MoodDef
  active: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button type="button" onClick={onClick} className={cn(active ? chipActive : chipInactive, className)}>
      {!active && <MoodGradientOverlay gradient={mood.gradient} />}
      <MoodChipLabel emoji={mood.emoji} label={mood.label} />
    </button>
  )
}
