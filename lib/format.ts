const BYTE_UNITS = ["B", "KB", "MB", "GB"];

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "—";

  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit++;
  }

  // Whole bytes read oddly with a decimal; everything else gets one.
  const digits = unit === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${BYTE_UNITS[unit]}`;
}

/**
 * Rendered on the server, so pin the timezone rather than letting the output
 * depend on where the process happens to run.
 */
export function formatTimestamp(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}
