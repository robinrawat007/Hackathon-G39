import { BookOpen } from "lucide-react"

import { cn } from "@/lib/utils"

function initialsFromTitle(title: string): string {
  const parts = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
  return parts.length > 0 ? parts.join("") : "BK"
}

type Props = {
  title: string
  className?: string
}

/** Decorative fallback when a catalog title has no cover URL. */
export function BookCoverPlaceholder({ title, className }: Props) {
  const initials = initialsFromTitle(title)
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-bg-secondary via-[rgba(196,149,106,0.14)] to-bg-secondary p-4 text-center",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(139, 90, 43, 0.12), transparent 55%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(196, 149, 106, 0.1), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-2.5">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-bg/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-sm">
          <BookOpen className="h-7 w-7 text-primary/75" strokeWidth={1.5} aria-hidden />
        </div>
        <span className="font-heading text-xl font-semibold tabular-nums tracking-tight text-primary/55">{initials}</span>
        <span className="max-w-[12rem] font-sans text-xs leading-snug text-text-muted line-clamp-3">{title}</span>
      </div>
    </div>
  )
}
