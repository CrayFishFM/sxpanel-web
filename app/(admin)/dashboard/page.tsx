import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getStatsSummary } from "@/lib/stats-queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/admin/sign-out-button"
import { CreateAdminForm } from "@/components/admin/create-admin-form"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || session.user.role !== "admin") {
    redirect("/sign-in")
  }

  const stats = await getStatsSummary()

  const tiles = [
    { label: "Total installs", value: stats.totalInstalls },
    { label: "Active (last 15m)", value: stats.activeInstalls },
    { label: "Unique players (sum)", value: stats.totalPlayers },
    { label: "Discord bot enabled", value: stats.discordBotEnabled },
  ]

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Telemetry dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as {session.user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/reports">Diagnostics reports</Link>
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label} size="sm">
            <CardHeader>
              <CardDescription>{tile.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{tile.value.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <BreakdownCard title="By version" rows={stats.byVersion.map((r) => ({ label: r.version, count: r.count }))} />
        <BreakdownCard title="By OS" rows={stats.byOs.map((r) => ({ label: r.os, count: r.count }))} />
        <BreakdownCard
          title="By game"
          rows={stats.byGame.map((r) => ({ label: r.gameName ?? "unknown", count: r.count }))}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active installs</CardTitle>
          <CardDescription>Seen in the last 15 minutes ({stats.recent.length})</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-4 font-medium">Project</th>
                  <th className="pb-2 pr-4 font-medium">Version</th>
                  <th className="pb-2 pr-4 font-medium">OS</th>
                  <th className="pb-2 pr-4 font-medium">Game</th>
                  <th className="pb-2 font-medium">Players</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((row) => (
                  <tr key={row.installId} className="border-t border-border/60">
                    <td className="py-2 pr-4">{row.projectName ?? "—"}</td>
                    <td className="py-2 pr-4">{row.version}</td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline">{row.os}</Badge>
                    </td>
                    <td className="py-2 pr-4">{row.gameName ?? "—"}</td>
                    <td className="py-2 tabular-nums">
                      {row.currentPlayers}/{row.playerSlots}
                    </td>
                  </tr>
                ))}
                {stats.recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No active installs right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add an admin</CardTitle>
          <CardDescription>Grants full access to this dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAdminForm />
        </CardContent>
      </Card>
    </main>
  )
}

function BreakdownCard({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 text-sm">
        {rows.length === 0 && <p className="text-muted-foreground">No data yet.</p>}
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="truncate text-muted-foreground">{row.label}</span>
            <span className="tabular-nums font-medium">{row.count.toLocaleString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
