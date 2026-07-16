import { Activity, BarChart3, TrendingUp, Users2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { AreaChart, DualBarList, Heatmap } from "@/components/charts"
import { Reveal } from "@/components/reveal"
import { MockupPageHeader, MockupTopBar } from "@/components/landing/mockup-chrome"

const PLAYERS_LONG = [
  76, 78, 82, 88, 94, 98, 97, 91, 84, 78, 74, 70, 68, 70, 74, 80, 87, 93, 97,
  99, 95, 87, 76, 65, 57, 50, 46, 48, 53, 60, 68, 75, 68, 62, 58, 56, 59, 63,
  68, 73, 78, 82, 78, 72, 65, 60, 57, 55, 54, 56,
]

const MEMORY_LONG = [
  1.42, 1.44, 1.47, 1.51, 1.53, 1.5, 1.46, 1.42, 1.39, 1.37, 1.38, 1.4, 1.43,
  1.46, 1.49, 1.51, 1.49, 1.46, 1.43, 1.41, 1.4, 1.42, 1.45, 1.47,
]

const NEW_VS_RETURNING = Array.from({ length: 24 }, (_, i) => ({
  a: 6 + Math.round(Math.sin(i / 3) * 3 + 4),
  b: 30 + Math.round(Math.sin(i / 4 + 1) * 8 + 14),
}))

const NEW_PER_DAY = [
  4, 5, 6, 5, 7, 8, 9, 8, 10, 9, 8, 7, 6, 7, 8, 9, 10, 9, 8, 7,
]

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

const PLAYERS = [
  { name: "SilverNomad101", tag: null, stripe: null },
  { name: "TurboComet102", tag: null, stripe: null },
  { name: "MangoFalcon103", tag: null, stripe: null },
  { name: "RogueViking107", tag: "NEWCOMER", stripe: "var(--chart-2)" },
  { name: "SilverNomad113", tag: "PROBLEMATIC", stripe: "var(--warning)" },
  { name: "KiloRider123", tag: "STAFF", stripe: "var(--destructive)" },
  { name: "NeonBandit124", tag: null, stripe: null },
  { name: "TurboComet126", tag: "PROBLEMATIC", stripe: "var(--warning)" },
]

function MiniCard({
  icon: Icon,
  title,
  subtitle,
  right,
  className,
  children,
}: {
  icon: typeof Activity
  title: string
  subtitle: string
  right?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("rounded-lg border border-border/60 bg-card p-3.5", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Icon className="mt-0.5 size-3.5 shrink-0 text-brand" />
          <div>
            <div className="text-xs font-medium">{title}</div>
            <div className="text-[10.5px] text-muted-foreground">{subtitle}</div>
          </div>
        </div>
        {right && (
          <span className="shrink-0 text-[10.5px] text-muted-foreground">{right}</span>
        )}
      </div>
      {children}
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
        <div
          aria-hidden="true"
          className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/40 ring-1 ring-foreground/5"
        >
          <MockupTopBar activeTab="Analytics" serverName="SRPDev" players={79} />
          <MockupPageHeader
            icon={Activity}
            title="Insights"
            subtitle="Long-term server trends, player analytics and moderation history"
          />

          <div className="grid grid-cols-1 gap-2.5 p-3 sm:p-4 lg:grid-cols-[1fr_200px]">
            <div className="space-y-2.5">
              {/* Player count & memory */}
              <MiniCard
                icon={TrendingUp}
                title="Player Count & Memory"
                subtitle="Long-term population and host memory trend"
                right={<>Peak: 97 players</>}
              >
                <div className="mb-1 text-[9.5px] font-medium tracking-wide text-muted-foreground uppercase">
                  Players
                </div>
                <AreaChart
                  data={PLAYERS_LONG}
                  height={64}
                  color="var(--chart-2)"
                  showGrid={false}
                />
                <div className="mt-3 mb-1 text-[9.5px] font-medium tracking-wide text-muted-foreground uppercase">
                  FXServer memory
                </div>
                <AreaChart
                  data={MEMORY_LONG}
                  height={56}
                  color="#f43f5e"
                  showGrid={false}
                />
              </MiniCard>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <MiniCard
                  icon={Users2}
                  title="New vs Returning"
                  subtitle="Daily breakdown of who showed up"
                  right={<>45d</>}
                >
                  <DualBarList
                    data={NEW_VS_RETURNING}
                    colorA="var(--chart-5)"
                    colorB="var(--chart-1)"
                    className="h-16"
                  />
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-[var(--chart-5)]" />
                      New
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-[var(--chart-1)]" />
                      Returning
                    </span>
                  </div>
                </MiniCard>

                <MiniCard
                  icon={BarChart3}
                  title="New Players / Day"
                  subtitle="First-seen players over time"
                  right={<>Total: 6,832</>}
                >
                  <div className="flex h-16 items-end gap-[3px]">
                    {NEW_PER_DAY.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-[2px] bg-brand"
                        style={{
                          height: `${(v / Math.max(...NEW_PER_DAY)) * 100}%`,
                          minHeight: 2,
                        }}
                      />
                    ))}
                  </div>
                </MiniCard>
              </div>
            </div>

            {/* Players rail */}
            <div className="hidden flex-col rounded-lg border border-border/60 bg-card p-3 lg:flex">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium">Players</span>
                <span className="text-[10px] text-muted-foreground">79</span>
              </div>
              <div className="mb-2 h-6 rounded-md border border-border/60 bg-muted/20 px-2 text-[10px] leading-6 text-muted-foreground/70">
                Filter by name or ID
              </div>
              <div className="space-y-1 overflow-hidden">
                {PLAYERS.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-1.5 rounded-md py-1 pr-1.5 pl-1.5 text-[10.5px]"
                    style={
                      p.stripe
                        ? { boxShadow: `inset 2px 0 0 0 ${p.stripe}` }
                        : undefined
                    }
                  >
                    <span className="w-3.5 shrink-0 text-right text-muted-foreground/60">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium">{p.name}</span>
                    {p.tag && (
                      <span
                        className="ml-auto shrink-0 rounded px-1 py-0.5 text-[8.5px] font-medium"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${p.stripe} 15%, transparent)`,
                          color: p.stripe ?? undefined,
                        }}
                      >
                        {p.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Data shown is illustrative. Charts update in real time inside the panel.
      </p>
    </section>
  )
}
