import {
  CalendarClock,
  Megaphone,
  Power,
  RotateCw,
  UserX,
  XCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { AreaChart } from "@/components/charts"
import { MockupTopBar } from "@/components/landing/mockup-chrome"

const CONSOLE_LINES = [
  "[             resources] Started resource sessionmanager",
  "[      script:mapmanager] Started gametype Freeroam",
  "[             resources] Started resource basic-gamemode",
  "[      c-scripting-core] Creating script environments for hardcap",
  "[             resources] Started resource hardcap",
  "[      script:mapmanager] Started map fivem-map-skater",
  "[         script:monitor] [sxPanel] Sending resources list to sxPanel.",
]

const PLAYERS_ONLINE = [
  62, 66, 71, 78, 84, 88, 86, 80, 73, 68, 66, 69, 74, 80, 85, 83, 78, 72, 68,
  70, 74, 76, 72, 70,
]

const DROPS = [
  { label: "Player", value: 447, color: "var(--chart-1)" },
  { label: "Timeout", value: 97, color: "var(--chart-2)" },
  { label: "Resource", value: 65, color: "var(--chart-4)" },
  { label: "Crash", value: 41, color: "var(--destructive)" },
  { label: "Unknown", value: 31, color: "var(--chart-3)" },
  { label: "Security", value: 14, color: "var(--warning)" },
]

const PLAYERS = [
  { name: "SilverNomad101", tag: "", stripe: "" },
  { name: "TurboComet102", tag: "", stripe: "" },
  { name: "MangoFalcon103", tag: "", stripe: "" },
  { name: "DustyWarden104", tag: "", stripe: "" },
  { name: "RogueViking107", tag: "NEWCOMER", stripe: "var(--chart-2)" },
  { name: "PixelCipher108", tag: "", stripe: "" },
  { name: "SilverNomad113", tag: "PROBLEMATIC", stripe: "var(--warning)" },
  { name: "NovaFox109", tag: "", stripe: "" },
]

function CardShell({
  title,
  right,
  className,
  children,
}: {
  title: string
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
        <span className="text-xs font-medium">{title}</span>
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
  tone?: "solid-destructive" | "outline-brand" | "outline" | "outline-muted"
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex h-7 items-center justify-center gap-1.5 rounded-md text-[11px] font-medium",
        tone === "solid-destructive" && "bg-destructive text-white",
        tone === "outline-brand" && "border border-brand/50 text-brand",
        tone === "outline" && "border border-border text-muted-foreground",
        tone === "outline-muted" &&
          "border border-border/60 text-muted-foreground/50",
        className
      )}
    >
      {children}
    </span>
  )
}

export function ProductMockup({ className }: { className?: string }) {
  const dropTotal = DROPS.reduce((sum, d) => sum + d.value, 0)

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
          right={
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Online
            </span>
          }
        >
          <div className="grid grid-cols-2 gap-1.5">
            <MockButton tone="solid-destructive">
              <Power className="size-3" />
              Stop
            </MockButton>
            <MockButton tone="outline-brand">
              <RotateCw className="size-3" />
              Restart
            </MockButton>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-md border border-border/60 px-2 py-1 text-[11px] text-muted-foreground">
            <span>Next restart</span>
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
            <MockButton tone="outline-muted">
              <XCircle className="size-3" />
              Cancel
            </MockButton>
          </div>
        </CardShell>

        {/* Players Online */}
        <CardShell title="Players Online">
          <span className="font-heading text-3xl font-semibold tabular-nums text-brand">
            74
          </span>
          <div className="-mx-1 mt-1">
            <AreaChart
              data={PLAYERS_ONLINE}
              height={44}
              color="var(--chart-2)"
              showGrid={false}
            />
          </div>
          <div className="mt-auto pt-2.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Drops (last 6h)</span>
              <span className="font-medium text-foreground tabular-nums">
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
                  {d.label} <span className="tabular-nums">{d.value}</span>
                </span>
              ))}
            </div>
          </div>
        </CardShell>

        {/* Server Stats */}
        <CardShell
          title="Server Stats"
          right={<span className="text-[10px] text-muted-foreground">(live)</span>}
        >
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
            <div>
              <div className="text-muted-foreground">Uptime</div>
              <div className="font-medium tabular-nums">2d 7h 40m</div>
            </div>
            <div>
              <div className="text-muted-foreground">Availability (24h)</div>
              <div className="font-medium tabular-nums">50.1%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Median Players (24h)</div>
              <div className="font-medium tabular-nums">77</div>
            </div>
            <div>
              <div className="text-muted-foreground">FXServer Memory</div>
              <div className="font-medium tabular-nums">1441 MB</div>
            </div>
          </div>
          <div className="mt-auto pt-2.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Node.js memory</span>
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
          right={<span className="text-[10px] text-muted-foreground">74</span>}
          className="row-span-2 hidden lg:flex"
        >
          <div className="mb-2 flex h-6 items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2 text-[10px] text-muted-foreground/70">
            Filter by name or ID
            <kbd className="rounded border border-border/60 px-1 text-[8.5px]">
              Ctrl+K
            </kbd>
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
                  style={{
                    backgroundColor: `var(--chart-${(i % 5) + 1})`,
                  }}
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
          right={<span className="text-[10px] text-brand">Open console →</span>}
          className="lg:col-span-3"
        >
          <div className="space-y-1 font-mono text-[10.5px] leading-relaxed text-muted-foreground sm:text-[11px]">
            {CONSOLE_LINES.map((line) => (
              <p key={line} className="truncate">
                {line}
              </p>
            ))}
          </div>
        </CardShell>
      </div>
    </div>
  )
}
