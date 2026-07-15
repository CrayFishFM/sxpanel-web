"use client"

import * as React from "react"
import { AlertCircle, ArrowRight, Check, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NotifyForm() {
  const [email, setEmail] = React.useState("")
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      setError("Enter your email address.")
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("That email doesn't look right.")
      return
    }

    setError(null)
    setDone(true)
  }

  if (done) {
    return (
      <div className="animate-in fade-in-0 zoom-in-95 inline-flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success duration-300 ease-[var(--ease-out-quart)]">
        <Check className="size-4" />
        You&apos;re on the list — we&apos;ll email you when a new version ships.
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-2"
      noValidate
    >
      <p className="mb-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <Mail className="size-4 shrink-0" />
        Prefer to wait? Get an email on new releases.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
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
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "notify-email-error" : undefined}
          className="h-11 w-full flex-1 rounded-lg border border-border bg-background px-4 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive/50 aria-invalid:focus-visible:ring-destructive/20"
        />
        <Button type="submit" variant="brand" size="lg" className="h-11 shrink-0">
          Notify me
          <ArrowRight />
        </Button>
      </div>
      {error && (
        <p
          id="notify-email-error"
          role="alert"
          className="animate-in fade-in-0 slide-in-from-top-1 flex items-center gap-1.5 text-sm text-destructive duration-200"
        >
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </form>
  )
}
