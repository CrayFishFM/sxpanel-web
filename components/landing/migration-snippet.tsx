"use client"

import { Check, Copy, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

const MIGRATION_COMMANDS = "rm -rf monitor/\nunzip sxpanel-latest.zip -d monitor/"

export function MigrationSnippet() {
  const { copiedText, copy } = useCopyToClipboard()
  const copied = copiedText === MIGRATION_COMMANDS

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Terminal className="size-4 text-brand" />
          Migrating from txAdmin
        </CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => copy(MIGRATION_COMMANDS)}
            aria-label={copied ? "Commands copied" : "Copy migration commands"}
          >
            {copied ? <Check className="text-success" /> : <Copy />}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
          <p className="text-muted-foreground"># in your FXServer artifacts</p>
          <p>
            <span className="text-brand">$</span> rm -rf monitor/
          </p>
          <p>
            <span className="text-brand">$</span> unzip sxpanel-latest.zip -d
            monitor/
          </p>
          <p className="text-success"># existing txData works as-is ✓</p>
        </div>
      </CardContent>
    </Card>
  )
}
