import { desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { diagnosticReports } from "@/lib/db/reports-schema";

/**
 * A diagnostics bundle contains admin names, full config contents and
 * resource listings. It's support-session material, not an archive — hold it
 * just long enough for a support thread to play out, then drop it.
 */
export const RETENTION_DAYS = 7;

export function reportExpiryFrom(receivedAt: Date): Date {
  return new Date(receivedAt.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Everything except `payload` — the bundle is multi-megabyte, so the list
 * view must never pull it.
 */
const listColumns = {
  reportId: diagnosticReports.reportId,
  schemaVersion: diagnosticReports.schemaVersion,
  txVersion: diagnosticReports.txVersion,
  fxVersion: diagnosticReports.fxVersion,
  provider: diagnosticReports.provider,
  generatedAt: diagnosticReports.generatedAt,
  jsonBytes: diagnosticReports.jsonBytes,
  gzipBytes: diagnosticReports.gzipBytes,
  failedSections: diagnosticReports.failedSections,
  receivedAt: diagnosticReports.receivedAt,
  expiresAt: diagnosticReports.expiresAt,
};

export type ReportSummary = Awaited<ReturnType<typeof listRecentReports>>[number];

export async function listRecentReports(limit = 50) {
  return db
    .select(listColumns)
    .from(diagnosticReports)
    .orderBy(desc(diagnosticReports.receivedAt))
    .limit(limit);
}

export async function getReportSummary(reportId: string) {
  const [row] = await db
    .select(listColumns)
    .from(diagnosticReports)
    .where(eq(diagnosticReports.reportId, reportId))
    .limit(1);
  return row ?? null;
}

/** Includes the full bundle — only for the detail view and the admin API. */
export async function getReportWithPayload(reportId: string) {
  const [row] = await db
    .select()
    .from(diagnosticReports)
    .where(eq(diagnosticReports.reportId, reportId))
    .limit(1);
  return row ?? null;
}

export async function countReports() {
  const [row] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(diagnosticReports);
  return row?.count ?? 0;
}

/**
 * Retention is enforced here rather than by a scheduled job so it can't
 * silently stop running — the receiving endpoint sweeps opportunistically on
 * a fraction of submissions. If report volume ever grows enough that this
 * matters, move it to a cron and drop the call in the route.
 */
export async function deleteExpiredReports() {
  await db.delete(diagnosticReports).where(lt(diagnosticReports.expiresAt, new Date()));
}
