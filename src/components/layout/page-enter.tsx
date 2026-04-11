/**
 * Lightweight shell — avoids framer-motion on the critical path (better LCP / TBT).
 * Prefer CSS for any future enter transitions on inner sections.
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  return <div className="relative flex min-h-full flex-1 flex-col">{children}</div>
}
