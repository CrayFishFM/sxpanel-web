import * as z from "zod";

const resourceEntrySchema = z.strictObject({
  name: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/),
  status: z.enum(["started", "stopped"]),
});

const serverSchema = z.strictObject({
  os: z.string().max(32),
  name: z.string().max(128).optional(),
  playerSlots: z.number().int().min(0).max(2048),
  currentPlayers: z.number().int().min(0).max(2048),
  projectName: z.string().max(128).optional(),
  gameName: z.enum(["fivem", "redm"]).optional(),
  cfxId: z.string().max(64).optional(),
});

const statsSchema = z.strictObject({
  totalUniquePlayers: z.number().int().min(0).max(1_000_000),
  totalPlayTimeSeconds: z.number().int().min(0).max(100_000_000_000),
});

const inventorySchema = z.strictObject({
  total: z.number().int().min(0).max(10_000),
  started: z.number().int().min(0).max(10_000),
  stopped: z.number().int().min(0).max(10_000),
  labels: z.array(z.string()).max(200).optional(),
  entries: z.array(resourceEntrySchema).max(200).optional(),
});

const featuresSchema = z.strictObject({
  discordBot: z.boolean(),
  banlist: z.boolean(),
  whitelist: z.boolean(),
  menuEnabled: z.boolean(),
});

const moderationSchema = z.strictObject({
  bans: z.number().int().min(0).max(10_000_000),
  warns: z.number().int().min(0).max(10_000_000),
  kicks: z.number().int().min(0).max(10_000_000),
  whitelists: z.number().int().min(0).max(10_000_000),
});

const dashboardSchema = z.strictObject({
  fxsVersion: z.number().int().optional(),
  locale: z.string().max(16).optional(),
  panelUptimeSeconds: z.number().int().optional(),
  panelUrl: z.url().max(512).optional(),
  adminCount: z.number().int().optional(),
  features: featuresSchema.optional(),
  moderation: moderationSchema.optional(),
});

export const statsPayloadSchema = z
  .strictObject({
    installId: z.string().max(64),
    version: z.string().max(32),
    timestamp: z.number().int().min(0),
    server: serverSchema,
    stats: statsSchema,
    inventory: inventorySchema.optional(),
    dashboard: dashboardSchema.optional(),
  })
  .refine((payload) => payload.server.currentPlayers <= payload.server.playerSlots, {
    error: "server.currentPlayers must be <= server.playerSlots",
    path: ["server", "currentPlayers"],
  });

export type StatsPayload = z.infer<typeof statsPayloadSchema>;
