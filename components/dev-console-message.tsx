"use client"

import * as React from "react"

import { siteConfig } from "@/lib/site"

/**
 * A one-time console greeting for the developers curious enough to open
 * devtools — sxPanel is MIT-licensed and built by contributors.
 */
export function DevConsoleMessage() {
  React.useEffect(() => {
    console.log(
      "%csxPanel %c— the control room for your FiveM & RedM server",
      "color:oklch(0.58 0.235 277);font-weight:700;font-size:13px",
      "color:inherit;font-size:13px"
    )
    console.log(
      `MIT licensed, built by snipz & contributors. Poke around: ${siteConfig.github}`
    )
  }, [])

  return null
}
