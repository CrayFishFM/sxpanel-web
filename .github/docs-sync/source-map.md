# Docs page → source map

Where the behaviour described on each docs page lives in the sxpanel repo
(paths relative to the sxpanel repo root). A starting point for verification,
not a complete list — follow imports and grep when a claim is not covered
here. Fix this file when a path moves or a page gains a new source.

| Docs page | Source of truth |
| --- | --- |
| `index.mdx`, `features.mdx` | Overview pages. Each claim is owned by a feature below; `docs/README.md`, `panel/src/pages/` (one folder per panel page), `panel/src/layout/` (navigation names and paths), `nui/src/` and `resource/menu/` (in-game menu), `panel/src/pages/InsightsPage/`, `core/routes/insights.ts` |
| `quick-start.mdx` | `docs/README.md`, `fxmanifest.lua`, `core/boot/`, `core/routes/setup/`, `panel/src/pages/SetupPage.tsx` |
| `configuration.mdx` | `core/boot/getHostVars.ts`, `core/boot/getNativeVars.ts` (environment variables and convars), `core/modules/ConfigStore/schema/` (every setting, its default and limits), `panel/src/pages/Settings/` (tab and field names), `core/routes/setup/`, `core/deployer/`, `core/modules/ConfigStore/configMigrations.ts` (txAdmin migration) |
| `permissions.mdx` | `core/modules/AdminStore/` (permission registry, presets), `core/routes/adminManager/`, `panel/src/pages/AdminManager/`, `core/modules/Logger/` (system/action log), `core/routes/authentication/`, `core/lib/totp.ts` |
| `whitelist.mdx` | `core/modules/Whitelist/`, `core/routes/whitelist/`, `panel/src/pages/Whitelist/`, `shared/deferralCard*.ts`, whitelist section of `core/modules/ConfigStore/schema/` |
| `discord.mdx` | `bot/commands/_sxpanel/` (slash commands), `bot/events/`, `core/modules/DiscordBot/`, `shared/discord*.ts`, discord section of `core/modules/ConfigStore/schema/` |
| `events-api.mdx` | `resource/shared.lua`, `resource/sv_main.lua`, `resource/sv_*.lua` (events and exports), emitters in `core/modules/FxScheduler.ts`, `core/modules/FxMonitor/`, `core/routes/player/actions.ts`, `core/routes/history/actions.ts`, `core/routes/fxserver/commands.ts` |
| `addons.mdx` | `core/modules/AddonManager/`, `core/routes/addons.ts`, `panel/src/pages/AddonsManagerPage.tsx`, `panel/src/pages/AddonsPage.tsx` |
| `addon-api.mdx` | `addon-sdk/src/` (the `.d.ts` files are the public SDK surface), `shared/addonTypes.ts`, `shared/deferralAddonTypes.ts`, `addons/addon-starter-template/`, `core/modules/AddonManager/`, `core/lib/addonEvents.ts`, `bot/addonRuntime.js` |
| `troubleshooting.mdx` | Symptom-driven; verify each fix against the feature that owns it above |

Screenshots referenced by the docs live in this repo under `public/docs/`.
