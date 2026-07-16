import { siteConfig } from "@/lib/site"

type GraphNode = Record<string, unknown>

/** Organization / brand node, referenced site-wide via a stable @id. */
export function organizationJsonLd(): GraphNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo2.png`,
    sameAs: [siteConfig.github, siteConfig.discord],
  }
}

/** WebSite node — fuels site-name rich results and sitelinks. */
export function websiteJsonLd(): GraphNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    alternateName: "sxPanel FiveM & RedM panel",
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  }
}

/** SoftwareApplication node for the product landing page. */
export function softwareAppJsonLd(): GraphNode {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Linux, Windows",
    url: siteConfig.url,
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
  }
}

/** FAQPage node built from the landing page FAQ entries. */
export function faqJsonLd(items: { q: string; a: string }[]): GraphNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }
}
