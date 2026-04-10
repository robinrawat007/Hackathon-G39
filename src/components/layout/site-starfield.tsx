"use client"

import * as React from "react"

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"

const STAR_COUNT = 340

type Star = { x: number; y: number; r: number; a: number; tw: number }

/**
 * Full-viewport star field. Renders above `.app-backdrop` but below the
 * translucent app scrim so dots stay visible through the page wash.
 */
export function SiteStarfield() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.15 + 0.35,
      a: Math.random() * 0.45 + 0.42,
      tw: Math.random() * Math.PI * 2,
    }))

    let raf = 0
    let running = true
    let start = performance.now()

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const paint = (t: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w < 2 || h < 2) return

      ctx.clearRect(0, 0, w, h)

      const globalPulse = reduced ? 1 : 0.9 + 0.1 * Math.sin((t - start) * 0.0006)

      for (const s of stars) {
        const flicker = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 0.0009 + s.tw)
        const px = s.x * w
        const py = s.y * h
        const alpha = Math.min(1, s.a * flicker * globalPulse)
        ctx.beginPath()
        ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fill()
        /* faint halo so stars read on very dark bg */
        if (alpha > 0.35) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.22})`
          ctx.arc(px, py, s.r * 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const loop = (t: number) => {
      if (!running) return
      paint(t)
      if (!reduced && running) raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      const vis = document.visibilityState === "visible"
      running = vis
      if (vis && !reduced) {
        start = performance.now()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(loop)
      } else {
        cancelAnimationFrame(raf)
      }
    }

    const onResize = () => {
      resize()
      paint(performance.now())
    }

    resize()
    paint(performance.now())

    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", onVisibility)

    if (!reduced) {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.95]"
      aria-hidden
    />
  )
}
