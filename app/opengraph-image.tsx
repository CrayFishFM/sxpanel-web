import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site"

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "public/fonts/inter-700.ttf")
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(120% 120% at 20% 0%, #2a1f4d 0%, #15171c 55%, #0e1014 100%)",
          color: "white",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "linear-gradient(135deg, #7c5cff 0%, #5b3fd6 100%)",
              fontSize: 44,
              fontWeight: 700,
              boxShadow: "0 8px 32px rgba(124,92,255,0.4)",
            }}
          >
            sx
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 920,
            }}
          >
            The control room for your FiveM &amp; RedM server
          </div>
          <div style={{ fontSize: 30, color: "#a8acb8", maxWidth: 820 }}>
            Live console, deep insights, player management &amp; Discord — a
            drop-in overhaul of txAdmin.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#8a8f9c",
          }}
        >
          <span>{siteConfig.url.replace("https://", "")}</span>
          <span>MIT licensed · Open source</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, weight: 700, style: "normal" }],
    }
  )
}
