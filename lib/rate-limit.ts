import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 10;

/**
 * Fixed-window limiter backed by Postgres so it holds across serverless
 * instances (an in-memory Map would reset per cold start / per instance).
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  const result = await db.execute<{ count: number }>(sql`
    INSERT INTO stats_rate_limits (ip, window_start, count)
    VALUES (${ip}, now(), 1)
    ON CONFLICT (ip) DO UPDATE SET
      count = CASE
        WHEN stats_rate_limits.window_start < now() - interval '${sql.raw(String(WINDOW_SECONDS))} seconds'
          THEN 1
        ELSE stats_rate_limits.count + 1
      END,
      window_start = CASE
        WHEN stats_rate_limits.window_start < now() - interval '${sql.raw(String(WINDOW_SECONDS))} seconds'
          THEN now()
        ELSE stats_rate_limits.window_start
      END
    RETURNING count
  `);

  const count = result.rows[0]?.count ?? 0;
  return count > MAX_REQUESTS_PER_WINDOW;
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip") ?? "unknown";
}
