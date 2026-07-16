import { desc, gt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { installs } from "@/lib/db/stats-schema";

const ACTIVE_WINDOW_MINUTES = 15;

export async function getStatsSummary() {
  const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MINUTES * 60 * 1000);

  const [totals] = await db
    .select({
      totalInstalls: sql<number>`count(*)`.mapWith(Number),
      activeInstalls: sql<number>`count(*) filter (where ${installs.lastSeenAt} > ${activeSince})`.mapWith(
        Number,
      ),
      totalPlayers: sql<number>`coalesce(sum(${installs.totalUniquePlayers}), 0)`.mapWith(Number),
      discordBotEnabled: sql<number>`count(*) filter (where ${installs.featureDiscordBot})`.mapWith(
        Number,
      ),
      banlistEnabled: sql<number>`count(*) filter (where ${installs.featureBanlist})`.mapWith(Number),
      whitelistEnabled: sql<number>`count(*) filter (where ${installs.featureWhitelist})`.mapWith(
        Number,
      ),
      menuEnabled: sql<number>`count(*) filter (where ${installs.featureMenuEnabled})`.mapWith(Number),
    })
    .from(installs);

  const byVersion = await db
    .select({ version: installs.version, count: sql<number>`count(*)`.mapWith(Number) })
    .from(installs)
    .groupBy(installs.version)
    .orderBy(desc(sql`count(*)`));

  const byOs = await db
    .select({ os: installs.os, count: sql<number>`count(*)`.mapWith(Number) })
    .from(installs)
    .groupBy(installs.os)
    .orderBy(desc(sql`count(*)`));

  const byGame = await db
    .select({ gameName: installs.gameName, count: sql<number>`count(*)`.mapWith(Number) })
    .from(installs)
    .groupBy(installs.gameName)
    .orderBy(desc(sql`count(*)`));

  const recent = await db
    .select({
      installId: installs.installId,
      version: installs.version,
      os: installs.os,
      gameName: installs.gameName,
      projectName: installs.projectName,
      playerSlots: installs.playerSlots,
      currentPlayers: installs.currentPlayers,
      lastSeenAt: installs.lastSeenAt,
    })
    .from(installs)
    .where(gt(installs.lastSeenAt, activeSince))
    .orderBy(desc(installs.lastSeenAt))
    .limit(50);

  return {
    ...totals,
    byVersion,
    byOs,
    byGame,
    recent,
  };
}
