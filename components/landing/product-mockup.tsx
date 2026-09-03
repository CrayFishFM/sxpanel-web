import {
  CalendarClock,
  Gauge,
  Megaphone,
  Power,
  RotateCw,
  SlidersHorizontal,
  Terminal,
  UserX,
  Users,
  XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { AreaChart } from "@/components/charts"
import { MockupTopBar } from "@/components/landing/mockup-chrome"

/** Console lines, split so the bracketed source tag can be tinted like the real panel. */
const CONSOLE_LINES: { tag: string; tone: string; text: string }[] = [
  { tag: "resources", tone: "text-success", text: "Started resource sessionmanager" },
  { tag: "script:mapmanager", tone: "text-warning", text: "Started gametype Freeroam" },
  { tag: "resources", tone: "text-success", text: "Started resource basic-gamemode" },
  { tag: "c-scripting-core", tone: "text-chart-3", text: "Creating script environments for hardcap" },
  { tag: "resources", tone: "text-success", text: "Started resource hardcap" },
  { tag: "script:mapmanager", tone: "text-warning", text: "Started map fivem-map-skater" },
  { tag: "script:monitor", tone: "text-chart-2", text: "[sxPanel] Sending resources list to sxPanel." },
]

const PLAYERS_ONLINE = [
  58, 62, 68, 76, 84, 90, 92, 88, 80, 72, 66, 63, 66, 72, 80, 86, 88, 84, 77,
  71, 68, 70, 74, 76, 73, 70,
]

const DROPS = [
  { label: "Player", value: 447, color: "var(--success)" },
  { label: "Timeout", value: 97, color: "var(--chart-2)" },
  { label: "Resource", value: 65, color: "var(--chart-1)" },
  { label: "Crash", value: 41, color: "var(--chart-4)" },
  { label: "Unknown", value: 31, color: "var(--chart-3)" },
  { label: "Security", value: 14, color: "var(--destructive)" },
]

const STATS = [
  ["Uptime", "2d 7h 40m"],
  ["Availability (24h)", "50.1%"],
  ["Median Players (24h)", "77"],
  ["FXServer Memory", "1441 MB"],
]

const PLAYERS = [
  { name: "SilverNomad101", tag: "", stripe: "" },
  { name: "TurboComet102", tag: "", stripe: "" },
  { name: "MangoFalcon103", tag: "", stripe: "" },
  { name: "RogueViking107", tag: "NEWCOMER", stripe: "var(--chart-2)" },
  { name: "PixelCipher108", tag: "", stripe: "" },
  { name: "SilverNomad113", tag: "PROBLEMATIC", stripe: "var(--warning)" },
  { name: "KiloRider123", tag: "STAFF", stripe: "var(--destructive)" },
  { name: "NovaFox109", tag: "", stripe: "" },
]

// svMain tick-time histogram — buckets and their share of the last minute.
const TICKS: [string, number][] = [
  ["< 1 ms", 0.6],
  ["1-2 ms", 2.8],
  ["2-4 ms", 7.3],
  ["4-6 ms", 13],
  ["6-8 ms", 16],
  ["8-10 ms", 16],
  ["10-15 ms", 14],
  ["15-20 ms", 10],
  ["20-30 ms", 6.7],
  ["30-50 ms", 4],
  ["50-70 ms", 1.7],
  ["70-100 ms", 0.6],
  ["100-150 ms", 0.4],
  ["150-250 ms", 1.4],
  ["> 250 ms", 4.5],
]

const TICK_MAX = Math.max(...TICKS.map(([, v]) => v))

// Server Performance — deterministic pseudo-series for the layered area chart.
const PERF = Array.from({ length: 44 }, (_, i) => {
  const players = 74 + Math.sin(i / 4) * 22 + Math.sin(i / 1.7) * 4
  const strained =
    50 + Math.sin(i / 3 + 1) * 28 + (i % 3 === 0 ? 14 : 0) + (i % 7 === 0 ? -18 : 0)
  const severe = 26 + Math.sin(i / 2.4 + 2) * 18 + (i % 4 === 0 ? 10 : 0)
  return {
    players: Math.round(players),
    strained: Math.max(4, Math.round(strained)),
    severe: Math.max(2, Math.round(severe)),
  }
})

function CardShell({
  title,
  icon: Icon,
  right,
  className,
  children,
}: {
  title: string
  icon?: typeof Terminal
  right?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border/60 bg-card p-3",
        className
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium">
          {Icon && <Icon className="size-3.5 text-muted-foreground" />}
          {title}
        </span>
        {right}
      </div>
      {children}
    </div>
  )
}

function MockButton({
  children,
  tone = "outline",
  className,
}: {
  children: React.ReactNode
  tone?: "danger" | "brand" | "outline" | "muted"
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex h-8 items-center justify-center gap-1.5 rounded-md border text-[11px] font-medium",
        tone === "danger" && "border-destructive/40 bg-destructive/10 text-destructive",
        tone === "brand" && "border-chart-2/40 bg-chart-2/10 text-chart-2",
        tone === "outline" && "border-border text-muted-foreground",
        tone === "muted" && "border-border/50 text-muted-foreground/40",
        className
      )}
    >
      {children}
    </span>
  )
}

export function ProductMockup({ className }: { className?: string }) {
  const dropTotal = DROPS.reduce((sum, d) => sum + d.value, 0)
  const perfMax = Math.max(...PERF.flatMap((p) => [p.players, p.strained, p.severe]))

  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background text-left shadow-2xl shadow-black/40 ring-1 ring-foreground/5",
        className
      )}
    >
      <MockupTopBar activeTab="Overview" serverName="Redline RP" players={74} />

      {/* Body */}
      <div className="grid grid-cols-1 gap-2.5 p-3 sm:p-4 lg:grid-cols-[1fr_1fr_1fr_210px]">
        {/* Server Controls */}
        <CardShell
          title="Server Controls"
          icon={Power}
          right={
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Online
            </span>
          }
        >
          <div className="grid grid-cols-2 gap-1.5">
            <MockButton tone="danger">
              <Power className="size-3" />
              Stop
            </MockButton>
            <MockButton tone="brand">
              <RotateCw className="size-3" />
              Restart
            </MockButton>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-md border border-border/60 px-2 py-1.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3" />
              Next restart
            </span>
            <span className="font-medium text-foreground tabular-nums">
              1h 45m
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <MockButton tone="outline">
              <Megaphone className="size-3" />
              Announce
            </MockButton>
            <MockButton tone="outline">
              <UserX className="size-3" />
              Kick All
            </MockButton>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <MockButton tone="outline">
              <CalendarClock className="size-3" />
              Schedule
            </MockButton>
            <MockButton tone="muted">
              <XCircle className="size-3" />
              Cancel
            </MockButton>
          </div>
        </CardShell>

        {/* Players Online */}
        <CardShell title="Players Online" icon={Users}>
          <span className="font-heading text-3xl font-semibold tabular-nums text-brand">
            74
          </span>
          <div className="-mx-1 mt-1">
            <AreaChart
              data={PLAYERS_ONLINE}
              height={72}
              color="var(--chart-2)"
              showGrid={false}
            />
          </div>
          <div className="mt-auto pt-2.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Drops (last 6h)</span>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {dropTotal}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[9.5px] text-muted-foreground">
              {DROPS.map((d) => (
                <span key={d.label} className="inline-flex items-center gap-1">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.label}{" "}
                  <span className="tabular-nums text-foreground/80">
                    {d.value}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </CardShell>

        {/* Server Stats */}
        <CardShell
          title="Server Stats"
          icon={Gauge}
          right={<span className="text-[10px] text-muted-foreground">(live)</span>}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {STATS.map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-border/50 bg-background/40 px-2 py-1.5"
              >
                <div className="text-[9.5px] text-muted-foreground">{label}</div>
                <div className="text-[11px] font-semibold tabular-nums">
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1.5 rounded-md border border-border/50 bg-background/40 px-2 py-1.5">
            <div className="flex items-center justify-between text-[9.5px] text-muted-foreground">
              <span>Node.js Memory</span>
              <span className="font-medium text-foreground tabular-nums">
                314 MB · 41%
              </span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[41%] rounded-full bg-chart-2" />
            </div>
          </div>
        </CardShell>

        {/* Players rail */}
        <CardShell
          title="Players"
          icon={Users}
          right={
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              74 <span className="text-muted-foreground/50">›</span>
            </span>
          }
          className="row-span-3 hidden lg:flex"
        >
          <div className="mb-2 flex h-6 items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2 text-[10px] text-muted-foreground/70">
            <span>Filter by name or ID</span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/60 px-1 text-[8.5px]">
                Ctrl+K
              </kbd>
              <SlidersHorizontal className="size-3" />
            </span>
          </div>
          <div className="space-y-0.5">
            {PLAYERS.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-md px-1 py-1 text-[11px]"
                style={
                  p.stripe
                    ? { boxShadow: `inset 2px 0 0 0 ${p.stripe}` }
                    : undefined
                }
              >
                <span
                  className="grid size-4 shrink-0 place-items-center rounded text-[7px] font-semibold text-white"
                  style={{ backgroundColor: `var(--chart-${(i % 5) + 1})` }}
                >
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-medium">{p.name}</span>
                  <span className="text-[8.5px] text-muted-foreground/60">
                    #{i + 1}
                  </span>
                </span>
                {p.tag && (
                  <span
                    className="ml-auto shrink-0 rounded px-1 py-0.5 text-[8px] font-medium"
                    style={{
                      backgroundColor: `color-mix(in oklch, ${p.stripe} 15%, transparent)`,
                      color: p.stripe,
                    }}
                  >
                    {p.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardShell>

        {/* Live console */}
        <CardShell
          title="Live Console"
          icon={Terminal}
          right={<span className="text-[10px] text-brand">Open console →</span>}
          className="lg:col-span-3"
        >
          <div className="space-y-1 rounded-md bg-black/60 p-2.5 font-mono text-[10px] leading-relaxed sm:text-[11px]">
            {CONSOLE_LINES.map((line, i) => (
              <p key={i} className="truncate text-white/85">
                <span className="text-muted-foreground/50">[ </span>
                <span className={line.tone}>{line.tag}</span>
                <span className="text-muted-foreground/50">] </span>
                {line.text}
              </p>
            ))}
          </div>
        </CardShell>

        {/* svMain tick histogram */}
        <CardShell
          title="svMain Perf"
          right={
            <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              (last minute)
              <span className="rounded border border-border/60 px-1 py-0.5">
                svMain ⌄
              </span>
            </span>
          }
        >
          <div className="space-y-[3px]">
            {TICKS.map(([label, v]) => (
              <div
                key={label}
                className="flex items-center gap-1.5 font-mono text-[8.5px]"
              >
                <span className="w-14 shrink-0 whitespace-nowrap text-right text-muted-foreground">
                  {label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                  <span
                    className="block h-full rounded-full bg-success"
                    style={{ width: `${(v / TICK_MAX) * 100}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right tabular-nums text-foreground/80">
                  {v}%
                </span>
              </div>
            ))}
          </div>
        </CardShell>

        {/* Server Performance */}
        <CardShell
          title="Server Performance"
          right={
            <span className="hidden items-center gap-1.5 text-[9px] text-muted-foreground sm:flex">
              <span className="text-foreground">Players</span>
              <span>FXS Mem</span>
              <span>Node Mem</span>
              <span className="rounded border border-border/60 px-1 py-0.5">
                svMain ⌄
              </span>
            </span>
          }
          className="lg:col-span-2"
        >
          <div className="relative h-24 flex-1">
            <PerfBars max={perfMax} className="absolute inset-0" />
            <PerfLine
              values={PERF.map((p) => p.players)}
              max={perfMax}
              className="absolute inset-0 text-white/80"
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
            <span className="text-muted-foreground/70">Time spent on slow ticks:</span>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-warning" />
              &gt; 50ms (strained)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-destructive" />
              &gt; 100ms (severe)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-white/80" />
              Players
            </span>
          </div>
        </CardShell>
      </div>
    </div>
  )
}

function PerfBars({ max, className }: { max: number; className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-end gap-px", className)}>
      {PERF.map((p, i) => (
        <div key={i} className="relative h-full flex-1">
          {/* strained (behind) and severe (in front), both rising from the baseline */}
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[1px] bg-warning/55"
            style={{ height: `${(p.strained / max) * 100}%` }}
          />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[1px] bg-destructive/70"
            style={{ height: `${(p.severe / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  )
}

function PerfLine({
  values,
  max,
  className,
}: {
  values: number[]
  max: number
  className?: string
}) {
  const W = 600
  const H = 96
  const stepX = W / (values.length - 1)
  const line = values
    .map((v, i) => {
      const x = i * stepX
      const y = H - (v / max) * H
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
