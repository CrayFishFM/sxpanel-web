import { cn } from "@/lib/utils"

const sizes = {
  sm: { mark: "size-6 text-[11px] rounded-md", text: "text-sm" },
  md: { mark: "size-8 text-sm rounded-lg", text: "text-lg" },
  lg: { mark: "size-9 text-base rounded-lg", text: "text-xl" },
} as const

export type BrandSize = keyof typeof sizes

/** The visual mark + wordmark, no anchor. Reused by headers, footers and docs nav. */
export function BrandMark({
  size = "md",
  showWordmark = true,
  className,
}: {
  size?: BrandSize
  showWordmark?: boolean
  className?: string
}) {
  const s = sizes[size]
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "grid place-items-center bg-gradient-to-br from-brand to-brand/80 font-heading font-bold text-brand-foreground shadow-sm shadow-brand/40",
          s.mark
        )}
      >
        sx
      </span>
      {showWordmark && (
        <span className={cn("font-heading font-semibold tracking-tight", s.text)}>
          sxPanel
        </span>
      )}
    </span>
  )
}

/** Clickable brand, used on the marketing site. */
export function Brand({
  className,
  href = "#top",
  size = "md",
  showWordmark = true,
}: {
  className?: string
  href?: string
  size?: BrandSize
  showWordmark?: boolean
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
      <BrandMark size={size} showWordmark={showWordmark} />
    </a>
  )
}
