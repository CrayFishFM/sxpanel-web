# sxPanel docs standard

The docs are the complete manual for sxPanel. A server owner, an admin or an
addon developer should be able to find out from them how any part of the
product works, without reading the source or asking in Discord. Thin pages
that name a feature and move on are not acceptable; neither is padding.

## What a feature page covers

Cover each of these that applies, in roughly this order. Skip a part only when
it truly does not apply.

1. **What it is for.** One or two sentences: the problem it solves and who
   uses it.
2. **Where to find it.** Panel navigation path (**Server → Live Console**),
   the URL path (`/server/console`), in-game command or keybind, Discord
   command — whichever apply.
3. **Who can use it.** The permissions it needs, by the label shown in the
   Admin Manager and its id in backticks (**Console: Write**,
   `console.write`). Say what someone without the permission sees.
4. **The screen, control by control.** Every tab, column, filter, button,
   toggle and dialog: what it does, what it asks to confirm, and what happens
   afterwards (is it logged, does it notify Discord, does it need a restart).
5. **Every setting.** A table with columns *Setting* (the UI label), *What it
   does*, *Default* and *Limits / values*. Take defaults and limits from the
   config schema and validation code, not from placeholders.
6. **How to do common tasks.** Numbered walkthroughs (`<Steps>`) for the jobs
   people come to the page for.
7. **How it connects.** Discord notifications and log routes it feeds, events
   it emits, exports, addon hooks, related settings on other pages. Link to
   those pages; do not repeat them.
8. **Limits and edge cases.** Caps, rate limits, what happens offline or
   when the server is stopped, data retention, behaviour on gen9, OneSync or
   RedM differences.
9. **Problems.** Error messages exactly as shown, what causes them and the
   fix.

## Accuracy

- Every statement is backed by code you have read. Names, defaults, limits,
  paths, permission ids and UI labels are copied exactly.
- UI text lives in `locale/en.json`; components reference it by key (for
  example `panel.sidebar.item.live_console`). Look the key up to get the
  label a user sees. Never invent a label from a variable name.
- Settings, their defaults and validation live in
  `core/modules/ConfigStore/schema/`. Permissions are registered in
  `core/modules/AdminStore/` and `shared/permissions.ts`.
- If you cannot confirm something, leave it out and list it under
  "Needs a human" in your summary. Never guess.
- Do not document development-only features: `devMockStatus`, the testing
  page, dev debug routes, or anything gated on `import.meta.env.DEV`.

## Writing

- Describe the product as it is now. No "new", "now", "recently", version
  history or commit references.
- Second person, present tense, short paragraphs. Bold for UI labels,
  backticks for identifiers, commands, paths and config keys.
- Tables for settings and permission lists, `<Callout>` for warnings and
  things that are easy to get wrong, `<Steps>`/`<Step>` for procedures.
  Components available: `Callout`, `Steps`, `Step`, `Cards`, `Card`. No
  imports, no other components. In prose, put `{`, `}` and `<` in backticks.
- Use `##` for the parts above and `###` inside them. Headings are short
  nouns ("Filters", "Ban templates"), not sentences.
- Say each thing once, on the page that owns it, and link to it from
  elsewhere. `features.mdx` and `index.mdx` stay short overviews that link
  out.
- Internal links use `/docs/<page>` (for example `/docs/settings/game`).

## Screenshots

`.github/docs-sync/screenshots.md` lists the screenshots in `public/docs/` and
what each shows. Use one where it helps someone find their way around a
screen, at most one per screen, with alt text describing what it shows:
`![Live console with search and filter controls](/docs/live-console.webp)`.
Do not reference images that are not in that list. If a page needs a
screenshot that does not exist, or an existing one no longer matches the
code, list it under "Needs a human".

## Sidebar

`content/docs/meta.json` orders the sidebar in sections marked
`"---Section---"`, in this order: Getting Started, Web Panel, In-Game Menu,
Settings, Discord, Developers, Help. A new page goes into its section's list;
add the section marker if it is not there yet, in the right position. Pages
in a folder (such as `settings/`) are listed in that folder's own
`meta.json`, and the folder name goes in the parent's list.
