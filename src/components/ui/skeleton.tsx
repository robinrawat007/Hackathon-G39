import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative min-h-[0.75rem] overflow-hidden rounded-md skeleton-shimmer", className)}
      aria-hidden="true"
    />
  )
}
