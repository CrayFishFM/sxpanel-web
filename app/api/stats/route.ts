import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { installs } from "@/lib/db/stats-schema";
import { statsPayloadSchema } from "@/lib/telemetry-schema";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { getStatsSummary } from "@/lib/stats-queries";

// A conforming payload (200 resource entries + labels) comfortably fits in a
// few KB; anything past this is either abuse or a malformed client.
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = statsPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  const row = {
    installId: payload.installId,
    version: payload.version,
    clientTimestamp: payload.timestamp,

    os: payload.server.os,
    serverName: payload.server.name,
    playerSlots: payload.server.playerSlots,
    currentPlayers: payload.server.currentPlayers,
    projectName: payload.server.projectName,
    gameName: payload.server.gameName,
    cfxId: payload.server.cfxId,

    totalUniquePlayers: payload.stats.totalUniquePlayers,
    totalPlayTimeSeconds: payload.stats.totalPlayTimeSeconds,

    inventoryTotal: payload.inventory?.total,
    inventoryStarted: payload.inventory?.started,
    inventoryStopped: payload.inventory?.stopped,
    inventoryLabels: payload.inventory?.labels,
    inventoryEntries: payload.inventory?.entries,

    fxsVersion: payload.dashboard?.fxsVersion,
    locale: payload.dashboard?.locale,
    panelUptimeSeconds: payload.dashboard?.panelUptimeSeconds,
    panelUrl: payload.dashboard?.panelUrl,
    adminCount: payload.dashboard?.adminCount,

    featureDiscordBot: payload.dashboard?.features?.discordBot,
    featureBanlist: payload.dashboard?.features?.banlist,
    featureWhitelist: payload.dashboard?.features?.whitelist,
    featureMenuEnabled: payload.dashboard?.features?.menuEnabled,

    moderationBans: payload.dashboard?.moderation?.bans,
    moderationWarns: payload.dashboard?.moderation?.warns,
    moderationKicks: payload.dashboard?.moderation?.kicks,
    moderationWhitelists: payload.dashboard?.moderation?.whitelists,
  };

  await db
    .insert(installs)
    .values(row)
    .onConflictDoUpdate({
      target: installs.installId,
      set: { ...row, lastSeenAt: sql`now()` },
    });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getStatsSummary();
  return NextResponse.json(summary);
}
