export default function Loading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-transparent px-4 py-24 text-text">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-card">
          <span className="text-xs font-medium text-text-muted">…</span>
        </div>
      </div>
      <p className="text-sm text-text-muted">Loading</p>
    </div>
  )
}
