import { BellOff, ChevronDown, RefreshCw, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { BrandMark } from "@/components/brand"

/** Top-nav items. Most open a dropdown in the real panel (marked below). */
const NAV_TABS = [
  { label: "Overview", menu: false },
  { label: "Players", menu: true },
  { label: "Server", menu: true },
  { label: "Analytics", menu: true },
  { label: "Addons", menu: false },
  { label: "System", menu: true },
] as const

export function MockupTopBar({
  activeTab,
  serverName,
  players,
}: {
  activeTab: (typeof NAV_TABS)[number]["label"]
  serverName: string
  players: number
}) {
  return (
    <div className="flex items-center gap-4 border-b border-border bg-card px-4 py-2.5">
      <BrandMark size="sm" />
      <div className="hidden items-center gap-1.5 border-l border-border/60 pl-4 text-xs sm:flex">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-success" />
        </span>
        <span className="font-medium">{serverName}</span>
        <span className="text-muted-foreground tabular-nums">
          {players} players
        </span>
      </div>
      <nav className="hidden items-center gap-0.5 text-xs font-medium sm:flex">
        {NAV_TABS.map((tab) => (
          <span
            key={tab.label}
            className={cn(
              "relative flex items-center gap-0.5 px-2.5 py-1",
              tab.label === activeTab
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {tab.label}
            {tab.menu && <ChevronDown className="size-3 opacity-60" />}
            {tab.label === activeTab && (
              <span className="absolute inset-x-2.5 -bottom-[9px] h-px bg-brand" />
            )}
          </span>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="grid size-6 place-items-center rounded-md border border-destructive/30 text-destructive/80">
          <BellOff className="size-3.5" />
        </span>
        <span className="grid size-6 place-items-center rounded-md border border-chart-2/40 text-chart-2">
          <RefreshCw className="size-3.5" />
        </span>
        <span className="grid size-6 place-items-center rounded-md text-muted-foreground">
          <Search className="size-3.5" />
        </span>
        <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-brand to-chart-2 text-[10px] font-semibold text-white">
          SX
        </span>
      </div>
    </div>
  )
}

/** The Paper-White-bar + Steel-Gray icon tile page-header motif used throughout the app. */
export function MockupPageHeader({
  icon: Icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5">
      <span className="h-8 w-1 shrink-0 rounded-full bg-foreground/70" />
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-brand">
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
      </div>
      {right && <div className="ml-auto shrink-0">{right}</div>}
    </div>
  )
}
