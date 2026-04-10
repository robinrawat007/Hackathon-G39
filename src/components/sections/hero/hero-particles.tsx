"use client"

import * as React from "react"

const FPS_LIMIT = 60
const PARTICLE_COUNT = 64

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function HeroParticles() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let last = 0
    let running = true

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: rand(-0.02, 0.02),
      vy: rand(-0.015, 0.015),
      r: rand(0.8, 2.2),
      a: rand(0.2, 0.9),
    }))

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onVisibility = () => {
      running = document.visibilityState === "visible"
      if (running) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      } else {
        cancelAnimationFrame(raf)
      }
    }

    const loop = (t: number) => {
      const dt = t - last
      const minFrame = 1000 / FPS_LIMIT
      if (dt < minFrame) {
        raf = requestAnimationFrame(loop)
        return
      }
      last = t

      const w = canvas.clientWidth
      const h = canvas.clientHeight

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"

      for (const p of particles) {
        p.x += p.vx * (dt / 16.67)
        p.y += p.vy * (dt / 16.67)

        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05
        if (p.y < -0.05) p.y = 1.05
        if (p.y > 1.05) p.y = -0.05

        const px = p.x * w
        const py = p.y * h

        ctx.beginPath()
        ctx.fillStyle = `rgba(168, 85, 247, ${p.a})`
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `rgba(245, 158, 11, ${p.a * 0.35})`
        ctx.arc(px + 1, py + 1, p.r * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"

      if (running) raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)

    last = performance.now()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  )
}

