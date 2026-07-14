import {
  ArrowRight,
  BarChart3,
  Check,
  Gamepad2,
  Globe,
  Languages,
  MessageSquare,
  ShieldCheck,
  Terminal,
  Timer,
  Users,
  Zap,
} from "lucide-react"

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

const DISCORD_URL = "https://discord.gg/hUM3pQeGFc"
const GITHUB_URL = "https://github.com/Snipzil/sxpanel"
const RELEASES_URL = "https://github.com/Snipzil/sxpanel/releases"

const FEATURES = [
  {
    icon: Terminal,
    title: "Web Panel",
    description: "A real-time control room for your server.",
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

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--brand-muted),transparent_70%)] opacity-60" />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
            <Badge
              variant="outline"
              className="mb-6 h-7 gap-1.5 border-brand/30 bg-brand/5 px-3 text-brand"
            >
              <Zap className="size-3" />
              Drop-in replacement for txAdmin
            </Badge>

            <h1 className="font-heading max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Manage your FiveM &amp; RedM server from one{" "}
              <span className="bg-gradient-to-r from-brand to-brand/60 bg-clip-text text-transparent">
                powerful panel
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
              sxPanel is a full-featured web panel and in-game menu — a complete
              overhaul of txAdmin with live console, deep insights, player
              management and Discord integration. Fully compatible with your
              existing servers and configs.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-brand text-brand-foreground shadow-sm shadow-brand/30 hover:bg-brand/90"
              >
                <a href={RELEASES_URL} target="_blank" rel="noreferrer">
                  Download latest release
                  <ArrowRight />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  <GithubIcon />
                  View on GitHub
                </a>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              MIT licensed · Existing txData directories work without modification
            </p>

            {/* Console mockup */}
            <div className="mt-14 w-full max-w-4xl">
              <div className="overflow-hidden rounded-xl border border-border bg-card text-left shadow-2xl shadow-black/10 ring-1 ring-foreground/5">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <span className="size-3 rounded-full bg-destructive/60" />
                  <span className="size-3 rounded-full bg-chart-2/60" />
                  <span className="size-3 rounded-full bg-brand/60" />
                  <span className="ml-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Terminal className="size-3.5" />
                    sxPanel · Live Console
                  </span>
                  <Badge
                    variant="outline"
                    className="ml-auto border-brand/30 bg-brand/5 text-[10px] text-brand"
                  >
                    ● online
                  </Badge>
                </div>
                <div className="space-y-1.5 p-4 font-mono text-xs leading-relaxed sm:text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-brand">sxpanel</span> ~ starting server
                    monitor
                  </p>
                  <p>
                    <span className="text-chart-2">[OK]</span> txData directory
                    detected — 0 migrations needed
                  </p>
                  <p>
                    <span className="text-chart-2">[OK]</span> Web panel ready on{" "}
                    <span className="text-brand">http://localhost:40120</span>
                  </p>
                  <p>
                    <span className="text-chart-2">[OK]</span> Discord bot
                    connected · status embed updated
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground">players</span> 42 online ·
                    peak 118 · uptime 6d 14h
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-brand">sxpanel</span> ~{" "}
                    <span className="inline-block h-4 w-2 animate-pulse bg-foreground/70" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 text-sm font-medium text-muted-foreground sm:px-6">
            <span className="text-xs tracking-wide uppercase">Works with</span>
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
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Everything, in one place
            </Badge>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Built to run serious servers
            </h2>
            <p className="mt-4 text-muted-foreground">
              Six pillars of functionality, each designed to replace a pile of
              separate resources and dashboards.
            </p>
          </div>

          <div id="ingame" className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="group transition-colors hover:ring-brand/30"
              >
                <CardHeader>
                  <div className="mb-2 grid size-10 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {feature.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section id="insights" className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 px-6 py-8 text-center"
              >
                <stat.icon className="size-5 text-brand" />
                <span className="font-heading text-4xl font-semibold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Drop-in / Quick start */}
        <section id="quickstart" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge variant="secondary" className="mb-4">
                Migrate in minutes
              </Badge>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                A true drop-in replacement
              </h2>
              <p className="mt-4 text-muted-foreground">
                sxPanel is built on top of txAdmin with full compatibility for
                existing servers, databases and configurations. No data
                migration, no rewrites — just swap the folder and go.
              </p>

              <div className="mt-8 space-y-6">
                {STEPS.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 font-heading text-sm font-semibold text-brand ring-1 ring-brand/20">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Terminal className="size-4 text-brand" />
                    Migrating from txAdmin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
                    <p className="text-muted-foreground"># in your FXServer artifacts</p>
                    <p>
                      <span className="text-brand">$</span> rm -rf monitor/
                    </p>
                    <p>
                      <span className="text-brand">$</span> unzip sxpanel-latest.zip -d monitor/
                    </p>
                    <p className="text-chart-2"># existing txData works as-is ✔</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="size-4 text-brand" />
                    And plenty more
                  </CardTitle>
                  <CardDescription>
                    Beyond the highlights, sxPanel ships with:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {[
                      "Recipe-based deployer (<60s)",
                      "GitHub token support & headless CLI",
                      "Artifact management",
                      "Scheduled & postponable restarts",
                      "Report system w/ Discord alerts",
                      "30+ languages built in",
                    ].map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Discord commands */}
        <section className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <Badge variant="secondary" className="mb-4">
                  <MessageSquare className="size-3" />
                  Discord Integration
                </Badge>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Run your server from Discord
                </h2>
                <p className="mt-4 text-muted-foreground">
                  An auto-updated status embed keeps your community informed,
                  while a full suite of slash commands lets admins moderate
                  without ever opening the panel.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {COMMANDS.map((cmd) => (
                    <span
                      key={cmd}
                      className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {cmd}
                    </span>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-8">
                  <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                    <MessageSquare />
                    Join the Discord
                  </a>
                </Button>
              </div>

              <Card className="lg:justify-self-end lg:max-w-md">
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
                    <Badge className="ml-auto bg-chart-2/15 text-chart-2">
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
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center ring-1 ring-foreground/5 sm:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,var(--brand-muted),transparent_70%)] opacity-70" />
            <h2 className="font-heading mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Take control of your server today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Download the latest release, swap the folder, and open the panel —
              you&apos;ll be up and running in minutes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-brand text-brand-foreground shadow-sm shadow-brand/30 hover:bg-brand/90"
              >
                <a href={RELEASES_URL} target="_blank" rel="noreferrer">
                  Download sxPanel
                  <ArrowRight />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={DISCORD_URL} target="_blank" rel="noreferrer">
                  <MessageSquare />
                  Join the community
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-brand font-heading text-xs font-bold text-brand-foreground">
              sx
            </span>
            <span className="font-heading font-semibold">sxPanel</span>
            <span className="text-sm text-muted-foreground">
              · MIT licensed
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="https://sxpanel.org/docs" className="hover:text-foreground" target="_blank" rel="noreferrer">
              Documentation
            </a>
            <a href="https://sxpanel.org/docs/recipes" className="hover:text-foreground" target="_blank" rel="noreferrer">
              Recipes
            </a>
            <a href={RELEASES_URL} className="hover:text-foreground" target="_blank" rel="noreferrer">
              Releases
            </a>
            <a href={DISCORD_URL} className="hover:text-foreground" target="_blank" rel="noreferrer">
              Discord
            </a>
            <a href={GITHUB_URL} className="flex items-center gap-1.5 hover:text-foreground" target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </nav>
        </div>
        <div className="border-t border-border/60">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
            Built by snipz &amp; contributors. Originally created by tabarra as
            txAdmin.
          </p>
        </div>
      </footer>
    </div>
  )
}
