import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Optimistic, cookie-presence-only check — the real authorization check
// (session validity + admin role) happens server-side in the dashboard
// page and in GET /api/stats. This just avoids a flash of protected UI.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  if (sessionCookie && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/sign-in"],
}
