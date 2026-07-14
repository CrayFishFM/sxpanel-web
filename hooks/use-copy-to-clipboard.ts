"use client"

import * as React from "react"

/**
 * Copies text to the clipboard and reports the copied value for `resetMs`
 * before reverting, so callers can drive brief "copied" feedback.
 */
export function useCopyToClipboard(resetMs = 1500) {
  const [copiedText, setCopiedText] = React.useState<string | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        return
      }
      setCopiedText(text)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopiedText(null), resetMs)
    },
    [resetMs]
  )

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { copiedText, copy }
}
