---
name: sxPanel
description: The control room for your FiveM & RedM server — a technical, violet-accented brand system on a near-monochrome neutral base.
colors:
  control-violet: "oklch(0.58 0.235 277)"
  control-violet-foreground: "oklch(0.985 0.002 197.1)"
  control-violet-mist: "oklch(0.92 0.05 277)"
  panel-white: "oklch(1 0 0)"
  console-ink: "oklch(0.148 0.004 228.8)"
  panel-slate: "oklch(0.218 0.008 223.9)"
  quiet-fog: "oklch(0.963 0.002 197.1)"
  steel-gray: "oklch(0.496 0.016 213.5)"
  hairline-gray: "oklch(0.925 0.005 214.3)"
  uptime-green: "oklch(0.62 0.17 150)"
  warning-amber: "oklch(0.72 0.16 65)"
  info-blue: "oklch(0.6 0.13 240)"
  alert-red: "oklch(0.577 0.245 27.325)"
  telemetry-teal: "oklch(0.7 0.13 190)"
  signal-orange: "oklch(0.75 0.16 70)"
  flare-red: "oklch(0.65 0.21 12)"
  deep-blue: "oklch(0.62 0.16 250)"
typography:
  display:
    fontFamily: "var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem → 3rem (sm) → 3.75rem (md)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem → 2.25rem (sm)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  title:
    fontFamily: "var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem (0.875rem in compact cards)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem – 1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  mono:
    fontFamily: "var(--font-mono), ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  3xl: "1.375rem"
  4xl: "1.625rem"
spacing:
  card-sm: "1rem"
  card-default: "1.5rem"
  section-y: "5rem"
  section-y-lg: "6rem"
components:
  button-brand:
    backgroundColor: "{colors.control-violet}"
    textColor: "{colors.control-violet-foreground}"
    rounded: "{rounded.md}"
    padding: "0 0.625rem"
    height: "2.5rem"
  button-brand-hover:
    backgroundColor: "{colors.control-violet}"
    textColor: "{colors.control-violet-foreground}"
  button-outline:
    backgroundColor: "{colors.panel-white}"
    textColor: "inherit"
    rounded: "{rounded.md}"
    padding: "0 0.625rem"
  badge-brand:
    backgroundColor: "{colors.control-violet}"
    textColor: "{colors.control-violet}"
    rounded: "{rounded.4xl}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  card:
    backgroundColor: "inherit"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
---

# Design System: sxPanel

## 1. Overview

**Creative North Star: "The Control Room"**

sxPanel's site is styled like the instrument panel it's selling: a near-monochrome, cool-neutral canvas with a single violet signal color reserved for things that matter — the primary action, the active nav item, a live-status dot. Nothing about the palette or type system asks to be noticed for its own sake; it earns trust the way a well-built dashboard does, by being legible, precise, and quiet everywhere the content isn't the point. Headings run in Geist (a geometric, slightly technical grotesque) at tight negative tracking, standing in deliberate contrast to Inter's warmer, more readable body text — the same two-voice pairing a real product's UI and marketing site would share, because sxPanel's UI and marketing site *do* share it.

This system explicitly rejects the generic SaaS-template look: no cream or sand backgrounds, no decorative glassmorphism, no eyebrow labels stacked above every section, no hero-metric-card cliché. Where the page needs proof of capability, it shows a realistic panel mockup or a real Discord embed replica, not an icon grid standing in for a screenshot.

**Key Characteristics:**
- Violet is a signal, not a surface — used on <10% of any given viewport
- Cool, low-chroma neutrals throughout; no warm cream/sand tint
- Geist for headings and numerals, Inter for body copy — contrast by family, not by weight alone
- Shadows are soft, cool-toned, and always paired with a hairline ring, never used alone
- Motion is a 700ms fade-and-rise on scroll entry, respecting `prefers-reduced-motion`

## 2. Colors

A near-monochrome cool-neutral base (hue ~197–229, chroma ≈0) with one committed accent and a small semantic set for status.

### Primary
- **Control Violet** (`oklch(0.58 0.235 277)`): The brand signal. Primary CTA backgrounds, active nav underline, icon-chip accents, focus rings on brand elements, link/selection color. Reserved — it does not color body backgrounds or large surfaces.
- **Control Violet Mist** (`oklch(0.92 0.05 277)`): The soft radial glow behind hero and CTA sections (`bg-[radial-gradient(...,var(--brand-muted),transparent_70%)]`), and the icon-chip fill at rest. The only place violet is allowed to spread across a large area, and even then at low opacity fading to transparent.

### Neutral
- **Panel White** (`oklch(1 0 0)`): Light-mode background and card surface.
- **Console Ink** (`oklch(0.148 0.004 228.8)`): Light-mode foreground text; dark-mode page background. The system's near-black, always with a faint cool (blue) tint, never neutral gray or warm.
- **Panel Slate** (`oklch(0.218 0.008 223.9)`): Dark-mode card/popover surface, one step lighter than the dark background.
- **Quiet Fog** (`oklch(0.963 0.002 197.1)`): Light-mode muted/secondary surface — section backgrounds (`bg-muted/30`), subtle fills.
- **Steel Gray** (`oklch(0.496 0.016 213.5)`): Muted foreground text — captions, descriptions, secondary labels. Never dropped lighter than this for body copy; this is the contrast floor.
- **Hairline Gray** (`oklch(0.925 0.005 214.3)`): Border and divider color at rest, always at 1px.

### Semantic
- **Uptime Green** (`oklch(0.62 0.17 150)`): Success states, "done" checkmarks, the live "Online" status dot.
- **Warning Amber** (`oklch(0.72 0.16 65)`): Warning states only; not used decoratively.
- **Info Blue** (`oklch(0.6 0.13 240)`): Informational badges/callouts, distinct from both brand violet and success green.
- **Alert Red** (`oklch(0.577 0.245 27.325)`): Destructive actions and error states only.

### Chart Palette
- **Telemetry Teal** (`oklch(0.7 0.13 190)`), **Signal Orange** (`oklch(0.75 0.16 70)`), **Flare Red** (`oklch(0.65 0.21 12)`), **Deep Blue** (`oklch(0.62 0.16 250)`) round out a 5-color categorical set anchored on Control Violet, for analytics charts (player timelines, retention curves, peak-hour heatmaps).

### Named Rules
**The Rare Violet Rule.** Control Violet marks the thing the visitor should act on — never the surface they're reading. If violet is filling more than a button, a chip, an underline, or a soft background glow, it's being overused.

**The Cool-Neutral Rule.** Every neutral in this system carries a faint cool (blue-gray) tint, never a warm cream/sand tint. This is a deliberate departure from the generic AI-marketing default; don't introduce warm neutrals to "soften" the palette.

## 3. Typography

**Display/Headline Font:** Geist (`var(--font-geist)`), with Inter and system sans-serif fallback
**Body Font:** Inter (`var(--font-sans)`), with system sans-serif fallback
**Label/Mono Font:** Geist Mono (`var(--font-mono)`), for terminal output, migration commands, and Discord slash-command chips

**Character:** Geist carries structure — headings, stat numerals, card titles — with tight -0.022em tracking and `ss01`/`cv01` features that give numerals and technical labels a slightly built, dashboard feel. Inter carries everything meant to be read at length, staying neutral and highly legible against it. The pairing reads as "product UI typography," not "marketing typography," which is deliberate: the site should feel like an extension of the panel it's selling.

### Hierarchy
- **Display** (600, 2.25rem → 3.75rem across breakpoints, 1.1 line-height): Hero H1 only. `text-balance` applied so lines break evenly.
- **Headline** (600, 1.875rem → 2.25rem, 1.2 line-height): Section H2s (`SectionHeading`). Also `text-balance`.
- **Title** (500, 1rem, 0.875rem in compact cards): Card titles, feature titles.
- **Body** (400, 0.875rem – 1.125rem, 1.6 line-height, capped ~65ch): Descriptions, paragraph copy, FAQ answers. Color steps down to Steel Gray for secondary body text, never lighter.
- **Label** (500, 0.75rem): Badges, nav-adjacent micro-labels, the "Works with" trust-strip caption.
- **Mono** (400, 0.75rem, 1.6 line-height): Discord slash commands, the migration code block.

### Named Rules
**The Two-Voice Rule.** Geist for structure and numerals, Inter for prose. Never introduce a third display face; contrast comes from the Geist/Inter pairing, not from adding more families.

**The Tabular-Nums Rule.** Any numeral standing alone as a stat (the `STATS` row, uptime/player counts) uses `tabular-nums` so digits don't shift width on update — these numbers read as live telemetry, not static copy.

## 4. Elevation

Elevation is deliberately quiet: flat cards at rest, identified primarily by a 1px hairline ring (`ring-1 ring-foreground/10`) rather than a shadow, with a soft cool-toned shadow layered underneath for separation from the page. Shadows never appear without the ring; the ring does the structural work, the shadow adds atmosphere. On hover, cards lift 4px and the shadow deepens — a state response, not an ambient decoration. Dark mode swaps in a 1px inset highlight (a faint top-edge glow) alongside a darker, larger-blur shadow, which reads as a screen catching light rather than a physical card casting one.

### Shadow Vocabulary
- **Card** (`0 1px 2px 0 oklch(0.21 0.02 230 / 0.06), 0 1px 1px 0 oklch(0.21 0.02 230 / 0.04)`): Resting state for cards, always paired with the hairline ring.
- **Card Hover** (`0 4px 12px -2px oklch(0.21 0.02 230 / 0.1), 0 2px 4px -1px oklch(0.21 0.02 230 / 0.06)`): Hover/lift state, paired with `-translate-y-1`.
- **Popover** (`0 12px 32px -6px oklch(0.21 0.02 230 / 0.14), 0 4px 10px -4px oklch(0.21 0.02 230 / 0.08)`): Sheets, dropdowns, floating menus — the deepest shadow in the system, reserved for content that floats above everything else.

### Named Rules
**The Ring-Before-Shadow Rule.** A resting card's edge is defined by its 1px ring, not its shadow. If a component needs a shadow to read as "a card" with no ring, it's missing its structural border.

## 5. Components

### Buttons
- **Shape:** `rounded-md` (0.5rem)
- **Brand** (primary CTA): Control Violet background, Control Violet Foreground text, `shadow-sm shadow-brand/30` — a tinted, not neutral, shadow. Height 2.5rem (`lg` size), horizontal padding 0.625rem plus icon gap.
- **Outline** (secondary CTA): transparent background, hairline border, `shadow-xs`; hovers to a muted fill.
- **Ghost:** no border or background at rest; hover fills muted.
- **Hover/Focus:** all variants share a 1px downward press on `:active` (`active:translate-y-px`) and a 3px brand-tinted focus ring on `:focus-visible` — never a color-only focus state.

### Badges
- **Style:** pill-shaped (`rounded-4xl`, 1.625rem — exceeds half the 1.25rem height, so it renders fully rounded), 1px border, 20px height, 0.75rem label text.
- **Brand variant:** Control Violet text on a 10% Control Violet fill with a 30%-opacity Control Violet border — never solid violet fill with white text; badges stay quiet, buttons carry the solid color.

### Cards
- **Corner Style:** `rounded-xl` (0.875rem)
- **Background:** Panel White (light) / Panel Slate (dark)
- **Shadow Strategy:** see Elevation — hairline ring at rest, Card shadow underneath, Card Hover shadow + 4px lift on `:hover` where the card is a link.
- **Border:** none as a stroke; the ring (`ring-1 ring-foreground/10`) does this job instead.
- **Internal Padding:** 1.5rem default, 1rem in compact (`size="sm"`) cards.

### Inputs
- **Style:** hairline border, Panel White/Console-Ink-tinted background, `rounded-lg`, `shadow-sm`, 2.75rem (44px) height for comfortable tap targets.
- **Focus:** border shifts to the ring color, plus a 3px ring at 40% opacity — no glow or color-only indication.

### Navigation
- **Style:** sticky header, translucent (`bg-background/80 backdrop-blur-xl`) until scrolled, at which point a hairline border and card shadow appear. Active link gets a Control Violet 1px underline that scales in from `scale-x-0`, not a background pill or bold weight change — the underline is the only active-state signal, kept consistent with the "violet marks the actionable thing" rule.
- **Mobile:** slides in as a full-height sheet from the right, `rounded-none`, with primary/secondary/tertiary CTAs stacked at the bottom in fixed order (GitHub → Discord → Download).

### Reveal (signature motion component)
Content is visible by default (SSR/no-JS safe) and only gains a hidden pre-reveal state after hydration, via a layout effect — so there's never a flash of visible-then-hidden. On scroll into view it fades and rises 1rem over 700ms with a quart ease-out, with an optional per-item stagger delay for grids. Fully bypassed under `prefers-reduced-motion`.

## 6. Do's and Don'ts

### Do:
- **Do** keep Control Violet to buttons, active states, icon chips, and low-opacity background glows — the Rare Violet Rule.
- **Do** use cool-tinted neutrals (hue ~197–229) for every gray in the system; never introduce a warm/cream neutral.
- **Do** pair a hairline ring with every card shadow; never ship a shadow-only card.
- **Do** use Geist for anything structural (headings, stat numerals, card titles) and Inter for anything read at paragraph length.
- **Do** show real panel mockups, real Discord embed replicas, and real command names/numbers as proof — this brand has no testimonials or logos to lean on yet, so concrete product detail is the credibility signal.
- **Do** give every scroll-reveal animation a `prefers-reduced-motion` fallback, matching the existing `Reveal` component's pattern.

### Don't:
- **Don't** use the generic SaaS-template look this category defaults to: cream/sand backgrounds, decorative glassmorphism, a tiny uppercase eyebrow above every section, the hero-metric-card template, or numbered `01/02/03` section markers used as default scaffolding.
- **Don't** use `background-clip: text` gradient text for emphasis — the current hero headline's gradient-clipped "powerful panel" span is a known exception worth revisiting in a future polish pass, not a pattern to repeat elsewhere.
- **Don't** use `border-left`/`border-right` accent stripes on cards or list items.
- **Don't** drop body or muted text lighter than Steel Gray (`oklch(0.496 0.016 213.5)`) — it's the contrast floor, not a suggestion.
- **Don't** fill a badge solid with Control Violet and white text; badges stay at 10% fill / tinted text, solid fill is a button's job.
- **Don't** fabricate proof (testimonials, server counts, logos) to fill the credibility gap — PRODUCT.md is explicit that none exist yet.
