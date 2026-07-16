import { Megaphone, Power, RotateCw, UserX } from "lucide-react"

import { cn } from "@/lib/utils"
import { MockupTopBar } from "@/components/landing/mockup-chrome"

const CONSOLE_LINES = [
  "[ citizen-server-impl] network thread hitch warning: timer interval of 189 milliseconds",
  "[ sxpanel ] web panel ready on http://localhost:40120",
  "[ txData ] detected — 0 migrations needed",
  "[ players ] 42 online · peak 118 · uptime 6d 14h",
]

const PLAYERS = [
  { name: "Vex_Riley", tag: "VIP", ping: 38, color: "var(--chart-1)" },
  { name: "n0va", tag: "Admin", ping: 24, color: "var(--chart-2)" },
  { name: "Krait", tag: "", ping: 61, color: "var(--chart-3)" },
  { name: "sundown", tag: "Booster", ping: 47, color: "var(--chart-4)" },
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
  tone?: "solid-destructive" | "outline-brand" | "outline"
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex h-7 items-center justify-center gap-1.5 rounded-md text-[11px] font-medium",
        tone === "solid-destructive" &&
          "bg-destructive text-white",
        tone === "outline-brand" &&
          "border border-brand/50 text-brand",
        tone === "outline" &&
          "border border-border text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

export function ProductMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background text-left shadow-2xl shadow-black/40 ring-1 ring-foreground/5",
        className
      )}
    >
      <MockupTopBar activeTab="Overview" serverName="Redline RP" players={42} />

      {/* Body */}
      <div className="grid grid-cols-1 gap-2.5 p-3 sm:p-4 lg:grid-cols-[1fr_1fr_1fr_200px]">
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
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Next restart</span>
            <span className="font-medium text-foreground">in 3h 40m</span>
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
        </CardShell>

        {/* Players Online */}
        <CardShell title="Players Online">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-semibold tabular-nums">
              42
            </span>
            <span className="text-xs text-muted-foreground">/ 128</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[33%] rounded-full bg-brand" />
          </div>
          <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-muted-foreground">
            <span>Drops (last 6h)</span>
            <span className="font-medium text-foreground">3</span>
          </div>
        </CardShell>

        {/* Server Stats */}
        <CardShell title="Server Stats" right={<span className="text-[10px] text-muted-foreground">(live)</span>}>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
            <div>
              <div className="text-muted-foreground">Uptime</div>
              <div className="font-medium tabular-nums">6d 14h</div>
            </div>
            <div>
              <div className="text-muted-foreground">Availability</div>
              <div className="font-medium tabular-nums">99.8%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Median players</div>
              <div className="font-medium tabular-nums">38</div>
            </div>
            <div>
              <div className="text-muted-foreground">FXServer mem</div>
              <div className="font-medium tabular-nums">2.1 GB</div>
            </div>
          </div>
          <div className="mt-auto pt-2.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Node.js memory</span>
              <span className="font-medium text-foreground">84 MB · 4%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[4%] rounded-full bg-chart-2" />
            </div>
          </div>
        </CardShell>

        {/* Players rail */}
        <CardShell
          title="Players"
          right={<span className="text-[10px] text-muted-foreground">42</span>}
          className="row-span-2 hidden lg:flex"
        >
          <div className="mb-2 h-6 rounded-md border border-border/60 bg-muted/20 px-2 text-[10px] leading-6 text-muted-foreground/70">
            Filter by name or ID
          </div>
          <div className="space-y-1">
            {PLAYERS.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[11px]"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="truncate font-medium">{p.name}</span>
                {p.tag && (
                  <span className="rounded bg-brand/10 px-1 py-0.5 text-[9px] font-medium text-brand">
                    {p.tag}
                  </span>
                )}
                <span className="ml-auto tabular-nums text-muted-foreground">
                  {p.ping}ms
                </span>
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
