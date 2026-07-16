import type { Metadata, Viewport } from "next"
import { Geist, JetBrains_Mono } from "next/font/google"

import { RootProvider } from "fumadocs-ui/provider/next"

import "./globals.css"
import { DevConsoleMessage } from "@/components/dev-console-message"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "sxPanel",
    "txAdmin",
    "FiveM panel",
    "RedM panel",
    "FXServer",
    "FiveM admin",
    "server management",
    "FiveM console",
    "Cfx.re",
  ],
  authors: [{ name: "snipz" }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
}

export const viewport: Viewport = {
  themeColor: "#0e0e10",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-card focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
        </ThemeProvider>
        <DevConsoleMessage />
      </body>
    </html>
  )
}
