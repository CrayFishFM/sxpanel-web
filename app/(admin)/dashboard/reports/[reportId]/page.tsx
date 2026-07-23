import { headers } from "next/headers"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { normalizeReportId } from "@/lib/report-id"
import { getReportWithPayload } from "@/lib/reports-queries"
import { formatBytes, formatTimestamp } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

/**
 * A full bundle can be tens of megabytes; pretty-printing all of it into the
 * DOM would lock up the browser. The inline view is a preview for triage —
 * the JSON endpoint linked above it serves the complete report.
 */
const PREVIEW_CHAR_LIMIT = 120_000

export default async function ReportDetailPage(
  props: PageProps<"/dashboard/reports/[reportId]">
) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    redirect("/sign-in")
  }

  const { reportId } = await props.params
  const normalized = normalizeReportId(reportId)
  if (!normalized) notFound()

  const report = await getReportWithPayload(normalized)
  if (!report) notFound()

  const sections = describeSections(report.payload)
  const pretty = JSON.stringify(report.payload, null, 2)
  const truncated = pretty.length > PREVIEW_CHAR_LIMIT

  const facts = [
    { label: "Received", value: formatTimestamp(report.receivedAt) },
    { label: "Generated (client clock)", value: formatTimestamp(report.generatedAt) },
    { label: "Expires", value: formatTimestamp(report.expiresAt) },
    { label: "Uncompressed", value: formatBytes(report.jsonBytes) },
    { label: "Compressed", value: formatBytes(report.gzipBytes) },
    { label: "Schema version", value: report.schemaVersion?.toString() ?? "—" },
    { label: "sxPanel", value: report.txVersion ?? "—" },
    { label: "FXServer", value: report.fxVersion ?? "—" },
    { label: "Provider", value: report.provider ?? "—" },
  ]

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Diagnostics report</p>
          <h1 className="font-heading text-3xl font-medium tracking-[0.25em]">
            {report.reportId}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/api/diagnostics/${report.reportId}`}>Full JSON</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/reports">All reports</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                <dd className="text-sm font-medium break-words">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {report.failedSections && report.failedSections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Collection failures</CardTitle>
            <CardDescription>
              These sections errored on the client, so the bundle is partial.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {report.failedSections.map((section) => (
              <Badge key={section} variant="outline" className="text-destructive">
                {section}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contents</CardTitle>
          <CardDescription>Top-level sections and their size in the bundle.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5 text-sm">
          {sections.length === 0 && <p className="text-muted-foreground">Empty payload.</p>}
          {sections.map((section) => (
            <div key={section.key} className="flex items-center justify-between gap-4">
              <span className="truncate font-mono text-muted-foreground">{section.key}</span>
              <span className="tabular-nums font-medium whitespace-nowrap">
                {formatBytes(section.bytes)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw payload</CardTitle>
          <CardDescription>
            {truncated
              ? `Preview only — first ${formatBytes(PREVIEW_CHAR_LIMIT)} of ${formatBytes(pretty.length)}. Use “Full JSON” for the complete bundle.`
              : "Complete bundle as received."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs whitespace-pre">
            {truncated ? `${pretty.slice(0, PREVIEW_CHAR_LIMIT)}\n\n… truncated …` : pretty}
          </pre>
        </CardContent>
      </Card>
    </main>
  )
}

function describeSections(payload: unknown): { key: string; bytes: number }[] {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return []
  }

  return Object.entries(payload)
    .map(([key, value]) => ({
      key,
      bytes: Buffer.byteLength(JSON.stringify(value) ?? "null", "utf8"),
    }))
    .sort((a, b) => b.bytes - a.bytes)
}
