import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

const additionalTrustedOrigins =
  process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  // The baseURL's own origin is trusted automatically; this only needs to
  // list *additional* origins (e.g. a staging preview domain).
  trustedOrigins: additionalTrustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // Admins are provisioned via the seed script or an existing admin's
    // "create user" action (better-auth's admin plugin) — never public sign-up.
    disableSignUp: true,
  },
  // Rate-limit the auth endpoints themselves (separate from the custom
  // Postgres-backed limiter on /api/stats). Explicit + database-backed so it
  // holds across serverless cold starts instead of relying on the
  // production-only in-memory default.
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      // Tighter than the framework default (3/10s) — a handful of admins
      // never need more than this, so failed-login brute-forcing is capped hard.
      "/sign-in/email": { window: 60, max: 5 },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day of activity
    // Deliberately no cookieCache here: this session gates an admin
    // dashboard, so a revoked/banned admin should lose access on their next
    // request rather than up to `cookieCache.maxAge` later.
  },
  advanced: {
    // Vercel (and most PaaS targets) terminate TLS in front of the Node
    // process, so the request Better Auth sees may be plain HTTP even
    // though the public origin is HTTPS — force the Secure cookie flag
    // from the environment rather than inferring it from the request.
    useSecureCookies: process.env.NODE_ENV === "production",
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async ({ userId, ipAddress, userAgent }) => {
          console.log(
            `[auth] session created for admin ${userId} from ${ipAddress ?? "unknown ip"} (${userAgent ?? "unknown agent"})`,
          );
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "admin",
      adminRoles: ["admin"],
    }),
    // Must stay last: lets server actions set cookies automatically.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
