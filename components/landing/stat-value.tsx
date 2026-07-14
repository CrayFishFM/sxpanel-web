"use client"

import * as React from "react"

const PARSE = /^(\D*)(\d+)(.*)$/

/**
 * Renders a stat like "40+" or "<60s", counting up from 0 to the parsed
 * number once scrolled into view. Falls back to the static value on the
 * server, on unparsable input, and under prefers-reduced-motion.
 */
export function StatValue({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = React.useState(value)
  const match = value.match(PARSE)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !match) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const [, prefix, digits, suffix] = match
    const target = parseInt(digits, 10)
    let raf = 0

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()

        const duration = 900
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 4)
          const current = Math.round(target * eased)
          setDisplay(`${prefix}${current}${suffix}`)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [match])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
