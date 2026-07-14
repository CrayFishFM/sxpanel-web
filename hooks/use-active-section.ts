"use client"

import * as React from "react"

/**
 * Tracks which section id is currently active in the viewport.
 * Useful for scroll-spy navigation highlighting.
 */
export function useActiveSection(ids: string[], offset = 0) {
  const [active, setActive] = React.useState<string>(ids[0] ?? "")

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id)
        }
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, offset])

  return active
}
