"use client"

import * as React from "react"

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(media.matches)
    onChange()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    }

    // eslint-disable-next-line deprecation/deprecation
    media.addListener(onChange)
    // eslint-disable-next-line deprecation/deprecation
    return () => media.removeListener(onChange)
  }, [])

  return reduced
}

