import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <span className="grid size-6 place-items-center rounded-md bg-brand text-[11px] font-bold text-brand-foreground">
            sx
          </span>
          <span className="font-semibold">sxPanel</span>
        </>
      ),
      transparentMode: "top",
    },
    githubUrl: "https://github.com/Snipzil/sxpanel",
    links: [
      {
        text: "Home",
        url: "/",
      },
      {
        text: "Discord",
        url: "https://discord.gg/hUM3pQeGFc",
        external: true,
      },
    ],
  }
}
