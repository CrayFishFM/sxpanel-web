// Captures the docs screenshots in public/docs/ from a locally running sxPanel:
// the web panel (dev build, demo data, every IP address replaced before it
// renders) and the in-game menu (its browser mode, demo data only).
//
// Usage:  node scripts/screenshots.mjs [name | panel | menu ...]
//   - No arguments captures everything; `panel` or `menu` captures one app;
//     shot names capture only those, e.g. `node scripts/screenshots.mjs players menu-main`.
//   - Panel shots need the panel dev build running (default
//     http://localhost:40120; override with PANEL_URL). Demo data only exists
//     in a dev build. The first time, log in in the Chrome window this opens;
//     the session is kept in a dedicated profile for later runs.
//   - Menu shots need the in-game menu's browser mode: `npm run browser` in the
//     sxpanel repo's nui/ folder (default http://localhost:40121/nui/;
//     override with MENU_URL).
//
// Privacy: IPv4/IPv6 addresses, Cfx.re join codes and license keys are
// rewritten in every response the panel receives (fetch, XHR polling,
// WebSocket) before the page draws it, so they never reach the DOM or the
// console canvas. A shot is refused if anything that looks like one is still
// visible. Check the images anyway before committing them.

import { spawn } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { hostname, tmpdir, userInfo } from "node:os"
import { join } from "node:path"

const PANEL_URL = (process.env.PANEL_URL ?? "http://localhost:40120").replace(/\/$/, "")
const OUT_DIR = "public/docs"
const PORT = 9333
// Captured at the display's own pixel ratio: emulating a different one makes
// the live console canvas draw its text at the wrong size. On a normal 1x
// display the images are 1440x900, twice the width the docs show them at.
const VIEWPORT = { width: 1440, height: 900 }
const PROFILE = join(process.env.LOCALAPPDATA ?? tmpdir(), "sxpanel-docs-screenshots")

// name -> panel route. `wait` is extra settle time in ms, `prepare` runs in the
// page before the capture.
const SHOTS = [
  { name: "overview", route: "/" },
  { name: "players", route: "/players" },
  { name: "whitelist", route: "/whitelist" },
  { name: "history", route: "/history" },
  { name: "reports", route: "/reports" },
  // Opening /reports/analytics directly hits a server route; switch to it
  // inside the app instead, the way its own links do.
  {
    name: "report-analytics",
    route: "/reports",
    prepare: `history.pushState({}, "", "/reports/analytics?devMockStatus=1"); dispatchEvent(new PopStateEvent("popstate"))`,
    prepareWait: 3500,
  },
  { name: "live-console", route: "/server/console", wait: 5000 },
  { name: "resources", route: "/server/resources" },
  { name: "chat-commands", route: "/server/commands" },
  { name: "server-log", route: "/server/server-log" },
  { name: "admins", route: "/admins" },
  { name: "insights", route: "/insights", wait: 5000 },
  { name: "player-drops", route: "/server/player-drops", wait: 5000 },
  { name: "addon-manager", route: "/addons" },
  { name: "action-log", route: "/system/action-log" },
  { name: "diagnostics", route: "/system/diagnostics" },
  { name: "artifacts", route: "/system/artifacts" },
  { name: "panel-update", route: "/system/panel-update" },
  { name: "settings", route: "/settings" },
]

// ---------------------------------------------------------------------------
// In-game menu (NUI). Its browser mode has no game behind it, so every shot
// starts from a fresh page, gets a dark backdrop, and is fed the same messages
// the game would send (server context, player list, stats, tickets).
// ---------------------------------------------------------------------------

const MENU_URL = process.env.MENU_URL ?? "http://localhost:40121/nui/"

const DEMO_NAMES = [
  "SilverNomad101", "TurboComet102", "MangoFalcon103", "DustyWarden104", "EchoScout105",
  "LuckyPilot106", "RogueViking107", "PixelCipher108", "NovaFox109", "CrimsonDrift110",
  "KiloRider111", "NeonBandit112", "SilverNomad113", "TurboComet114", "MangoFalcon115",
  "DustyWarden116", "EchoScout117", "LuckyPilot118", "RogueViking119", "PixelCipher120",
]
const VEHICLES = ["walking", "driving", "flying", "boating", "biking", "driving", "walking", "unknown"]
const DEMO_PLAYERS = DEMO_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  admin: i % 7 === 3,
  tags: i % 7 === 3 ? ["staff"] : i % 9 === 5 ? ["newcomer"] : [],
  vType: VEHICLES[i % VEHICLES.length],
  dist: [35, 120, 480, 950, 1600, 2400, 3100, 4200][i % 8] + i * 7,
  health: [100, 86, 64, 100, 42, 91, 100, 18][i % 8],
}))
const NOW = Math.floor(Date.now() / 1000)
const DEMO_TICKETS = [
  {
    id: "TKT-1042", category: "Player Report", priority: "high", status: "open",
    reporterName: "EchoScout105", targetNames: ["NeonBandit112"],
    descriptionPreview: "Rammed my car three times at the Legion Square lights, then drove off.",
    messageCount: 2, unreadCount: 1, tsCreated: NOW - 900, tsLastActivity: NOW - 300, claimedBy: null,
  },
  {
    id: "TKT-1039", category: "Bug Report", priority: "medium", status: "inReview",
    reporterName: "MangoFalcon103", targetNames: [],
    descriptionPreview: "Garage menu doesn't open after a server restart.",
    messageCount: 4, unreadCount: 0, tsCreated: NOW - 5400, tsLastActivity: NOW - 1200, claimedBy: "Moderator",
  },
  {
    id: "TKT-1031", category: "Question", status: "open",
    reporterName: "NovaFox109", targetNames: [],
    descriptionPreview: "How do I apply for the police job?",
    messageCount: 1, unreadCount: 0, tsCreated: NOW - 14400, tsLastActivity: NOW - 14400, claimedBy: null,
  },
]
const DEMO_TICKET_DETAIL = {
  id: "TKT-1042", category: "Player Report", priority: "high", status: "open",
  reporter: { license: "license:00000000000000000000000000000005", name: "EchoScout105", netid: 5 },
  targets: [{ license: "license:00000000000000000000000000000012", name: "NeonBandit112", netid: 12 }],
  description: "Rammed my car three times at the Legion Square lights, then drove off. Nearby players saw it.",
  messages: [
    { author: "EchoScout105", authorType: "player", content: "He's still driving around downtown.", ts: NOW - 600 },
    { author: "Moderator", authorType: "admin", content: "Thanks, on my way. Stay where you are.", ts: NOW - 300 },
  ],
  tsCreated: NOW - 900, claimedBy: null,
}

// Runs first on every menu shot.
const MENU_PRELUDE = `(() => {
  window.__send = (action, data) => dispatchEvent(new MessageEvent("message", { data: { action, data } }));
  document.body.style.background = "radial-gradient(ellipse at 30% 20%, #1d2333 0%, #0b0d12 70%)";
  for (const el of document.querySelectorAll("div"))
    if (getComputedStyle(el).position === "fixed" && /^\\s*Browser Dev/i.test(el.textContent)) el.style.display = "none";
  for (const el of document.querySelectorAll("#notistack-snackbar, [class*=notistack]"))
    if (/Menu enabled/i.test(el.textContent)) el.style.display = "none";
  __send("setServerCtx", {
    locale: "en", localeData: false, oneSync: { type: "onesync", status: true },
    announceNotiPos: "top-center", projectName: "sxPanel Demo", maxClients: 128,
    switchPageKey: "Tab", sxPanelVersion: "0.8.0-Beta", alignRight: false,
    tagDefinitions: [], reportsEnabled: true,
  });
  __send("setPlayerList", ${JSON.stringify(DEMO_PLAYERS)});
})()`

const openMenu = (page) => `__send("setMenuPage", ${page}); __send("setVisible", true)`
const closeMenu = `__send("setVisible", false)`
// Page numbers from nui/src/state/page.state.ts
const PAGE = { Main: 0, Players: 1, Stats: 2, Reports: 3, Resources: 5 }

// `js` sets up the screen; `clip` is "auto" (crop to what is drawn), false
// (whole viewport) or a rectangle.
const MENU_SHOTS = [
  { name: "menu-main", js: openMenu(PAGE.Main) },
  { name: "menu-players", js: openMenu(PAGE.Players) },
  {
    name: "menu-stats",
    js: `${openMenu(PAGE.Stats)}; setTimeout(() => __send("setStats", { playerCount: 87, resourceCount: 25, uptimeSeconds: 198000 }), 800)`,
  },
  { name: "menu-resources", js: openMenu(PAGE.Resources) },
  {
    name: "menu-reports",
    js: `${openMenu(PAGE.Reports)};
      setTimeout(() => __send("ticketAdminListData", { tickets: ${JSON.stringify(DEMO_TICKETS)} }), 800);
      setTimeout(() => [...document.querySelectorAll("div, li, button")].reverse().find((el) => el.textContent.includes("TKT-1042") || el.textContent.includes("Rammed my car"))?.click(), 1800);
      setTimeout(() => __send("ticketAdminDetailData", { ticket: ${JSON.stringify(DEMO_TICKET_DETAIL)} }), 2600)`,
    wait: 3800,
  },
  { name: "menu-player-modal", js: `${openMenu(PAGE.Main)}; menuDebug.openPlayerModalDemo()` },
  // The screens below are not part of the menu; the menu starts open in
  // browser mode, so close it first.
  { name: "menu-report-create", js: `${closeMenu}; menuDebug.openReportCreate()` },
  { name: "menu-report-list", js: `${closeMenu}; menuDebug.openReportList()` },
  {
    name: "menu-warning",
    js: `${closeMenu}; __send("setWarnOpen", { reason: "Breaking rule 3: no random deathmatch. Read the server rules before you play again.", warnedBy: "Moderator", isWarningNew: true })`,
    clip: false,
  },
  {
    name: "menu-staff-hud",
    js: `${closeMenu}; menuDebug.showStaffHud()`,
    clip: { x: 1060, y: 0, width: 380, height: 300 },
  },
  {
    name: "menu-announcement",
    js: `${closeMenu}; menuDebug.announceMsg({ message: "Server restart in 10 minutes. Finish what you are doing and park your vehicles.", author: "Moderator" })`,
  },
]

// Smallest rectangle around everything drawn on the page, plus padding.
const AUTO_CLIP = `(() => {
  const vw = innerWidth, vh = innerHeight, pad = 32;
  let x1 = vw, y1 = vh, x2 = 0, y2 = 0;
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) continue;
    if (r.width >= vw * 0.95 && r.height >= vh * 0.95) continue;
    // Also skips elements inside a faded-out or hidden parent (the closed menu).
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    const cs = getComputedStyle(el);
    const painted = !/rgba\\(0, 0, 0, 0\\)|transparent/.test(cs.backgroundColor) || cs.backgroundImage !== "none" ||
      cs.boxShadow !== "none" || (cs.borderStyle !== "none" && parseFloat(cs.borderWidth) > 0);
    if (!painted) continue;
    x1 = Math.min(x1, r.left); y1 = Math.min(y1, r.top); x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
  }
  if (x2 <= x1) return null;
  x1 = Math.max(0, x1 - pad); y1 = Math.max(0, y1 - pad);
  x2 = Math.min(vw, x2 + pad); y2 = Math.min(vh, y2 + pad);
  return { x: Math.floor(x1), y: Math.floor(y1), width: Math.ceil(x2 - x1), height: Math.ceil(y2 - y1) };
})()`

// Runs in the page before any panel script.
// Whole words to replace in everything the panel shows: this machine's user
// and computer name (they appear in paths and on Diagnostics), plus any names
// listed in scripts/screenshots.local.json (git-ignored), e.g.
//   { "replace": { "RealAdminName": "Moderator" } }
const LOCAL_CONFIG = "scripts/screenshots.local.json"
const NAMES = { [userInfo().username]: "admin", [hostname()]: "sxpanel-host" }
if (existsSync(LOCAL_CONFIG)) Object.assign(NAMES, JSON.parse(readFileSync(LOCAL_CONFIG, "utf8")).replace ?? {})

const SCRUB = `(() => {
  const NAMES = ${JSON.stringify(Object.entries(NAMES).filter(([from]) => from.length > 1))}.map(([from, to]) => [
    new RegExp("(?<![A-Za-z0-9_])" + from.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&") + "(?![A-Za-z0-9_])", "g"),
    to,
  ]);
  const IPV4 = /\\b(?!127\\.0\\.0\\.1\\b)(?!0\\.0\\.0\\.0\\b)(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}\\b/g;
  const IPV6 = /\\b(?:[0-9a-f]{1,4}:){4,7}[0-9a-f]{1,4}\\b/gi;
  const OTHER = [
    [/cfxk_[A-Za-z0-9_]+/g, "cfxk_xxxxxxxxxxxxxxxxxxxx"],
    [/(cfx\\.re\\/join\\/)[a-z0-9]+/gi, "$1abc123"],
    [/(sv_licenseKey\\s+"?)[^\\s"]+/gi, "$1cfxk_xxxxxxxxxxxxxxxxxxxx"],
  ];
  // Console lines that are only noise on a dev server nobody can reach
  // (in the socket payload each line starts with {§id} and ends with an
  // escaped newline).
  const NOISE = /\\{§[0-9a-f]+\\}(?:(?!\\{§)[\\s\\S])*?(?:Server list query returned an error|thread hitch warning)(?:(?!\\{§)[\\s\\S])*?\\\\n/g;
  const scrub = (s) => {
    if (typeof s !== "string" || s.length === 0) return s;
    let out = s.replace(NOISE, "").replace(IPV4, "203.0.113.10").replace(IPV6, "2001:db8::10");
    for (const [re, sub] of OTHER) out = out.replace(re, sub);
    for (const [re, sub] of NAMES) out = out.replace(re, sub);
    return out;
  };
  window.__docsScrub = scrub;
  window.__docsLeaks = (text) => [IPV4, IPV6, /cfxk_(?!x{20})[A-Za-z0-9_]+/g]
    .flatMap((re) => text.match(new RegExp(re.source, re.flags)) ?? [])
    .filter((m) => m !== "203.0.113.10" && m !== "2001:db8::10");
  const wrapGetter = (proto, prop) => {
    const d = Object.getOwnPropertyDescriptor(proto, prop);
    if (!d || !d.get) return;
    Object.defineProperty(proto, prop, { ...d, get() { const v = d.get.call(this); return typeof v === "string" ? scrub(v) : v; } });
  };
  wrapGetter(XMLHttpRequest.prototype, "responseText");
  wrapGetter(XMLHttpRequest.prototype, "response");
  wrapGetter(MessageEvent.prototype, "data");
  const text = Response.prototype.text;
  Response.prototype.text = async function () { return scrub(await text.call(this)); };
  Response.prototype.json = async function () { return JSON.parse(scrub(await text.call(this))); };
  try { localStorage.setItem("sxpanel.devMockStatus", "1"); } catch {}
  // Update notices and the addon-approval warning sit on top of every page.
  document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = ".top-navbarvh.fixed.z-40 { display: none !important; }";
    document.head.appendChild(style);
  });
})();`

// A syntax error here would silently disable every privacy rewrite in the page.
try {
  new Function(SCRUB)
} catch (error) {
  console.error(`The in-page privacy script does not parse: ${error.message}`)
  process.exit(1)
}

// Run in the page before every capture: the rewrite must be installed and work.
const SCRUB_CHECK = `typeof window.__docsScrub === "function" &&
  window.__docsScrub("at 198.51.100.7:30120") === "at 203.0.113.10:30120" &&
  new Response("1.2.3.4").text().then((t) => t === "203.0.113.10")`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ]
  const found = candidates.find((path) => path && existsSync(path))
  if (!found) throw new Error("Chrome not found; set CHROME_PATH")
  return found
}

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = targets.find((t) => t.type === "page")
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await sleep(200)
  }
  throw new Error("Chrome did not open its debugging port")
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url)
    this.nextId = 1
    this.pending = new Map()
    this.waiters = []
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data)
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id)
        this.pending.delete(msg.id)
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
      } else if (msg.method) {
        this.waiters = this.waiters.filter((w) => (w.method === msg.method ? (w.resolve(msg.params), false) : true))
      }
    })
  }
  open() {
    return new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true })
      this.ws.addEventListener("error", reject, { once: true })
    })
  }
  send(method, params = {}) {
    const id = this.nextId++
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }))
  }
  once(method, timeout = 20000) {
    return Promise.race([
      new Promise((resolve) => this.waiters.push({ method, resolve })),
      sleep(timeout),
    ])
  }
  async eval(expression) {
    const { result } = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })
    return result.value
  }
  async goto(url) {
    const loaded = this.once("Page.loadEventFired")
    await this.send("Page.navigate", { url })
    await loaded
  }
}

const wanted = process.argv.slice(2)
const all = !wanted.length
const pick = (list, group) => list.filter((s) => all || wanted.includes(group) || wanted.includes(s.name))
const shots = pick(SHOTS, "panel")
const menuShots = pick(MENU_SHOTS, "menu")
const known = new Set(["panel", "menu", ...SHOTS.map((s) => s.name), ...MENU_SHOTS.map((s) => s.name)])
const unknown = wanted.filter((w) => !known.has(w))
if (unknown.length) {
  console.error(`Unknown shot name: ${unknown.join(", ")}. Known: ${[...known].join(", ")}`)
  process.exit(1)
}

async function reachable(url) {
  try {
    await fetch(url, { signal: AbortSignal.timeout(3000) })
    return true
  } catch {
    return false
  }
}
if (shots.length && !(await reachable(PANEL_URL))) {
  console.error(`The panel is not running at ${PANEL_URL}. Start the sxPanel dev build, or pass \`menu\` to capture only the in-game menu.`)
  process.exit(1)
}
if (menuShots.length && !(await reachable(MENU_URL))) {
  console.error(`The in-game menu is not running at ${MENU_URL}. Run \`npm run browser\` in the sxpanel repo's nui/ folder, or pass \`panel\` to capture only the panel.`)
  process.exit(1)
}

const chrome = spawn(
  findChrome(),
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1500,1050",
    "about:blank",
  ],
  { stdio: "ignore" },
)

const cdp = new Cdp(await connect())
await cdp.open()
await cdp.send("Page.enable")
await cdp.send("Runtime.enable")
await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: SCRUB })
await cdp.send("Emulation.setDeviceMetricsOverride", { ...VIEWPORT, deviceScaleFactor: 0, mobile: false })

mkdirSync(OUT_DIR, { recursive: true })

if (shots.length) {
  await cdp.goto(`${PANEL_URL}/?devMockStatus=1`)
  await sleep(2500)
  const loggedIn = () =>
    cdp.eval(`!/login|auth/i.test(location.pathname) && !document.querySelector('input[type="password"]') && !!document.querySelector("nav")`)
  if (!(await loggedIn())) {
    console.log("Log in to the panel in the Chrome window that just opened. Waiting...")
    while (!(await loggedIn())) await sleep(2000)
    await sleep(3000)
  }
}

const failed = []
for (const shot of shots) {
  await cdp.goto(`${PANEL_URL}${shot.route}?devMockStatus=1`)
  await sleep(shot.wait ?? 3500)
  if (shot.prepare) {
    await cdp.eval(shot.prepare)
    await sleep(shot.prepareWait ?? 1500)
  }
  if ((await cdp.eval(SCRUB_CHECK)) !== true) {
    console.error(`✗ ${shot.name}: the privacy rewrite is not active in the page. Stopping; nothing more is captured.`)
    cdp.ws.close()
    chrome.kill()
    process.exit(1)
  }
  // Log pages scroll the window to their newest entry; show the top instead.
  // They scroll an inner panel, so reset every scrolled element except the
  // console's own scrollback.
  await cdp.eval(`window.scrollTo(0, 0)
  for (const el of document.querySelectorAll("*"))
    if (el.scrollTop > 0 && !el.closest(".xterm")) el.scrollTop = 0`)
  await sleep(500)
  // Backup for the banner CSS: hide any pinned bar showing an update or addon notice.
  await cdp.eval(`for (const el of document.querySelectorAll("div")) {
    const pos = getComputedStyle(el).position
    if ((pos === "fixed" || pos === "sticky") && el.offsetHeight < 200 &&
        /update is available|is outdated|Addons need attention|connection lost/i.test(el.textContent)) el.style.display = "none"
  }
  for (const el of document.querySelectorAll("button")) if (/^\\s*Dev:/.test(el.textContent)) el.style.display = "none"`)
  const leaks = await cdp.eval(
    `window.__docsLeaks(document.body.innerText + " " + [...document.querySelectorAll("input,textarea")].map((e) => e.value).join(" "))`,
  )
  if (leaks?.length) {
    console.error(`✗ ${shot.name}: still shows ${[...new Set(leaks)].join(", ")} — not saved`)
    failed.push(shot.name)
    continue
  }
  const { data } = await cdp.send("Page.captureScreenshot", { format: "webp", quality: 90 })
  const file = join(OUT_DIR, `${shot.name}.webp`)
  writeFileSync(file, Buffer.from(data, "base64"))
  console.log(`✓ ${file}`)
}

for (const shot of menuShots) {
  await cdp.goto(MENU_URL)
  await sleep(3000)
  if ((await cdp.eval(`typeof window.menuDebug`)) !== "object") {
    console.error(`✗ ${shot.name}: ${MENU_URL} is not the in-game menu's browser mode (window.menuDebug is missing).`)
    failed.push(shot.name)
    continue
  }
  await cdp.eval(MENU_PRELUDE)
  await sleep(800)
  await cdp.eval(shot.js)
  await sleep(shot.wait ?? 2500)
  // The "menu enabled" toast can appear after the prelude ran.
  await cdp.eval(`for (const el of document.querySelectorAll("#notistack-snackbar, [class*=notistack]"))
    if (/Menu enabled/i.test(el.textContent)) el.style.display = "none"`)
  const clip = shot.clip === false ? null : shot.clip && shot.clip !== "auto" ? shot.clip : await cdp.eval(AUTO_CLIP)
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "webp",
    quality: 90,
    ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
  })
  const file = join(OUT_DIR, `${shot.name}.webp`)
  writeFileSync(file, Buffer.from(data, "base64"))
  console.log(`✓ ${file}`)
}

cdp.ws.close()
chrome.kill()
if (failed.length) process.exit(1)
