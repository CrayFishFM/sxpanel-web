export const siteConfig = {
  name: "sxPanel",
  url: "https://sxpanel.org",
  description:
    "A full-featured web panel and in-game menu to manage and monitor your FiveM & RedM server — a complete, drop-in overhaul of txAdmin.",
  tagline: "The control room for your FiveM & RedM server",
  discord: "https://discord.gg/hUM3pQeGFc",
  github: "https://github.com/Snipzil/sxpanel",
  releases: "https://github.com/Snipzil/sxpanel/releases",
} as const

export type SiteConfig = typeof siteConfig
