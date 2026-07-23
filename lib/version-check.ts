import * as z from "zod";
import { siteConfig } from "@/lib/site";

const GITHUB_RELEASES_LATEST_URL = "https://api.github.com/repos/Snipzil/sxpanel/releases/latest";

// "latest" already excludes drafts/prereleases per GitHub's own semantics,
// we just need the tag out of the response.
const githubReleaseSchema = z.object({
  tag_name: z.string().min(1),
});

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

// Cached via Next's fetch data cache (see route revalidate) so repeated txAdmin polling doesn't hammer GitHub's rate limit.
export async function getLatestVersion(): Promise<string | null> {
  try {
    const response = await fetch(GITHUB_RELEASES_LATEST_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": `${siteConfig.name} (${siteConfig.url})`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const parsed = githubReleaseSchema.safeParse(await response.json());
    if (!parsed.success) {
      return null;
    }

    const version = parsed.data.tag_name.replace(/^v/, "");
    return SEMVER_RE.test(version) ? version : null;
  } catch {
    return null;
  }
}
