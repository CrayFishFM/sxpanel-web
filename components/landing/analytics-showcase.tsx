import Image from "next/image"

import insightsShot from "@/public/docs/insights.png"
import { Reveal } from "@/components/reveal"

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
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/40 ring-1 ring-foreground/5">
          <Image
            src={insightsShot}
            alt="The sxPanel Insights page — player retention, long-term player count and memory, new vs returning players, and a peak-hours heatmap"
            className="h-auto w-full"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
        </div>
      </Reveal>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Live screenshot from the panel. Charts update in real time.
      </p>
    </section>
  )
}
