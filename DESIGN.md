---
name: sxPanel
description: The control room for your FiveM & RedM server — a dark-only, cfx-blue-accented brand system that mirrors the actual panel app's design language.
colors:
  cfx-blue: "#3c83f6"
  cfx-blue-deep: "#2f68c4"
  cfx-blue-glow: "#1c3a63"
  paper-white: "#fafafa"
  void-black: "#0e0e10"
  panel-charcoal: "#161618"
  overlay-charcoal: "#18181b"
  steel-gray: "#252528"
  ash-gray: "#202022"
  ash-text: "#a1a1aa"
  hairline-gray: "#27272a"
  input-gray: "#2c2c30"
  alert-red: "#e33131"
  alert-red-hint: "#391313"
  amber: "#ffae00"
  amber-ink: "#291c00"
  emerald: "#01a26f"
  emerald-hint: "#093426"
  cyan: "#26b2d9"
  cyan-hint: "#122a36"
typography:
  display:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem → 3rem (sm) → 3.75rem (md)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem → 2.25rem (sm)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  title:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem (0.875rem in compact cards)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.022em"
  body:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem – 1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  mono:
    fontFamily: "var(--font-mono), ui-monospace, monospace"
    fontSize: "0.6875rem – 0.75rem"
    fontWeight: 400
    lineHeight: 1.4 – 1.6
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  3xl: "1.25rem"
  4xl: "9999px"
spacing:
  card-sm: "1rem"
  card-default: "1.5rem"
  section-y: "5rem"
  section-y-lg: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.void-black}"
    rounded: "{rounded.md}"
    padding: "0 0.625rem"
    height: "2.5rem"
  button-primary-hover:
    opacity: 0.75
  button-secondary:
    backgroundColor: "{colors.steel-gray}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "0 0.625rem"
  badge-brand:
    backgroundColor: "{colors.cfx-blue}"
    textColor: "{colors.cfx-blue}"
    rounded: "{rounded.4xl}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  card:
    backgroundColor: "{colors.panel-charcoal}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
---

# Design System: sxPanel

## 1. Overview

**Creative North Star: "The Control Room"**

sxPanel's marketing site is styled like the app it's selling — because it now shares the actual panel's palette, not an approximation of it. Dark-only, near-black charcoal surfaces, one committed accent (cfx-blue) reserved strictly for wayfinding — navigation, focus rings, links, icon tints, small chips — and Paper White as the real primary-action color, exactly as it works in the panel's own UI. Nothing about the palette or type system asks to be noticed for its own sake; it earns trust the way a well-built dashboard does, by being legible, precise, and quiet everywhere the content isn't the point.

This system explicitly rejects the generic SaaS-template look: no light-mode toggle bolted onto a dark brand, no decorative glassmorphism, no eyebrow labels stacked above every section, no hero-metric-card cliché, no RGB/multi-hue "gamer" gradients. Where the page needs proof of capability, it shows a realistic panel mockup or a real Discord embed replica, not an icon grid standing in for a screenshot. A marketing page is allowed more expressive liberties than the app itself (bigger hero type, a single soft brand-color glow, more present motion) — but the palette, the single sans family, and the "blue never fills a primary button" rule travel unchanged from the app.

**Key Characteristics:**
- Dark-only — no light theme exists, matching the app exactly. There is no theme toggle.
- cfx-blue is wayfinding, not action — used for nav/focus/links/chips, never as a button fill
- Paper White on Void Black is the actual primary-action color — this is the signature move that separates this from a generic blue-CTA SaaS site
- One sans family (Geist) for everything; JetBrains Mono reserved for anything that reads as data or code
- Shadows are near-invisible; depth comes from stepping through the charcoal scale, not shadow weight
- Motion is a 700ms fade-and-rise on scroll entry, respecting `prefers-reduced-motion`

## 2. Colors

A near-black charcoal scale with one committed accent and a small semantic set for status. Every semantic color has a near-black `-hint`/`-deep` tonal variant for backgrounds behind badges, icons, and gradients — the raw saturated color is never used as a large fill.

### Primary
- **cfx-blue** (`#3c83f6`): The wayfinding signal. Active nav underline, focus rings, links, icon-chip accents, small badge/chip fills. Never a primary button's background — that's Paper White's job. Reserved — it does not color large surfaces.
- **cfx-blue-glow** (`#1c3a63`) / a low-alpha blue mix (`oklch(0.4 0.09 264 / 0.35)`, `--brand-muted`): The single soft radial glow behind the hero and CTA sections. The only place blue is allowed to spread across a large area, and only as one restrained glow — never stacked, never multi-hue.
- **cfx-blue-deep** (`#2f68c4`): A manually darkened tone of cfx-blue, used only where a CSS gradient/shadow needs a second literal stop (e.g. the OG image's logo tile, which is rendered by Satori and can't use CSS custom properties or color-mix).

### Neutral (dark-only — no light-mode counterparts)
- **Void Black** (`#0e0e10`): Page background.
- **Paper White** (`#fafafa`): Primary text color, and the primary-button/badge-emphasis fill (Void Black text on top). Near-white, not the accent blue.
- **Panel Charcoal** (`#161618`): Card backgrounds — one step above the page.
- **Overlay Charcoal** (`#18181b`): Popovers, dropdowns, tooltips — one step above cards.
- **Steel Gray** (`#252528`): Secondary-button fill, elevated chips.
- **Ash Gray** (`#202022`): Muted backgrounds — tab lists, skeletons, quiet section fills.
- **Ash Text** (`#a1a1aa`): Secondary/muted text. Contrast floor — don't drop body/muted text lighter than this.
- **Hairline Gray** (`#27272a`): Default border/divider color, always at 1px.
- **Input Gray** (`#2c2c30`): Input borders.

### Semantic
- **Alert Red** (`#e33131`, hint `#391313`): Destructive actions and error states only.
- **Amber** (`#ffae00`, ink `#291c00`): Warning states only; not used decoratively.
- **Emerald** (`#01a26f`, hint `#093426`): Success states, "done" checkmarks, the live "Online" status dot.
- **Cyan** (`#26b2d9`, hint `#122a36`): Informational badges/callouts, distinct from both cfx-blue and emerald.

### Chart Palette
The five categorical chart colors reuse the semantic set directly — cfx-blue, cyan, amber, alert-red, emerald — rather than a separate palette, so analytics visuals (player timelines, retention curves, peak-hour heatmaps) read as an extension of the same system instead of a distinct "charts" brand.

### Named Rules
**The Wayfinding Blue Rule.** cfx-blue marks the thing that helps you navigate or points at "this is interactive" — nav, focus, links, small chips — never the thing you press to take the primary action, and never a large surface. If blue is filling a button's whole background or covering more than a chip/underline/single restrained glow, it's being overused.

**The Paper-White-Is-Primary Rule.** The actual "take this action" color in this system is Paper White on Void Black, not blue. This is inherited directly from the app and is the single most important divergence from a generic SaaS template — reach for it first on any primary CTA.

**The Dark-Only Rule.** There is no light theme. Don't reintroduce a light/dark toggle or light-mode token branch; the app this site represents has no light mode, and neither should the site that's selling it.

## 3. Typography

**Sans Font (everything):** Geist (`var(--font-sans)`, self-hosted via `next/font/google`), with system sans-serif fallback
**Mono Font:** JetBrains Mono (`var(--font-mono)`, self-hosted via `next/font/google`), for terminal output, stat values, migration commands, and Discord slash-command chips

**Character:** Geist is the only sans voice in the system — headings, stat numerals, card titles, and body copy all run in it, distinguished by size, weight, and tracking rather than by switching families. This matches the app's hard "one sans family" rule. JetBrains Mono is reserved for anything that reads as data or code, giving those elements a distinct "instrumentation" texture against the Geist prose around them — contrast by family is used exactly once, for sans-vs-mono, not for a second display face.

### Hierarchy
- **Display** (600, 2.25rem → 3.75rem across breakpoints, 1.1 line-height): Hero H1 only. `text-balance` applied so lines break evenly. A marketing hero is allowed to run larger than this floor (the app's own type scale tops out near 1.5rem; a hero headline pushing toward 3rem–6rem is an intentional, sanctioned liberty — see §6).
- **Headline** (600, 1.875rem → 2.25rem, 1.2 line-height): Section H2s. Also `text-balance`.
- **Title** (500, 1rem, 0.875rem in compact cards): Card titles, feature titles.
- **Body** (400, 0.875rem – 1.125rem, 1.6 line-height, capped ~65ch): Descriptions, paragraph copy, FAQ answers. Color steps down to Ash Text for secondary body text, never lighter.
- **Label** (500, 0.75rem): Badges, nav-adjacent micro-labels, the "Works with" trust-strip caption.
- **Mono** (400, 0.6875rem – 0.75rem, 1.4–1.6 line-height): Discord slash commands, the migration code block, console/stat mockups. Use `tabular-nums` for numeric columns.

### Named Rules
**The One-Family Rule.** Geist for everything sans; JetBrains Mono for anything data/code-shaped. Never introduce a second display or serif face for "personality" — get personality from scale, weight, motion, and the sans/mono contrast instead.

**The Tabular-Nums Rule.** Any numeral standing alone as a stat (the `STATS` row, uptime/player counts) uses `tabular-nums` so digits don't shift width on update — these numbers read as live telemetry, not static copy.

## 4. Elevation

Flat by design, matching the app exactly: depth comes from stepping through the charcoal scale (Void Black → Panel Charcoal → Overlay Charcoal), not from shadow weight. Cards are identified primarily by a 1px hairline border/ring, with a near-invisible shadow underneath for edge separation from the page — the shadow is atmosphere, the hairline does the structural work.

### Shadow Vocabulary
- **Card** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): Resting state for cards — near-invisible, edge definition only. Always paired with the hairline ring.
- **Card Hover** (`0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 8px 24px -6px rgb(0 0 0 / 0.5)`): Hover/lift state, paired with `-translate-y-1` — the inset highlight reads as a screen catching light, not a physical card casting one.
- **Popover** (`0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Sheets, dropdowns, floating menus — the deepest shadow in the system, reserved for content that floats above everything else.

### Named Rules
**The Ring-Before-Shadow Rule.** A resting card's edge is defined by its 1px ring, not its shadow. If a component needs a shadow to read as "a card" with no ring, it's missing its structural border.

## 5. Components

### Buttons
- **Shape:** `rounded-md` (0.375rem) for both tiers.
- **Primary** (`variant="default"`): Paper White background, Void Black text. Hover dims the whole button to ~75% opacity (`hover:opacity-75`) — a true opacity fade, not a color-mix/shadow change. This is the button for every "Download," "Get started," or form-submit action.
- **Secondary** (`variant="secondary"`): Steel Gray background, Paper White text. Used for real secondary actions (GitHub, Discord, "Join the community") that shouldn't compete with the primary CTA but still read as solid, pressable actions rather than a quiet outline.
- **Outline / Ghost:** transparent background, hairline border (outline) or no border (ghost); reserved for lighter-weight inline affordances, not for CTA-tier actions.
- **Hover/Focus:** all variants share a 1px downward press on `:active` (`active:translate-y-px`) and a 3px ring on `:focus-visible` — never a color-only focus state.

### Badges
- **Style:** pill-shaped (`rounded-4xl` → 9999px, true full radius), 1px border, 20px height, 0.75rem label text.
- **Brand/wayfinding variant:** cfx-blue text on a 10% cfx-blue fill with a 30%-opacity cfx-blue border — never solid blue fill with white text; badges stay quiet, buttons carry the solid color. This is where blue is allowed to appear more generously than the app's strict button rule, per the marketing-liberties note in §6.
- **Outline variant:** hairline border, muted text — the quiet default for version/changelog tags ("v0.5.0-Beta," "MIT Licensed").

### Cards
- **Corner Style:** `rounded-xl` (0.75rem) — containers use a visibly larger radius than controls (`rounded-md` buttons/inputs); the gap between the two is deliberate, it's what makes containers read as containers and controls read as tools.
- **Background:** Panel Charcoal.
- **Shadow Strategy:** see Elevation — hairline ring at rest, Card shadow underneath, Card Hover shadow + 4px lift on `:hover` where the card is a link.
- **Border:** hairline ring (`ring-1 ring-foreground/10`), not a stroke border.
- **Internal Padding:** 1.5rem default, 1rem in compact (`size="sm"`) cards.

### Inputs
- **Style:** hairline border, Void-Black-tinted background, `rounded-lg`, 2.75rem (44px) height for comfortable tap targets.
- **Focus:** border shifts to the ring (cfx-blue) color, plus a 3px ring at 40% opacity — no glow or color-only indication.

### Navigation
- **Style:** sticky header, translucent (`bg-background/80 backdrop-blur-xl`) until scrolled, at which point a hairline border and card shadow appear. Active link gets a cfx-blue 1px underline that scales in from `scale-x-0`, not a background pill or bold weight change — the underline is the only active-state signal, kept consistent with the Wayfinding Blue Rule. There is no theme toggle — the site is dark-only.
- **Mobile:** slides in as a full-height sheet from the right, `rounded-none`, with CTAs stacked at the bottom in fixed order — Secondary (GitHub) → Secondary (Discord) → Primary (Download), so the strongest visual weight lands last/closest to the thumb.

### Reveal (signature motion component)
Content is visible by default (SSR/no-JS safe) and only gains a hidden pre-reveal state after hydration, via a layout effect — so there's never a flash of visible-then-hidden. On scroll into view it fades and rises 1rem over 700ms with a quart ease-out, with an optional per-item stagger delay for grids. Fully bypassed under `prefers-reduced-motion`.

## 6. Marketing Liberties (where this page is allowed to diverge from the app)

The app's whole identity is "instrumentation, not marketing" — near-zero decoration, color used only functionally. Copying that literally onto a landing page would be boring. These liberties are intentional and should not be "corrected" back toward the app's stricter product-UI scale:
- Hero type may run well past the app's 1.5rem title ceiling — 3rem–6rem+ headlines are sanctioned.
- A single soft cfx-blue radial glow behind the hero/CTA sections is allowed as a large-surface use of blue — this is different from the "no RGB/multi-hue gradient" ban, which is about gamer-aesthetic color stacking, not a single restrained brand-color glow.
- Motion may be more present than the app's density-first restraint — scroll reveals, staggered grids, hover lifts.
- cfx-blue may appear more generously in small chip/badge contexts (the hero's "Drop-in replacement for txAdmin" badge) than the app's strict button rule would allow — as long as it never becomes a primary button's fill color.

## 7. Do's and Don'ts

### Do:
- **Do** keep cfx-blue to nav, focus, links, icon chips, small badges, and the single background glow — the Wayfinding Blue Rule.
- **Do** use Paper White on Void Black for every primary CTA — the Paper-White-Is-Primary Rule.
- **Do** step through the charcoal scale (Void Black → Panel Charcoal → Overlay Charcoal) for depth instead of reaching for a heavier shadow.
- **Do** use Geist for everything sans and JetBrains Mono for anything data/code-shaped — the One-Family Rule.
- **Do** show real panel mockups, real Discord embed replicas, and real command names/numbers as proof — this brand has no testimonials or logos to lean on yet, so concrete product detail is the credibility signal.
- **Do** give every scroll-reveal animation a `prefers-reduced-motion` fallback, matching the existing `Reveal` component's pattern.

### Don't:
- **Don't** fill a primary button with cfx-blue — Paper White is the primary-action color in this system, full stop.
- **Don't** reintroduce a light theme or theme toggle — the site is dark-only, matching the app.
- **Don't** add a second sans/display face or a serif for "personality" — get it from scale, weight, and motion instead.
- **Don't** use RGB/multi-hue gradients, neon glow stacking, or anything that reads as a game-mod site rather than professional infrastructure tooling.
- **Don't** drop body or muted text lighter than Ash Text (`#a1a1aa`) — it's the contrast floor, not a suggestion.
- **Don't** fill a badge solid with cfx-blue and white text; badges stay at 10% fill / tinted text, solid Paper White fill is a primary button's job.
- **Don't** fabricate proof (testimonials, server counts, logos) to fill the credibility gap.
