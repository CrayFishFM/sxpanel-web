import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { siteConfig } from "@/lib/site"

/**
 * Shared options for Fumadocs layouts.
 *
 * Note: `DocsLayout` is a Client Component, so everything here must be
 * serializable across the RSC boundary — no functions and no non-client
 * component references. The title is therefore inlined as plain spans rather
 * than using the shared <Brand/> component.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-brand to-brand/80 text-[11px] font-bold text-brand-foreground shadow-sm shadow-brand/40">
            sx
          </span>
          <span className="font-heading font-semibold tracking-tight">
            sxPanel
          </span>
        </>
      ),
      url: "/",
      transparentMode: "top",
    },
    githubUrl: siteConfig.github,
    links: [
      {
        text: "Home",
        url: "/",
      },
      {
        text: "Discord",
        url: siteConfig.discord,
        external: true,
      },
      {
        type: "button",
        text: "Download",
        url: siteConfig.releases,
        external: true,
      },
    ],
  }
}
