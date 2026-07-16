import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Check,
  Flag,
  Gamepad2,
  Globe,
  Languages,
  ListChecks,
  MessageSquare,
  Package,
  RotateCw,
  ShieldCheck,
  Terminal,
  Timer,
  Users,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SiteHeader } from "@/components/site-header"
import { GithubIcon } from "@/components/icons"
import { Brand } from "@/components/brand"
import { Reveal } from "@/components/reveal"
import { ProductMockup } from "@/components/landing/product-mockup"
import { AnalyticsShowcase } from "@/components/landing/analytics-showcase"
import { NotifyForm } from "@/components/landing/notify-form"
import { MigrationSnippet } from "@/components/landing/migration-snippet"
import { DiscordCommands } from "@/components/landing/discord-commands"
import { StatValue } from "@/components/landing/stat-value"
import { siteConfig } from "@/lib/site"

const FEATURES = [
  {
    icon: Terminal,
    title: "Web Panel",
    description: "A real-time control room for your server.",
    href: "/docs/features#web-panel",
    points: [
      "Live console with block-based buffer & lazy-loading",
      "Performance charts — CPU, memory & threads",
      "Per-resource runtime stats (CPU, memory, tick time)",
      "CFG editor & validator with dark mode UI",
      "Real-time playerlist with fuzzy search & tags",
    ],
  },
  {
    icon: Gamepad2,
    title: "In-Game Menu",
    description: "Admin tooling that lives inside the game.",
    href: "/docs/features#in-game-menu",
    points: [
      "Player Mode: NoClip, God, SuperJump",
      "Teleport, Vehicle, Heal & Announcements",
      "Live Spectate directly from the web panel",
      "Built-in screenshots — no screenshot-basic",
      "Ban / Warn / DM with editable durations",
    ],
  },
  {
    icon: BarChart3,
    title: "Insights & Analytics",
    description: "Understand how your server actually performs.",
    href: "#analytics",
    points: [
      "Player count & memory timeline up to 96h",
      "Retention metrics — 1d / 7d / 30d",
      "Peak hours heatmap & playtime distribution",
      "Admin actions timeline & session stats",
      "Server uptime and disconnect reasons",
    ],
  },
  {
    icon: Users,
    title: "Player Management",
    description: "Everything you need to keep the peace.",
    href: "/docs/features#player-management",
    points: [
      "Warning & Ban system with full history",
      "Whitelist — Discord, License, Role, Admin-only",
      "Auto-tags + up to 20 custom tags via exports",
      "Activity heatmap, risk assessment, name history",
      "Self-contained database — no MySQL required",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Access Control",
    description: "Granular permissions for every admin.",
    href: "/docs/permissions",
    points: [
      "Login via Cfx.re or password",
      "40+ granular permissions with presets",
      "Per-admin statistics & action logging",
      "Structured JSONL system logger",
    ],
  },
  {
    icon: MessageSquare,
    title: "Discord Integration",
    description: "Manage and monitor without leaving Discord.",
    href: "/docs/discord",
    points: [
      "Auto-updated status embed with custom footer",
      "/status, /whitelist, /warn, /ban, /history & more",
      "Notifications for reports, bans & crashes",
      "Whitelist alerts wired straight to your server",
    ],
  },
]

const STATS = [
  { icon: ShieldCheck, value: "40+", label: "Granular permissions" },
  { icon: Languages, value: "30+", label: "Supported languages" },
  { icon: Timer, value: "<60s", label: "Recipe-based deploy" },
  { icon: BarChart3, value: "96h", label: "Insights history" },
]

const STEPS = [
  {
    title: "Download the latest release",
    body: "Grab the newest sxPanel build from GitHub Releases.",
  },
  {
    title: "Replace the monitor/ folder",
    body: "Swap the monitor/ folder in your FXServer artifacts with the sxPanel build.",
  },
  {
    title: "Start FXServer",
    body: "Launch without +exec server.cfg — sxPanel starts automatically.",
  },
  {
    title: "Open the panel URL",
    body: "Visit the URL shown in the console to set up your account and server.",
  },
]

const SETUP_STEPS: { label: string; done: boolean; active?: boolean }[] = [
  { label: "Create admin account", done: true },
  { label: "Link FXServer", done: true },
  { label: "Configure Discord bot", done: false, active: true },
  { label: "Review permissions", done: false },
]

const MORE_CAPABILITIES = [
  {
    icon: Zap,
    title: "Recipe-based deployer",
    body: "Stand up a new server in under 60 seconds with declarative recipes.",
  },
  {
    icon: Terminal,
    title: "GitHub token & headless CLI",
    body: "Automate deploys and artifact pulls from CI without a browser.",
  },
  {
    icon: Package,
    title: "Artifact management",
    body: "Browse, pin and switch FXServer artifact builds from the panel.",
  },
  {
    icon: RotateCw,
    title: "Scheduled restarts",
    body: "Cron-style restarts with postponable temp schedules and warnings.",
  },
  {
    icon: Flag,
    title: "Report system",
    body: "In-game player reports with Discord alerts and a triage queue.",
  },
  {
    icon: Languages,
    title: "30+ languages",
    body: "Localised panel and in-game menu, with community translations.",
  },
]

const COMMANDS = [
  "/status",
  "/whitelist",
  "/info",
  "/admininfo",
  "/warn",
  "/kick",
  "/ban",
  "/unban",
  "/notes",
  "/history",
]

const FAQ = [
  {
    q: "Is sxPanel compatible with my existing txAdmin server?",
    a: "Yes. sxPanel is a full overhaul built on top of txAdmin and is designed as a drop-in replacement. Existing txAdmin servers, databases and configurations work without modification.",
  },
  {
    q: "How do I migrate from txAdmin?",
    a: "Just replace the monitor folder in your FXServer artifacts with the sxPanel build. Your existing txData directories keep working — no reconfiguration required.",
  },
  {
    q: "Do I need MySQL or an external database?",
    a: "No. Player management, bans, warnings and history run on a self-contained database. There is no MySQL requirement to get started.",
  },
  {
    q: "Does it support FiveM and RedM?",
    a: "Yes. sxPanel works as a web panel and in-game menu to manage and monitor both FiveM and RedM servers running on FXServer.",
  },
  {
    q: "Is it free and open source?",
    a: "Yes. sxPanel is MIT licensed — originally created by tabarra as txAdmin — and welcomes community contributions.",
  },
]

export default function Page() {
  return (
    <div id="top" className="flex min-h-svh flex-col bg-background">
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--brand-muted),transparent_70%)] opacity-60" />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24">
            <Badge
              variant="outline"
              className="mb-6 h-7 gap-1.5 border-brand/30 bg-brand/5 px-3 text-brand"
            >
              <Zap className="size-3" />
              Drop-in replacement for txAdmin
            </Badge>

            <h1 className="font-heading mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Manage your FiveM &amp; RedM server from one{" "}
              <span className="text-brand">powerful panel</span>
            </h1>

            <p className="font-heading mx-auto mt-6 max-w-2xl text-lg font-medium text-balance sm:text-xl">
              Swap the folder, keep everything, get a lot more.
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
              Live console, deep insights, player management, granular
              permissions and Discord integration — layered onto the txAdmin
              foundation you already run, with zero migration.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="default" size="lg" asChild>
                <a href={siteConfig.releases} target="_blank" rel="noreferrer">
                  <ArrowRight />
                  Download latest release
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href={siteConfig.github} target="_blank" rel="noreferrer">
                  <GithubIcon />
                  View on GitHub
                </a>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              MIT licensed · Existing txData directories work without
              modification
            </p>

            <div className="mt-12 w-full max-w-4xl sm:mt-16">
              <ProductMockup />
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 text-sm font-medium text-muted-foreground sm:px-6">
            <span className="text-xs tracking-wide uppercase">
              Works with
            </span>
            {["txAdmin", "FiveM", "RedM", "FXServer", "Cfx.re"].map((name) => (
              <span key={name} className="flex items-center gap-1.5">
                <Check className="size-4 text-brand" />
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Built to run serious servers
            </h2>
            <p className="text-muted-foreground lg:text-right">
              Six pillars of functionality, each designed to replace a pile of
              separate resources and dashboards.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const flagship = i === 0
              return (
                <Reveal
                  key={feature.title}
                  delay={i * 60}
                  className={flagship ? "sm:col-span-2" : undefined}
                >
                  <a
                    href={feature.href}
                    className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card
                      className={cn(
                        "h-full transition-all duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-1 hover:border-brand/40 hover:shadow-card-hover",
                        flagship && "border-brand/25 bg-brand/5"
                      )}
                    >
                      <CardHeader>
                        <div className="mb-2 grid size-10 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                          <feature.icon className="size-5" />
                        </div>
                        <CardTitle asChild className="text-lg">
                          <h3>{feature.title}</h3>
                        </CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul
                          className={cn(
                            "space-y-2.5",
                            flagship &&
                              "sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-2.5"
                          )}
                        >
                          {feature.points.map((point) => (
                            <li
                              key={point}
                              className="flex gap-2.5 text-sm text-muted-foreground"
                            >
                              <Check className="mt-0.5 size-4 shrink-0 text-success" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                        {flagship && (
                          <div className="mt-4 rounded-md border border-border/60 bg-muted/30 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                            <span className="relative mr-1.5 inline-flex size-1.5 rounded-full bg-success align-middle" />
                            tailing console · 3 resources attached
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </a>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* Analytics showcase */}
        <AnalyticsShowcase />

        {/* Stats */}
        <section className="border-y border-border/60 bg-brand/5">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border/60 px-4 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:px-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 px-6 py-8 text-center"
              >
                <stat.icon className="size-5 text-brand" />
                <span className="font-heading text-4xl font-semibold tracking-tight">
                  <StatValue value={stat.value} />
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick start */}
        <section
          id="quickstart"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                A true drop-in replacement
              </h2>
              <p className="mt-4 text-muted-foreground">
                sxPanel is built on top of txAdmin with full compatibility for
                existing servers, databases and configurations. No new folder
                structure to learn — it drops into the artifacts you already
                deploy.
              </p>

              <ol className="mt-8 space-y-6">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 font-heading text-sm font-semibold text-brand ring-1 ring-brand/20">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-5">
              {/* Onboarding preview */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ListChecks className="size-4 text-brand" />
                    First-run setup wizard
                  </CardTitle>
                  <CardDescription>
                    Open the panel URL and sxPanel walks you through the rest.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5">
                    {SETUP_STEPS.map((s) => (
                      <div key={s.label} className="flex items-center gap-3">
                        <span
                          className={
                            s.done
                              ? "grid size-5 place-items-center rounded-full bg-success text-success-foreground"
                              : s.active
                                ? "grid size-5 place-items-center rounded-full border-2 border-brand bg-brand/10"
                                : "grid size-5 place-items-center rounded-full border border-border"
                          }
                        >
                          {s.done && <Check className="size-3" />}
                          {s.active && (
                            <span className="size-1.5 rounded-full bg-brand" />
                          )}
                        </span>
                        <span
                          className={
                            s.done
                              ? "text-sm text-muted-foreground line-through"
                              : s.active
                                ? "text-sm font-medium"
                                : "text-sm text-muted-foreground"
                          }
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-1/2 rounded-full bg-brand" />
                  </div>
                </CardContent>
              </Card>

              {/* Migration code */}
              <MigrationSnippet />
            </div>
          </div>
        </section>

        {/* More capabilities */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/60 bg-muted/50 px-5 py-4">
                  <div>
                    <h2 className="font-heading text-lg font-semibold tracking-tight">
                      Full capability manifest
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Beyond the highlights — the operational tools serious
                      communities rely on.
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {MORE_CAPABILITIES.length} systems
                  </span>
                </div>
                <div className="grid gap-px bg-border/60 sm:grid-cols-2">
                  {MORE_CAPABILITIES.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3.5 bg-card p-5"
                    >
                      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                        <item.icon className="size-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Discord */}
        <section
          id="discord"
          className="relative overflow-hidden border-b border-border/60"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_20%_50%,var(--brand-muted),transparent_70%)] opacity-50" />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="lg:order-2">
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Run your server from Discord
                </h2>
                <p className="mt-4 text-muted-foreground">
                  An auto-updated status embed keeps your community informed,
                  while a full suite of slash commands lets admins moderate
                  without ever opening the panel.
                </p>
                <DiscordCommands commands={COMMANDS} />
                <Button asChild variant="secondary" className="mt-8">
                  <a href={siteConfig.discord} target="_blank" rel="noreferrer">
                    <MessageSquare />
                    Join the Discord
                  </a>
                </Button>
              </div>

              <Card className="lg:order-1">
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground">
                      <Globe className="size-4.5" />
                    </span>
                    <div>
                      <CardTitle className="text-base">Server Status</CardTitle>
                      <CardDescription className="text-xs">
                        Auto-updated · custom footer
                      </CardDescription>
                    </div>
                    <Badge variant="success" className="ml-auto">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-success" />
                      </span>
                      Online
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    ["Players", "42 / 128"],
                    ["Uptime", "6d 14h 22m"],
                    ["Next restart", "in 3h 40m"],
                    ["Whitelist", "Discord + Role"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium tabular-nums">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24"
        >
          <Reveal className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-4">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Questions, answered
            </h2>
            <a
              href={siteConfig.discord}
              target="_blank"
              rel="noreferrer"
              className="hidden shrink-0 text-sm text-muted-foreground hover:text-brand sm:inline"
            >
              Still stuck? Ask in Discord →
            </a>
          </Reveal>
          <Accordion type="single" collapsible className="mt-6">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-card ring-1 ring-foreground/5 sm:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,var(--brand-muted),transparent_70%)] opacity-70" />
            <h2 className="font-heading mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Take control of your server today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Download the latest release, swap the folder, and open the panel —
              you&apos;ll be up and running in minutes.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-8">
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="default" size="lg" asChild>
                  <a href={siteConfig.releases} target="_blank" rel="noreferrer">
                    <ArrowRight />
                    Download sxPanel
                  </a>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href={siteConfig.discord} target="_blank" rel="noreferrer">
                    <MessageSquare />
                    Join the community
                  </a>
                </Button>
              </div>

              <div className="flex w-full max-w-md items-center gap-3 text-xs text-muted-foreground/70">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>

              <NotifyForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div className="space-y-4">
              <Brand href="#top" size="md" />
              <p className="max-w-xs text-sm text-muted-foreground">
                A full-featured web panel and in-game menu for FiveM &amp; RedM
                — a drop-in overhaul of txAdmin.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="hover:text-foreground">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#quickstart" className="hover:text-foreground">
                    Quick Start
                  </a>
                </li>
                <li>
                  <a href={siteConfig.releases} className="hover:text-foreground" target="_blank" rel="noreferrer">
                    Releases
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs/permissions" className="hover:text-foreground">
                    Permissions
                  </Link>
                </li>
                <li>
                  <Link href="/docs/events-api" className="hover:text-foreground">
                    Events API
                  </Link>
                </li>
                <li>
                  <a href={siteConfig.discord} className="hover:text-foreground" target="_blank" rel="noreferrer">
                    Discord
                  </a>
                </li>
                <li>
                  <a href={siteConfig.github} className="hover:text-foreground inline-flex items-center gap-1.5" target="_blank" rel="noreferrer">
                    <GithubIcon className="size-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Built by snipz &amp; contributors. Originally created by tabarra as
              txAdmin.
            </p>
            <p>MIT licensed · {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
