import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { gunzip as gunzipCallback } from "node:zlib";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { diagnosticReports } from "@/lib/db/reports-schema";
import {
  diagnosticsEnvelopeSchema,
  extractReportMetadata,
  mayContainNullBytes,
  stripNullBytes,
} from "@/lib/diagnostics-schema";
import { isDiagnosticsRateLimited, getClientIp } from "@/lib/rate-limit";
import { generateReportId } from "@/lib/report-id";
import { deleteExpiredReports, reportExpiryFrom } from "@/lib/reports-queries";

// zlib and the pg driver both need Node built-ins — this must never be
// bundled for the edge runtime.
export const runtime = "nodejs";

const gunzip = promisify(gunzipCallback);

/**
 * Compressed ceiling. Real bundles are a few MB of gzip; well past that is
 * either abuse or a client bug.
 */
const MAX_COMPRESSED_BYTES = 10 * 1024 * 1024;

/**
 * Decompressed ceiling, and the important one. This endpoint is
 * unauthenticated and gunzips attacker-controlled bytes, so a small upload
 * can otherwise inflate to gigabytes and take the process out. Logs and
 * config dumps compress hard (~15-20x), so a 10MB upload legitimately
 * reaching ~64MB of JSON is plausible; beyond that we refuse rather than
 * allocate.
 */
const MAX_DECOMPRESSED_BYTES = 64 * 1024 * 1024;

/** gzip magic number — see the sniff in `decodeBody`. */
const GZIP_MAGIC = [0x1f, 0x8b];

/** Fraction of submissions that also sweep expired rows. */
const SWEEP_PROBABILITY = 0.05;

export async function POST(request: Request) {
  // Any unhandled throw would otherwise surface as a bare HTML 500, which
  // the sender can only render as a raw status line. Funnelling everything
  // through `fail` keeps the documented `{ message }` shape on every path.
  try {
    return await handleReport(request);
  } catch (error) {
    console.error("[diagnostics] unhandled failure while receiving a report", error);
    return fail("Could not store the report. Try again later.", 500);
  }
}

async function handleReport(request: Request) {
  const ip = getClientIp(request.headers);
  if (await isDiagnosticsRateLimited(ip)) {
    return fail("Too many diagnostics reports from this address. Try again later.", 429);
  }

  // Advisory only — content-length can be absent or a lie, so `readBody`
  // enforces the real cap. Checking it first avoids streaming a body we
  // already know we'll reject.
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_COMPRESSED_BYTES) {
    return fail("Report too large.", 413);
  }

  const body = await readBody(request);
  if (!body) {
    return fail("Report too large.", 413);
  }
  if (body.byteLength === 0) {
    return fail("Empty request body.", 400);
  }

  let json: string;
  try {
    json = await decodeBody(body);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return fail("Report too large once decompressed.", 413);
    }
    return fail("Could not decompress request body — expected gzip.", 400);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return fail("Request body was not valid JSON.", 400);
  }

  const envelope = diagnosticsEnvelopeSchema.safeParse(parsed);
  if (!envelope.success) {
    return fail("Report did not match the expected diagnostics format.", 400);
  }

  // The sender retries once, so the identical bundle can arrive twice.
  // Hashing the decompressed JSON (rather than the gzip bytes, whose header
  // carries a timestamp) makes the second delivery resolve to the first
  // report instead of minting a new id.
  const payloadHash = createHash("sha256").update(json).digest("hex");

  const existing = await db
    .select({ reportId: diagnosticReports.reportId })
    .from(diagnosticReports)
    .where(eq(diagnosticReports.payloadHash, payloadHash))
    .limit(1);

  if (existing[0]) {
    return NextResponse.json({ reportId: existing[0].reportId });
  }

  const metadata = extractReportMetadata(envelope.data);
  const receivedAt = new Date();

  // Log and config dumps can contain U+0000, which Postgres jsonb refuses
  // outright — sanitise before the insert so one stray byte in a log line
  // doesn't reject an otherwise good report. Hashing above deliberately uses
  // the unsanitised text, so it still identifies the submission as sent.
  const payload = mayContainNullBytes(json) ? stripNullBytes(parsed) : parsed;

  const row = {
    payloadHash,
    schemaVersion: metadata.schemaVersion,
    txVersion: metadata.txVersion,
    fxVersion: metadata.fxVersion,
    provider: metadata.provider,
    generatedAt: metadata.generatedAt,
    jsonBytes: metadata.jsonBytes,
    gzipBytes: metadata.gzipBytes,
    failedSections: metadata.failedSections,
    payload,
    submitterIp: ip,
    receivedAt,
    expiresAt: reportExpiryFrom(receivedAt),
  };

  let reportId: string | null = null;

  for (let attempt = 0; attempt < 3 && reportId === null; attempt++) {
    try {
      const inserted = await db
        .insert(diagnosticReports)
        .values({ ...row, reportId: generateReportId() })
        .onConflictDoNothing({ target: diagnosticReports.payloadHash })
        .returning({ reportId: diagnosticReports.reportId });

      if (inserted[0]) {
        reportId = inserted[0].reportId;
        break;
      }
    } catch (error) {
      // `onConflictDoNothing` only arbitrates the payload_hash index, so a
      // report_id collision still raises. Astronomically unlikely at 30^8
      // over a 7-day window, but the next attempt draws a fresh id.
      if (!isUniqueViolation(error)) throw error;
      continue;
    }

    // Insert was a no-op: a concurrent retry of the same bundle won the race
    // between our select above and this insert, so its id is the answer.
    const raced = await db
      .select({ reportId: diagnosticReports.reportId })
      .from(diagnosticReports)
      .where(eq(diagnosticReports.payloadHash, payloadHash))
      .limit(1);

    if (raced[0]) {
      reportId = raced[0].reportId;
    }
  }

  if (reportId === null) {
    return fail("Could not store the report. Try again.", 500);
  }

  if (Math.random() < SWEEP_PROBABILITY) {
    // Retention housekeeping must never fail a submission that already
    // succeeded — the next sweep picks up whatever this one missed.
    await deleteExpiredReports().catch((error) => {
      console.error("[diagnostics] expired-report sweep failed", error);
    });
  }

  // The sender's success check is literally `'reportId' in response`, so a
  // 2xx without this key reads as a failure on the client.
  return NextResponse.json({ reportId });
}

/**
 * The sender's error extraction reads `.message` first, then `.error`, then
 * falls back to raw body text. A clean `message` is what renders in
 * sxPanel's error UI.
 */
function fail(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

class PayloadTooLargeError extends Error {}

/** Postgres unique_violation. */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

/**
 * Streams the body with a hard byte cap, so a request that omits or
 * understates `content-length` still can't make us buffer without bound.
 * Returns null once the cap is passed.
 */
async function readBody(request: Request): Promise<Buffer | null> {
  if (!request.body) return Buffer.alloc(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    total += value.byteLength;
    if (total > MAX_COMPRESSED_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

/**
 * The sender always gzips, but a proxy or platform that honours
 * `content-encoding: gzip` may have already decompressed the body by the
 * time it reaches us — in which case gunzipping again would throw on a
 * perfectly good report. Sniffing the magic bytes handles both deployments.
 */
async function decodeBody(body: Buffer): Promise<string> {
  const isGzip = body[0] === GZIP_MAGIC[0] && body[1] === GZIP_MAGIC[1];
  if (!isGzip) {
    if (body.byteLength > MAX_DECOMPRESSED_BYTES) {
      throw new PayloadTooLargeError();
    }
    return body.toString("utf8");
  }

  try {
    const inflated = await gunzip(body, {
      maxOutputLength: MAX_DECOMPRESSED_BYTES,
    });
    return inflated.toString("utf8");
  } catch (error) {
    // zlib signals the cap with ERR_BUFFER_TOO_LARGE; anything else is a
    // genuinely corrupt stream.
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ERR_BUFFER_TOO_LARGE"
    ) {
      throw new PayloadTooLargeError();
    }
    throw error;
  }
}
