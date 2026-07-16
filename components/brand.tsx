import Image from "next/image"

import { cn } from "@/lib/utils"
import logo from "@/public/logo.svg"

const LOGO_ASPECT = 737 / 198

const sizes = {
  sm: { height: 22 },
  md: { height: 28 },
  lg: { height: 32 },
} as const

export type BrandSize = keyof typeof sizes

/** The icon + wordmark lockup, no anchor. Reused by headers, footers and docs nav. */
export function BrandMark({
  size = "md",
  className,
}: {
  size?: BrandSize
  className?: string
}) {
  const { height } = sizes[size]
  return (
    <Image
      src={logo}
      alt="sxPanel"
      width={Math.round(height * LOGO_ASPECT)}
      height={height}
      className={cn("shrink-0", className)}
      priority
    />
  )
}

/** Clickable brand, used on the marketing site. */
export function Brand({
  className,
  href = "#top",
  size = "md",
}: {
  className?: string
  href?: string
  size?: BrandSize
}) {
  return (
    <a
      href={href}
      className={cn(
        "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      aria-label="sxPanel home"
    >
      <BrandMark size={size} />
    </a>
  )
}
