import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/site"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  const docs = source.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docs,
  ]
}
