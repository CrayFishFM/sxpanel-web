import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Lightweight, dependency-free SVG area chart for marketing visuals.
 * Not a real data viz library — intentionally simple and deterministic.
 */
export function AreaChart({
  data,
  className,
  height = 140,
  color = "var(--chart-1)",
  strokeWidth = 2,
  showGrid = true,
}: {
  data: number[]
  className?: string
  height?: number
  color?: string
  strokeWidth?: number
  showGrid?: boolean
}) {
  const id = React.useId()
  const W = 600
  const H = height
  const pad = 8
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const stepX = (W - pad * 2) / (data.length - 1)

  const points = data.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (1 - (v - min) / span) * (H - pad * 2)
    return [x, y] as const
  })

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ")
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${H} L${points[0][0].toFixed(1)},${H} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Player count over time"
    >
      <defs>
        <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showGrid &&
        [0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={W - pad}
            y1={pad + t * (H - pad * 2)}
            y2={pad + t * (H - pad * 2)}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.08"
          />
        ))}
      <path d={area} fill={`url(#area-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function Sparkline({
  data,
  className,
  color = "var(--chart-1)",
  height = 36,
}: {
  data: number[]
  className?: string
  color?: string
  height?: number
}) {
  const W = 120
  const H = height
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const stepX = W / (data.length - 1)
  const line = data
    .map((v, i) => {
      const x = i * stepX
      const y = (1 - (v - min) / span) * H
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
    >
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * Intensity heatmap (e.g. peak-hours activity). `rows` is [row][col] of 0..1.
 */
export function Heatmap({
  rows,
  className,
  color = "var(--chart-1)",
  cellClassName,
}: {
  rows: number[][]
  className?: string
  color?: string
  cellClassName?: string
}) {
  return (
    <div
      className={cn("grid gap-1", className)}
      style={{
        gridTemplateColumns: `repeat(${rows[0]?.length ?? 0}, minmax(0, 1fr))`,
      }}
    >
      {rows.flatMap((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r}-${c}`}
            className={cn("h-4 rounded-[3px]", cellClassName)}
            style={{
              backgroundColor:
                v <= 0
                  ? "color-mix(in oklch, var(--muted) 60%, transparent)"
                  : `color-mix(in oklch, ${color} ${Math.round(18 + v * 82)}%, transparent)`,
            }}
            title={`${Math.round(v * 100)}%`}
          />
        ))
      )}
    </div>
  )
}

/** Two-series stacked vertical bar mini-chart (e.g. new vs. returning players per day). */
export function DualBarList({
  data,
  className,
  colorA = "var(--chart-1)",
  colorB = "var(--chart-5)",
}: {
  data: { a: number; b: number }[]
  className?: string
  colorA?: string
  colorB?: string
}) {
  const max = Math.max(...data.map((d) => d.a + d.b)) || 1
  return (
    <div className={cn("flex items-end gap-[3px]", className)}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-stretch justify-end">
          <div
            className="w-full rounded-t-[2px]"
            style={{
              height: `${(d.a / max) * 100}%`,
              backgroundColor: colorA,
              minHeight: d.a > 0 ? 1 : 0,
            }}
          />
          <div
            className="w-full"
            style={{
              height: `${(d.b / max) * 100}%`,
              backgroundColor: colorB,
              minHeight: d.b > 0 ? 1 : 0,
            }}
          />
        </div>
      ))}
    </div>
  )
}

/** Vertical bar mini-chart for distributions. */
export function BarList({
  data,
  className,
  color = "var(--chart-1)",
}: {
  data: { label: string; value: number }[]
  className?: string
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className={cn("flex items-end gap-1.5", className)}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-[3px] transition-all"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: color,
                minHeight: 2,
              }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
