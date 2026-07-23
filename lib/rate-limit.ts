import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

/**
 * Fixed-window limiter backed by Postgres so it holds across serverless
 * instances (an in-memory Map would reset per cold start / per instance).
 *
 * Each endpoint gets its own table so their counters stay independent — a
 * burst of stats pings must not lock an operator out of filing a diagnostics
 * report, and the two have very different cost profiles.
 */
async function hitFixedWindow(
  table: "stats_rate_limits" | "diagnostics_rate_limits",
  ip: string,
  windowSeconds: number,
  maxRequests: number,
): Promise<boolean> {
  // Both interpolations are internal constants, never request data.
  const t = sql.raw(table);
  const window = sql.raw(String(windowSeconds));

  const result = await db.execute<{ count: number }>(sql`
    INSERT INTO ${t} (ip, window_start, count)
    VALUES (${ip}, now(), 1)
    ON CONFLICT (ip) DO UPDATE SET
      count = CASE
        WHEN ${t}.window_start < now() - interval '${window} seconds'
          THEN 1
        ELSE ${t}.count + 1
      END,
      window_start = CASE
        WHEN ${t}.window_start < now() - interval '${window} seconds'
          THEN now()
        ELSE ${t}.window_start
      END
    RETURNING count
  `);

  const count = result.rows[0]?.count ?? 0;
  return count > maxRequests;
}

/** Telemetry pings: small, frequent, one per install per interval. */
export async function isRateLimited(ip: string): Promise<boolean> {
  return hitFixedWindow("stats_rate_limits", ip, 60, 10);
}

/**
 * Diagnostics bundles: multi-megabyte and stored, so the ceiling is far
 * lower. The sender self-limits to one report per minute and retries once,
 * but that's client-side and trivially bypassable — this is the real limit.
 * Five per hour still leaves room for a genuine back-and-forth with support.
 */
export async function isDiagnosticsRateLimited(ip: string): Promise<boolean> {
  return hitFixedWindow("diagnostics_rate_limits", ip, 3600, 5);
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip") ?? "unknown";
}
