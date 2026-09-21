/** Local calendar helpers — practice dates are YYYY-MM-DD (no timezone). */

export function todayDateString(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse YYYY-MM-DD as a local calendar date at noon (avoids DST edge cases). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, days: number): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

export function daysBetween(from: string, to: string): number {
  const a = parseLocalDate(from).getTime();
  const b = parseLocalDate(to).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/** Monday-start week containing `dateStr` → [start, end] inclusive. */
export function weekRangeContaining(dateStr: string): { start: string; end: string } {
  const date = parseLocalDate(dateStr);
  const day = date.getDay(); // 0 Sun … 6 Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = addDays(dateStr, mondayOffset);
  const end = addDays(start, 6);
  return { start, end };
}

export function shiftIsoTimestamp(iso: string, dayOffset: number): string {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date.toISOString();
}
