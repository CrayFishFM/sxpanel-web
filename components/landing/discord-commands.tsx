"use client"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function DiscordCommands({ commands }: { commands: string[] }) {
  const { copiedText, copy } = useCopyToClipboard()

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {commands.map((cmd) => {
        const copied = copiedText === cmd
        return (
          <button
            key={cmd}
            type="button"
            onClick={() => copy(cmd)}
            aria-label={copied ? `${cmd} copied` : `Copy ${cmd}`}
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
              copied
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-foreground"
            )}
          >
            {copied ? "copied ✓" : cmd}
          </button>
        )
      })}
    </div>
  )
}
