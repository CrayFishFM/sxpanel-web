"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/icons"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "In-Game", href: "#ingame" },
  { label: "Insights", href: "#insights" },
  { label: "Quick Start", href: "#quickstart" },
  { label: "FAQ", href: "#faq" },
  { label: "Docs", href: "/docs" },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-brand font-heading text-sm font-bold text-brand-foreground shadow-sm shadow-brand/40">
            sx
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            sxPanel
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a
              href="https://github.com/Snipzil/sxpanel"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon />
              GitHub
            </a>
          </Button>
          <Button size="sm" asChild className="hidden bg-brand text-brand-foreground hover:bg-brand/90 sm:inline-flex">
            <a
              href="https://github.com/Snipzil/sxpanel/releases"
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a href="https://github.com/Snipzil/sxpanel" target="_blank" rel="noreferrer">
                <GithubIcon />
                GitHub
              </a>
            </Button>
            <Button size="sm" asChild className="flex-1 bg-brand text-brand-foreground hover:bg-brand/90">
              <a href="https://github.com/Snipzil/sxpanel/releases" target="_blank" rel="noreferrer">
                Download
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
