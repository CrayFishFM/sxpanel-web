import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Optimistic, cookie-presence-only check — the real authorization check
// (session validity + admin role) happens server-side in each dashboard
// page and in the admin GET routes. This just avoids a flash of protected UI.
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
  // `:path*` so nested dashboard routes (e.g. /dashboard/reports) are
  // covered too, not just the index.
  matcher: ["/dashboard/:path*", "/sign-in"],
}
