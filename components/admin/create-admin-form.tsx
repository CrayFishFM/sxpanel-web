"use client"

import * as React from "react"
import { AlertCircle, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function CreateAdminForm() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const { error } = await authClient.admin.createUser({
      name,
      email,
      password,
      role: "admin",
    })

    setPending(false)
    if (error) {
      setError(error.message ?? "Couldn't create that admin.")
      return
    }
    setName("")
    setEmail("")
    setPassword("")
    setDone(true)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
      <Field label="Name" id="new-admin-name">
        <input
          id="new-admin-name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setDone(false)
          }}
          className={inputClassName}
        />
      </Field>
      <Field label="Email" id="new-admin-email">
        <input
          id="new-admin-email"
          type="email"
          required
          autoComplete="off"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setDone(false)
          }}
          className={inputClassName}
        />
      </Field>
      <Field label="Password" id="new-admin-password">
        <input
          id="new-admin-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setDone(false)
          }}
          className={inputClassName}
        />
      </Field>
      <Button type="submit" disabled={pending} className="shrink-0">
        {pending ? "Adding…" : "Add admin"}
      </Button>
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </p>
      )}
      {done && !error && (
        <p className="flex items-center gap-1.5 text-sm text-success">
          <Check className="size-4 shrink-0" />
          Admin created.
        </p>
      )}
    </form>
  )
}

const inputClassName =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}
