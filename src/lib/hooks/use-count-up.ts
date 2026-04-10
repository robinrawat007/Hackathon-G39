"use client"

import * as React from "react"

export function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = 0
    const to = Number.isFinite(target) ? target : 0

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}

