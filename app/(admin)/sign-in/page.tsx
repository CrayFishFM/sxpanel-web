"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

function friendlyError(error: { code?: string; status?: number; message?: string } | Error): string {
  const code = "code" in error ? error.code : undefined
  const message = "message" in error ? error.message : undefined

  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
    case "INVALID_PASSWORD":
    case "INVALID_EMAIL":
      return "Email or password is incorrect."
    case "EMAIL_NOT_VERIFIED":
      return "Your email hasn't been verified yet."
    case "USER_NOT_FOUND":
      return "No account found for that email."
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please wait a moment and try again."
    case "FAILED_TO_CREATE_USER":
      return "We couldn't complete sign in. Please try again."
  }

  const text = (message ?? "").toLowerCase()
  if (text.includes("failed to fetch") || text.includes("networkrequestfailed") || text.includes("network")) {
    return "Can't reach the server. Check your connection and try again."
  }
  if (text.includes("timeout") || text.includes("aborted")) {
    return "The request took too long. Please try again."
  }

  return message || "Something went wrong. Please try again."
}

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    try {
      const { error } = await authClient.signIn.email({ email, password })

      if (error) {
        setError(friendlyError(error))
        setPending(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? friendlyError(err)
          : "Something went wrong. Please try again."
      )
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin sign in</CardTitle>
          <CardDescription>sxPanel telemetry dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </div>
            {error && (
              <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </p>
            )}
            <Button type="submit" variant="brand" size="lg" className="mt-1" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
              <ArrowRight />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
