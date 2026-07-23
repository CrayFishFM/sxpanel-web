import * as z from "zod"

/**
 * Envelope-only validation, deliberately loose.
 *
 * Unlike the stats payload — which is a fixed, fully-specified shape and so
 * gets `z.strictObject` — a diagnostics bundle is best-effort and partial by
 * design: any `diagnostics.*` section may be missing or replaced with
 * `{ error: "..." }`, and the client is free to add sections in a later
 * `$schemaVersion`. Rejecting on an unrecognised key would throw away
 * exactly the reports we most want (the ones from a broken server).
 *
 * So we check only that the thing is an object and that the metadata we
 * index on has the right type when present. Everything else is stored
 * verbatim as jsonb.
 */
export const diagnosticsEnvelopeSchema = z.looseObject({
  $schemaVersion: z.number().int().optional(),
  $txVersion: z.string().max(128).optional(),
  $fxVersion: z.string().max(256).optional(),
  $provider: z.string().max(128).optional(),

  reportMeta: z
    .looseObject({
      // Client clock; format isn't pinned by the sender contract, so accept
      // both epoch millis and an ISO string.
      generatedAt: z.union([z.number(), z.string()]).optional(),
      payload: z
        .looseObject({
          contentEncoding: z.string().max(32).optional(),
          schemaVersion: z.number().int().optional(),
          jsonBytes: z.number().int().min(0).optional(),
          gzipBytes: z.number().int().min(0).optional(),
        })
        .optional(),
    })
    .optional(),

  diagnostics: z.looseObject({}).optional(),
})

export type DiagnosticsEnvelope = z.infer<typeof diagnosticsEnvelopeSchema>

/**
 * The columns we denormalise out of the bundle for the dashboard list.
 * Every one is optional — a report that carries none of them is still valid
 * and still gets stored.
 */
export interface ReportMetadata {
  schemaVersion: number | null
  txVersion: string | null
  fxVersion: string | null
  provider: string | null
  generatedAt: Date | null
  jsonBytes: number | null
  gzipBytes: number | null
  failedSections: string[]
}

export function extractReportMetadata(
  envelope: DiagnosticsEnvelope
): ReportMetadata {
  return {
    schemaVersion: envelope.$schemaVersion ?? null,
    txVersion: envelope.$txVersion ?? null,
    fxVersion: envelope.$fxVersion ?? null,
    provider: envelope.$provider ?? null,
    generatedAt: toDate(envelope.reportMeta?.generatedAt),
    jsonBytes: envelope.reportMeta?.payload?.jsonBytes ?? null,
    gzipBytes: envelope.reportMeta?.payload?.gzipBytes ?? null,
    failedSections: collectFailedSections(envelope.diagnostics),
  }
}

function toDate(value: number | string | undefined): Date | null {
  if (value === undefined) return null
  const date = new Date(value)
  // A client with a badly wrong clock shouldn't fail the whole submission —
  // an unparseable timestamp just isn't recorded.
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * A collector that threw ships as `{ error: "Failed to collect ..." }` in
 * place of the section, so the section keys carrying an `error` string are
 * the ones that failed.
 */
function collectFailedSections(diagnostics: unknown): string[] {
  if (!isRecord(diagnostics)) return []

  return Object.entries(diagnostics)
    .filter(([, section]) => isRecord(section) && typeof section.error === "string")
    .map(([name]) => name)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Postgres `jsonb` (and `text`) cannot store U+0000, and rejects the whole
 * insert with "unsupported Unicode escape sequence" if it sees one.
 *
 * Bundles carry raw log dumps and full config-file contents, so a stray null
 * byte is entirely plausible: the sender's JSON.stringify encodes it as the
 * valid escape `\u0000`, JSON.parse turns it back into a real U+0000, and
 * the insert then blows up on a report that is otherwise perfectly good.
 * Dropping the character is lossless for every diagnostic purpose.
 *
 * Rebuilding the tree isn't free, so callers should gate this on
 * `mayContainNullBytes()` — the common case pays only a substring scan.
 */
export function stripNullBytes(value: unknown): unknown {
  if (typeof value === "string") {
    return value.includes("\u0000") ? value.replaceAll("\u0000", "") : value
  }

  if (Array.isArray(value)) {
    return value.map(stripNullBytes)
  }

  if (isRecord(value)) {
    const cleaned: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) {
      // Keys can carry them too (e.g. an env var name read from a corrupt file).
      cleaned[key.replaceAll("\u0000", "")] = stripNullBytes(entry)
    }
    return cleaned
  }

  return value
}

/**
 * Cheap pre-check against the undecoded JSON text. A literal backslash-u0000
 * in the data also matches, which only costs an unnecessary walk — the
 * sanitiser itself is what decides, and it only removes real null bytes.
 */
export function mayContainNullBytes(json: string): boolean {
  return json.includes("\\u0000")
}
