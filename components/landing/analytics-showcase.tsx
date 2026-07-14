import { Activity, ArrowUpRight, Clock, Flame, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AreaChart, BarList, Heatmap } from "@/components/charts"
import { Reveal } from "@/components/reveal"

const PLAYERS_96H = [
  12, 9, 7, 6, 8, 12, 19, 27, 35, 44, 51, 55, 58, 62, 66, 70, 73, 76, 78, 74,
  66, 55, 44, 38, 30, 24, 18, 14, 11, 10, 13, 18, 26, 34, 42, 49, 54, 59, 63,
  68, 72, 75, 79, 82, 80, 72, 61, 50, 41, 33, 26, 20, 16, 12, 10, 12, 17, 25,
  33, 41, 48, 53, 57, 61, 65, 69, 73, 76, 79, 81, 77, 68, 57, 46, 37, 29, 22,
  17, 13, 10, 9, 11, 15, 22, 30, 38, 45, 52, 56, 60, 64, 68, 72, 75, 78, 74,
  65, 54,
]

const RETENTION = [
  { label: "1d", value: 78 },
  { label: "7d", value: 54 },
  { label: "30d", value: 41 },
]

// 7 days x 24 hours, evening-weighted intensity
const HEATMAP: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const evening = Math.exp(-((hour - 20) ** 2) / 40)
    const afternoon = Math.exp(-((hour - 15) ** 2) / 60) * 0.7
    const weekend = day >= 5 ? 0.25 : 0
    const base = Math.max(evening, afternoon) + weekend
    return Math.min(1, Math.max(0, base + (day % 3) * 0.05))
  })
)

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  color,
}: {
  icon: typeof Users
  label: string
  value: string
  delta: string
  color: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="size-4" style={{ color }} />
        {label}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="font-heading text-2xl font-semibold tabular-nums">
          {value}
        </span>
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
          <ArrowUpRight className="size-3.5" />
          {delta}
        </span>
      </div>
    </div>
  )
}

export function AnalyticsShowcase() {
  return (
    <section id="analytics" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Understand how your server actually performs
        </h2>
        <p className="mt-4 text-muted-foreground">
          Stop guessing. sxPanel turns raw server telemetry into clear,
          actionable insight — player trends, retention, peak hours and admin
          activity, all in one place.
        </p>
      </Reveal>

      <Reveal className="mt-12" delay={80}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card ring-1 ring-foreground/5">
          {/* Dashboard header */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border/60 bg-muted/30 px-5 py-3.5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Flame className="size-4 text-brand" />
              Server overview
            </div>
            <Badge variant="success" className="ml-auto">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              Live
            </Badge>
            <span className="text-xs text-muted-foreground">Last 96 hours</span>
          </div>

          <div className="grid gap-px bg-border/40 lg:grid-cols-3">
            {/* Player timeline — spans 2 cols */}
            <div className="bg-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">
                    Player count timeline
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-semibold tabular-nums">
                      42
                    </span>
                    <span className="text-sm text-muted-foreground">
                      online now
                    </span>
                    <span className="text-xs font-medium text-success">
                      ▲ 18% vs avg
                    </span>
                  </div>
                </div>
                <div className="hidden gap-2 sm:flex">
                  <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    24h
                  </span>
                  <span className="rounded-md bg-brand/10 px-2 py-1 text-[11px] font-medium text-brand">
                    96h
                  </span>
                </div>
              </div>
              <AreaChart
                data={PLAYERS_96H}
                height={200}
                color="var(--chart-1)"
                className="mt-4 text-foreground"
              />
            </div>

            {/* Retention */}
            <div className="bg-card p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Users className="size-4 text-chart-2" />
                Retention
              </div>
              <div className="mt-3 space-y-3">
                {RETENTION.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium tabular-nums">{r.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-chart-2"
                        style={{ width: `${r.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  Playtime distribution
                </div>
                <BarList
                  data={[
                    { label: "<1h", value: 32 },
                    { label: "1-3h", value: 48 },
                    { label: "3-6h", value: 27 },
                    { label: "6h+", value: 14 },
                  ]}
                  color="var(--chart-3)"
                  className="h-24"
                />
              </div>
            </div>

            {/* Heatmap — spans full width */}
            <div className="bg-card p-5 lg:col-span-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Clock className="size-4 text-chart-4" />
                Peak hours heatmap
                <span className="ml-auto text-[11px]">
                  Brighter = more players
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex flex-col justify-between py-0.5 text-[10px] text-muted-foreground">
                  {DAYS.map((d) => (
                    <span key={d} className="leading-none">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="flex-1">
                  <Heatmap rows={HEATMAP} color="var(--chart-1)" />
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                    <span>0:00</span>
                    <span>6:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-5 grid gap-4 sm:grid-cols-3" delay={120}>
        <MetricCard
          icon={Users}
          label="Unique players (30d)"
          value="3,482"
          delta="12.4%"
          color="var(--chart-1)"
        />
        <MetricCard
          icon={Clock}
          label="Avg session"
          value="2h 14m"
          delta="6.1%"
          color="var(--chart-3)"
        />
        <MetricCard
          icon={Activity}
          label="Server uptime"
          value="99.9%"
          delta="0.2%"
          color="var(--chart-2)"
        />
      </Reveal>

      <p className={cn("mt-8 text-center text-sm text-muted-foreground")}>
        Data shown is illustrative. Charts update in real time inside the panel.
      </p>
    </section>
  )
}
