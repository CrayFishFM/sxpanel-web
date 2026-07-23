import { randomInt } from "node:crypto"

/**
 * Crockford-style alphabet: no 0/O, 1/I/L, or U. The generated id is shown
 * to the end user in a large letter-spaced element and is meant to be typed
 * or read aloud into a support channel, so visually ambiguous characters
 * cost more than the ~1.3 bits of entropy they'd add.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"
const LENGTH = 8

/**
 * ~6.5e11 possible ids. With a 7-day retention window the table never holds
 * enough rows for a birthday collision to be plausible, and the primary key
 * catches one anyway — see the retry in POST /api/diagnostics.
 */
export function generateReportId(): string {
  let id = ""
  for (let i = 0; i < LENGTH; i++) {
    // randomInt is rejection-sampled, so no modulo bias.
    id += ALPHABET[randomInt(0, ALPHABET.length)]
  }
  return id
}

/**
 * Ids are case-normalised on lookup so an admin can paste one back in
 * lowercase, or as the user transcribed it.
 */
export function normalizeReportId(value: string): string | null {
  const normalized = value.trim().toUpperCase()
  if (normalized.length !== LENGTH) return null
  for (const char of normalized) {
    if (!ALPHABET.includes(char)) return null
  }
  return normalized
}
