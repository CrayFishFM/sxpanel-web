/**
 * One-time bootstrap for the first admin account.
 * Usage: pnpm auth:create-admin -- --email you@sxpanel.org --password ******** --name "Your Name"
 */
import { auth } from "@/lib/auth"

function readArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function main() {
  const email = readArg("--email")
  const password = readArg("--password")
  const name = readArg("--name") ?? "Admin"

  if (!email || !password) {
    console.error("Usage: pnpm auth:create-admin -- --email you@sxpanel.org --password ******** [--name \"Your Name\"]")
    process.exit(1)
  }

  const result = await auth.api.createUser({
    body: { email, password, name, role: "admin" },
  })

  console.log(`Created admin ${result.user.email} (id: ${result.user.id})`)
  process.exit(0)
}

main().catch((error) => {
  console.error("Failed to create admin:", error instanceof Error ? error.message : error)
  process.exit(1)
})
