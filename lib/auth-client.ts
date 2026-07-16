import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// NEXT_PUBLIC_BETTER_AUTH_URL is inlined into the client bundle at build time,
// so a localhost/HTTP value baked into the production build would make the live
// site try to reach the visitor's own machine and fail with "Can't reach the
// server". The auth API is always served same-origin at /api/auth, so when the
// configured origin doesn't match the current page we fall back to it.
const configuredBaseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
const pageOrigin = typeof window !== "undefined" ? window.location.origin : undefined;

let baseURL: string | undefined;
if (configuredBaseURL && pageOrigin) {
  try {
    baseURL =
      new URL(configuredBaseURL).origin === pageOrigin ? configuredBaseURL : pageOrigin;
  } catch {
    baseURL = pageOrigin;
  }
} else {
  baseURL = configuredBaseURL || undefined;
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
});

export const { signIn, signOut, useSession } = authClient;
