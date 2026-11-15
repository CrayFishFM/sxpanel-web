// Validates content/docs so a broken page never reaches a build:
//   - every page has title + description frontmatter and compiles as MDX
//   - only components registered in mdx-components.tsx are used
//   - internal /docs links and images point at something that exists
//   - meta.json and the files on disk agree
// Usage: node scripts/check-docs.mjs

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { compile } from "@mdx-js/mdx"

const DOCS_DIR = "content/docs"
const PUBLIC_DIR = "public"
// Keep in sync with mdx-components.tsx
const COMPONENTS = new Set(["Callout", "Card", "Cards", "Step", "Steps"])

const errors = []
const fail = (file, message) => errors.push(`${file}: ${message}`)

// Paths relative to DOCS_DIR, with forward slashes: "players.mdx", "settings/game.mdx"
const files = []
const folders = [""]
function collect(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const rel = relative(DOCS_DIR, full).replaceAll("\\", "/")
    if (statSync(full).isDirectory()) {
      folders.push(rel)
      collect(full)
    } else if (name.endsWith(".mdx")) {
      files.push(rel)
    }
  }
}
collect(DOCS_DIR)
// Every URL slug a page answers to: "players", "settings/game", and "settings" for settings/index.
const slugs = new Set()
for (const rel of files) {
  const slug = rel.replace(/\.mdx$/, "")
  slugs.add(slug)
  if (slug.endsWith("/index")) slugs.add(slug.slice(0, -"/index".length))
}

function walk(node, visit) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

function checkTarget(file, target, line) {
  if (!target || !target.startsWith("/")) return
  const path = target.split(/[?#]/)[0]
  const where = line ? ` (line ${line})` : ""
  if (/\.[a-z0-9]+$/i.test(path)) {
    if (!existsSync(join(PUBLIC_DIR, path))) {
      fail(file, `missing file ${PUBLIC_DIR}${path}${where}`)
    }
    return
  }
  if (path === "/docs" || !path.startsWith("/docs/")) return
  const slug = path.slice("/docs/".length).replace(/\/$/, "")
  if (!slugs.has(slug)) fail(file, `broken link ${target}${where}`)
}

for (const rel of files) {
  const file = `${DOCS_DIR}/${rel}`
  const raw = readFileSync(file, "utf8")

  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!frontmatter) {
    fail(file, "missing frontmatter")
    continue
  }
  for (const key of ["title", "description"]) {
    if (!new RegExp(`^${key}:\\s*\\S`, "m").test(frontmatter[1])) {
      fail(file, `frontmatter is missing "${key}"`)
    }
  }

  // Blank the frontmatter out instead of removing it so line numbers stay true.
  const body = frontmatter[0].replace(/[^\n]/g, "") + raw.slice(frontmatter[0].length)

  const inspect = () => (tree) => {
    walk(tree, (node) => {
      const line = node.position?.start.line
      if (node.type === "link" || node.type === "image") {
        checkTarget(file, node.url, line)
      }
      if (node.type === "mdxjsEsm") {
        fail(file, `import/export is not allowed in docs pages (line ${line})`)
      }
      if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        if (node.name && /^[A-Z]/.test(node.name) && !COMPONENTS.has(node.name)) {
          fail(file, `unknown component <${node.name}> (line ${line})`)
        }
        for (const attr of node.attributes ?? []) {
          if ((attr.name === "href" || attr.name === "src") && typeof attr.value === "string") {
            checkTarget(file, attr.value, line)
          }
        }
      }
    })
  }

  try {
    await compile(body, { remarkPlugins: [inspect] })
  } catch (error) {
    const line = error.line ? ` (line ${error.line})` : ""
    fail(file, `does not compile${line}: ${error.reason ?? error.message}`)
  }
}

// Each folder's meta.json must list exactly the pages and sub-folders in it,
// unless it uses "..." (rest). Separators ("---Label---") and links are skipped.
for (const folder of folders) {
  const dir = folder ? join(DOCS_DIR, folder) : DOCS_DIR
  const metaFile = `${DOCS_DIR}/${folder ? `${folder}/` : ""}meta.json`
  if (!existsSync(metaFile)) {
    if (!folder) fail(metaFile, "missing")
    continue
  }
  let meta
  try {
    meta = JSON.parse(readFileSync(metaFile, "utf8"))
  } catch (error) {
    fail(metaFile, `unreadable: ${error.message}`)
    continue
  }
  if (!Array.isArray(meta.pages)) continue
  const entries = new Set(
    readdirSync(dir)
      .filter((name) => name.endsWith(".mdx") || statSync(join(dir, name)).isDirectory())
      .map((name) => name.replace(/\.mdx$/, "")),
  )
  const listed = new Set()
  let rest = false
  for (const page of meta.pages) {
    if (page.startsWith("---") || page.startsWith("[")) continue
    if (page.startsWith("...")) {
      rest = true
      continue
    }
    const name = page.startsWith("!") ? page.slice(1) : page
    if (listed.has(name)) fail(metaFile, `lists "${name}" twice`)
    listed.add(name)
    if (!entries.has(name)) fail(metaFile, `lists "${name}" but there is no ${name}.mdx or ${name}/ next to it`)
  }
  if (!rest) {
    for (const name of entries) {
      if (!listed.has(name)) fail(metaFile, `"${name}" is not listed in "pages"`)
    }
  }
}

if (errors.length > 0) {
  console.error(`check-docs: ${errors.length} problem(s)\n`)
  for (const message of errors) console.error(`  ${message}`)
  process.exit(1)
}
console.log(`check-docs: ${files.length} pages OK`)
