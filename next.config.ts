import type { NextConfig } from "next"
import { fileURLToPath } from "node:url"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
