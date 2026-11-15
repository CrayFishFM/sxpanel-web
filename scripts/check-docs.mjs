// Validates content/docs so a broken page never reaches a build:
//   - every page has title + description frontmatter and compiles as MDX
//   - only components registered in mdx-components.tsx are used
//   - internal /docs links and images point at something that exists
//   - meta.json and the files on disk agree
// Usage: node scripts/check-docs.mjs

import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { compile } from "@mdx-js/mdx"

const DOCS_DIR = "content/docs"
const PUBLIC_DIR = "public"
// Keep in sync with mdx-components.tsx
const COMPONENTS = new Set(["Callout", "Card", "Cards", "Step", "Steps"])

const errors = []
const fail = (file, message) => errors.push(`${file}: ${message}`)

const files = readdirSync(DOCS_DIR).filter((name) => name.endsWith(".mdx"))
const slugs = new Set(files.map((name) => name.replace(/\.mdx$/, "")))

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

for (const name of files) {
  const file = `${DOCS_DIR}/${name}`
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

const metaFile = `${DOCS_DIR}/meta.json`
try {
  const meta = JSON.parse(readFileSync(metaFile, "utf8"))
  const listed = new Set(meta.pages.filter((page) => !page.startsWith("---")))
  for (const page of listed) {
    if (!slugs.has(page)) fail(metaFile, `lists "${page}" but ${page}.mdx does not exist`)
  }
  for (const slug of slugs) {
    if (!listed.has(slug)) fail(metaFile, `${slug}.mdx is not listed in "pages"`)
  }
} catch (error) {
  fail(metaFile, `unreadable: ${error.message}`)
}

if (errors.length > 0) {
  console.error(`check-docs: ${errors.length} problem(s)\n`)
  for (const message of errors) console.error(`  ${message}`)
  process.exit(1)
}
console.log(`check-docs: ${files.length} pages OK`)
