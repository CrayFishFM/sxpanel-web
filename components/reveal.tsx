"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * Reveals its children with a subtle fade + rise when scrolled into view.
 *
 * Content is visible by default (SSR / no-JS safe). Only after hydration does
 * it apply the hidden pre-reveal state — via a layout effect, so there is no
 * flash of visible→hidden. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const [shown, setShown] = React.useState(false)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setMounted(true)
      setShown(true)
      return
    }

    setMounted(true)

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown && mounted ? `${delay}ms` : "0ms" }}
      className={cn(
        "motion-reduce:transition-none",
        mounted &&
          "transition-all duration-700 ease-[var(--ease-out-quart)]",
        !mounted || shown
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-4 opacity-0 blur-[2px]",
        className
      )}
    >
      {children}
    </div>
  )
}
