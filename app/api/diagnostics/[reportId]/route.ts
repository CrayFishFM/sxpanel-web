import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { normalizeReportId } from "@/lib/report-id";
import { getReportWithPayload } from "@/lib/reports-queries";

export const runtime = "nodejs";

/**
 * Admin-only retrieval of a stored bundle.
 *
 * The reports contain admin names, full config contents and file listings —
 * the sender redacts secrets, but what's left is still sensitive at rest, so
 * this is gated on a valid admin session exactly like GET /api/stats. There
 * is deliberately no public or id-only access path: the id is short enough
 * to read aloud, which also makes it short enough to guess.
 */
export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/diagnostics/[reportId]">,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { reportId } = await ctx.params;
  const normalized = normalizeReportId(reportId);
  if (!normalized) {
    return NextResponse.json({ message: "Not a valid report id" }, { status: 400 });
  }

  const report = await getReportWithPayload(normalized);
  if (!report) {
    return NextResponse.json(
      { message: "No such report — it may have expired." },
      { status: 404 },
    );
  }

  return NextResponse.json(report);
}
