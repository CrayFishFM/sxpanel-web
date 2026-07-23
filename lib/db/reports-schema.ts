import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * Diagnostics bundles posted by sxPanel clients to POST /api/diagnostics.
 *
 * The bundle itself lives verbatim in `payload` — the sender ships
 * best-effort partial reports and every section is optional, so we don't
 * shred it into columns. Only the handful of fields the dashboard lists on
 * are extracted, and all of them are nullable by design.
 *
 * Contents are sensitive (admin names, full config dumps, resource
 * listings). Access is gated on an admin session and rows self-expire — see
 * `expiresAt` and `deleteExpiredReports()`.
 */
export const diagnosticReports = pgTable(
  "diagnostic_reports",
  {
    // Short, unambiguous, human-readable — the end user reads this out loud
    // into a support channel. See lib/report-id.ts.
    reportId: text("report_id").primaryKey(),

    // sha256 of the decompressed JSON. The sender retries once on failure,
    // so an identical bundle can arrive twice; the second one resolves to
    // the first report's id instead of creating a duplicate.
    payloadHash: text("payload_hash").notNull(),

    schemaVersion: integer("schema_version"),
    txVersion: text("tx_version"),
    fxVersion: text("fx_version"),
    provider: text("provider"),

    // From reportMeta.generatedAt — client clock, so it can disagree with
    // receivedAt. Kept for correlating against the client's own logs.
    generatedAt: timestamp("generated_at", { withTimezone: true }),

    jsonBytes: integer("json_bytes"),
    gzipBytes: integer("gzip_bytes"),

    // Names of the `diagnostics.*` sections that came back as
    // `{ error: "..." }` — surfaced in the list so a half-collected report
    // is obvious before you open it.
    failedSections: jsonb("failed_sections").$type<string[]>(),

    payload: jsonb("payload").notNull(),

    submitterIp: text("submitter_ip"),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("diagnostic_reports_payload_hash_idx").on(table.payloadHash),
    index("diagnostic_reports_received_at_idx").on(table.receivedAt),
    index("diagnostic_reports_expires_at_idx").on(table.expiresAt),
  ]
)

/**
 * Separate from `stats_rate_limits` on purpose: a diagnostics bundle is
 * orders of magnitude more expensive to accept than a stats ping, so the two
 * endpoints get independent counters and independent limits.
 */
export const diagnosticsRateLimits = pgTable("diagnostics_rate_limits", {
  ip: text("ip").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull().default(0),
})
