"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { ArrowRight, Download, Menu, MessageSquare, Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/icons"
import { Brand } from "@/components/brand"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useActiveSection } from "@/hooks/use-active-section"
import { siteConfig } from "@/lib/site"

type NavLink = { label: string; href: string; id?: string }

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features", id: "features" },
  { label: "Analytics", href: "#analytics", id: "analytics" },
  { label: "Quick Start", href: "#quickstart", id: "quickstart" },
  { label: "Discord", href: "#discord", id: "discord" },
  { label: "FAQ", href: "#faq", id: "faq" },
  { label: "Docs", href: "/docs" },
]

const SECTION_IDS = NAV_LINKS
  .filter((l): l is NavLink & { id: string } => Boolean(l.id))
  .map((l) => l.id)

function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

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

function DownloadButton({ className }: { className?: string }) {
  return (
    <Button variant="brand" size="sm" asChild className={className}>
      <a href={siteConfig.releases} target="_blank" rel="noreferrer">
        <Download />
        <span className="hidden sm:inline">Download</span>
      </a>
    </Button>
  )
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const active = useActiveSection(SECTION_IDS, 96)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/80 backdrop-blur-xl transition-colors duration-300",
        scrolled && "border-border/60 shadow-card"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand href="#top" size="md" />

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = link.id != null && link.id === active
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-px scale-x-0 bg-brand transition-transform duration-300 ease-[var(--ease-out-quart)]",
                    isActive && "scale-x-100"
                  )}
                />
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden lg:inline-flex"
          >
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              <GithubIcon />
              <span className="hidden xl:inline">GitHub</span>
            </a>
          </Button>
          <DownloadButton />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center justify-between border-b border-border/60 p-4">
                <Brand href="#top" size="md" />
              </div>
              <nav
                className="flex flex-col gap-1 p-4"
                aria-label="Mobile"
                onClick={() => setOpen(false)}
              >
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto space-y-2 border-t border-border/60 p-4">
                <SheetClose asChild>
                  <Button variant="outline" asChild className="h-11 w-full">
                    <a href={siteConfig.github} target="_blank" rel="noreferrer">
                      <GithubIcon />
                      GitHub
                    </a>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" asChild className="h-11 w-full">
                    <a href={siteConfig.discord} target="_blank" rel="noreferrer">
                      <MessageSquare />
                      Discord
                    </a>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="brand" asChild className="h-11 w-full">
                    <a href={siteConfig.releases} target="_blank" rel="noreferrer">
                      <ArrowRight />
                      Download latest release
                    </a>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
