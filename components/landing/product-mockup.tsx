import { Activity, Cpu, MemoryStick, Terminal, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { AreaChart, Sparkline } from "@/components/charts"

const PLAYERS_24H = [
  18, 14, 11, 9, 8, 10, 15, 24, 33, 41, 47, 52, 55, 58, 61, 64, 67, 71, 74, 69,
  58, 49, 38, 42,
]

const CPU = [22, 28, 25, 31, 29, 35, 33, 30, 27, 32, 38, 34]
const MEM = [44, 46, 45, 48, 50, 49, 52, 51, 53, 55, 54, 56]

const PLAYERS = [
  { name: "Vex_Riley", tag: "VIP", ping: 38, color: "var(--chart-1)" },
  { name: "n0va", tag: "Admin", ping: 24, color: "var(--chart-2)" },
  { name: "Krait", tag: "", ping: 61, color: "var(--chart-3)" },
  { name: "sundown", tag: "Booster", ping: 47, color: "var(--chart-4)" },
]

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  data,
  color,
  className,
}: {
  icon: typeof Cpu
  label: string
  value: string
  unit: string
  data: number[]
  color: string
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border border-border/60 bg-muted/30 p-3", className)}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="size-3.5" style={{ color }} />
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-heading text-lg font-semibold tabular-nums">
          {value}
        </span>
        <span className="text-[11px] text-muted-foreground">{unit}</span>
      </div>
      <Sparkline data={data} color={color} height={24} className="mt-1.5" />
    </div>
  )
}

export function ProductMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-left shadow-2xl shadow-black/10 ring-1 ring-foreground/5 dark:shadow-black/40",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <span className="size-3 rounded-full bg-destructive/60" />
        <span className="size-3 rounded-full bg-warning/70" />
        <span className="size-3 rounded-full bg-success/70" />
        <span className="ml-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Terminal className="size-3.5" />
          sxPanel · Live Console
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          online
        </span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr]">
        {/* Mini sidebar */}
        <div className="hidden flex-col gap-1 border-r border-border/60 bg-muted/20 p-2 lg:flex">
          {[
            { icon: Activity, label: "Dashboard", active: true },
            { icon: Terminal, label: "Console" },
            { icon: Users, label: "Players" },
            { icon: Cpu, label: "Resources" },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-medium",
                item.active
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="space-y-3 p-3 sm:p-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <StatCard
              icon={Users}
              label="Players"
              value="42"
              unit="/ 128"
              data={PLAYERS_24H.slice(-12)}
              color="var(--chart-1)"
            />
            <StatCard
              icon={Cpu}
              label="CPU"
              value="32"
              unit="%"
              data={CPU}
              color="var(--chart-2)"
            />
            <StatCard
              icon={MemoryStick}
              label="Memory"
              value="2.1"
              unit="GB"
              data={MEM}
              color="var(--chart-3)"
              className="hidden sm:block"
            />
          </div>

          {/* Chart + playerlist */}
          <div className="grid gap-2.5 lg:grid-cols-[1fr_180px]">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Player count · 24h
                </span>
                <span className="text-[11px] font-medium text-success">
                  ▲ 18%
                </span>
              </div>
              <AreaChart data={PLAYERS_24H} height={92} color="var(--chart-1)" />
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
              <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">
                Playerlist
              </div>
              <div className="space-y-1">
                {PLAYERS.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs"
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
            </div>
          </div>

          {/* Console strip */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-[11px] leading-relaxed sm:text-xs">
            <p>
              <span className="text-success">[OK]</span> txData detected — 0
              migrations needed
            </p>
            <p>
              <span className="text-brand">sxpanel</span> ~ web panel ready on{" "}
              <span className="text-info">http://localhost:40120</span>
            </p>
            <p className="text-muted-foreground">
              <span className="text-foreground">players</span> 42 online · peak
              118 · uptime 6d 14h
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
