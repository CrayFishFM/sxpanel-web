import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { normalizeReportId } from "@/lib/report-id"
import { countReports, listRecentReports, RETENTION_DAYS } from "@/lib/reports-queries"
import { formatBytes, formatTimestamp } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function ReportsPage(props: PageProps<"/dashboard/reports">) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    redirect("/sign-in")
  }

  const { id } = await props.searchParams
  const lookup = typeof id === "string" ? id : undefined

  // The lookup box is a plain GET form, so resolving it here keeps the whole
  // page a server component — no client JS just to navigate.
  if (lookup) {
    const normalized = normalizeReportId(lookup)
    if (normalized) redirect(`/dashboard/reports/${normalized}`)
  }

  const [reports, total] = await Promise.all([listRecentReports(), countReports()])

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Diagnostics reports</h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} stored · kept for {RETENTION_DAYS} days after arrival
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to telemetry</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Look up a report</CardTitle>
          <CardDescription>
            Paste the 8-character id the user was shown in sxPanel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="report-lookup" className="text-sm font-medium">
                Report id
              </label>
              <input
                id="report-lookup"
                name="id"
                required
                autoComplete="off"
                spellCheck={false}
                placeholder="A7K2M9QF"
                defaultValue={lookup ?? ""}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm uppercase tracking-[0.2em] shadow-sm outline-none transition-colors placeholder:tracking-[0.2em] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </div>
            <Button type="submit" className="shrink-0">
              Open report
            </Button>
          </form>
          {lookup && !normalizeReportId(lookup) && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              &ldquo;{lookup}&rdquo; isn&rsquo;t a valid report id — they&rsquo;re 8
              characters, letters and digits only.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent arrivals</CardTitle>
          <CardDescription>Newest first ({reports.length} shown)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-4 font-medium">Report</th>
                  <th className="pb-2 pr-4 font-medium">Received</th>
                  <th className="pb-2 pr-4 font-medium">sxPanel</th>
                  <th className="pb-2 pr-4 font-medium">Size</th>
                  <th className="pb-2 font-medium">Collection</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.reportId} className="border-t border-border/60">
                    <td className="py-2 pr-4">
                      <Link
                        href={`/dashboard/reports/${report.reportId}`}
                        className="font-mono tracking-widest underline-offset-4 hover:underline"
                      >
                        {report.reportId}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                      {formatTimestamp(report.receivedAt)}
                    </td>
                    <td className="py-2 pr-4">{report.txVersion ?? "—"}</td>
                    <td className="py-2 pr-4 tabular-nums whitespace-nowrap">
                      {formatBytes(report.jsonBytes)}
                    </td>
                    <td className="py-2">
                      {report.failedSections && report.failedSections.length > 0 ? (
                        <Badge variant="outline" className="text-destructive">
                          {report.failedSections.length} section
                          {report.failedSections.length === 1 ? "" : "s"} failed
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No reports received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
