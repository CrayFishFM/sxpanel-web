"use client"

import * as React from "react"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotifyForm() {
  const [email, setEmail] = React.useState("")
  const [done, setDone] = React.useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setDone(true)
  }

  if (done) {
    return (
      <div className="animate-in fade-in-0 zoom-in-95 inline-flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success duration-300 ease-[var(--ease-out-quart)]">
        <Check className="size-4" />
        You&apos;re on the list — we&apos;ll ping you on new releases.
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row"
      noValidate
    >
      <label htmlFor="notify-email" className="sr-only">
        Email address
      </label>
      <input
        id="notify-email"
        type="email"
        required
        inputMode="email"
        autoComplete="email"
        placeholder="you@server.gg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 w-full flex-1 rounded-lg border border-border bg-background px-4 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
      />
      <Button type="submit" variant="brand" size="lg" className="h-11 shrink-0">
        Notify me
        <ArrowRight />
      </Button>
    </form>
  )
}
