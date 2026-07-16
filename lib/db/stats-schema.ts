import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const installs = pgTable(
  "installs",
  {
    installId: text("install_id").primaryKey(),
    version: text("version").notNull(),
    clientTimestamp: bigint("client_timestamp", { mode: "number" }).notNull(),

    os: text("os").notNull(),
    serverName: text("server_name"),
    playerSlots: integer("player_slots").notNull(),
    currentPlayers: integer("current_players").notNull(),
    projectName: text("project_name"),
    gameName: text("game_name"),
    cfxId: text("cfx_id"),

    totalUniquePlayers: integer("total_unique_players").notNull(),
    totalPlayTimeSeconds: bigint("total_play_time_seconds", {
      mode: "number",
    }).notNull(),

    inventoryTotal: integer("inventory_total"),
    inventoryStarted: integer("inventory_started"),
    inventoryStopped: integer("inventory_stopped"),
    inventoryLabels: jsonb("inventory_labels").$type<string[]>(),
    inventoryEntries:
      jsonb("inventory_entries").$type<{ name: string; status: "started" | "stopped" }[]>(),

    fxsVersion: integer("fxs_version"),
    locale: text("locale"),
    panelUptimeSeconds: integer("panel_uptime_seconds"),
    panelUrl: text("panel_url"),
    adminCount: integer("admin_count"),

    featureDiscordBot: boolean("feature_discord_bot"),
    featureBanlist: boolean("feature_banlist"),
    featureWhitelist: boolean("feature_whitelist"),
    featureMenuEnabled: boolean("feature_menu_enabled"),

    moderationBans: integer("moderation_bans"),
    moderationWarns: integer("moderation_warns"),
    moderationKicks: integer("moderation_kicks"),
    moderationWhitelists: integer("moderation_whitelists"),

    firstSeenAt: timestamp("first_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("installs_last_seen_at_idx").on(table.lastSeenAt)],
);

export const statsRateLimits = pgTable("stats_rate_limits", {
  ip: text("ip").primaryKey(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  count: integer("count").notNull().default(0),
});
