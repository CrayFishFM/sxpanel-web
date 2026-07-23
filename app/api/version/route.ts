import { NextResponse } from "next/server";
import { getLatestVersion } from "@/lib/version-check";

// Matches the upstream GitHub fetch's revalidate window so the route
// itself is cacheable (e.g. behind a CDN) rather than staying dynamic.
export const revalidate = 300;

export async function GET() {
  const latest = await getLatestVersion();

  if (!latest) {
    return NextResponse.json({ error: "Unable to determine latest version" }, { status: 502 });
  }

  return NextResponse.json(
    { latest },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
