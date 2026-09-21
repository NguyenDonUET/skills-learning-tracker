export type DurationParseResult =
  | { ok: true; minutes: number; warnLong: boolean }
  | { ok: false; error: string };

const EIGHT_HOURS = 8 * 60;

/**
 * Flexible duration parser:
 * - "45" → 45 minutes
 * - "1.5" → 90 minutes (hours)
 * - "1h 30m" / "1h30m" / "90m" → minutes
 */
export function parseDuration(input: string): DurationParseResult {
  const raw = input.trim().toLowerCase();
  if (!raw) return { ok: false, error: "Enter a duration" };

  let minutes = 0;

  if (/^\d+(\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    // Integers ≤ 24 treated as minutes; decimals / larger as hours
    if (raw.includes(".")) {
      minutes = Math.round(n * 60);
    } else if (n <= 24) {
      minutes = Math.round(n);
    } else {
      minutes = Math.round(n);
    }
  } else {
    const hourMatch = raw.match(/(\d+(?:\.\d+)?)\s*h/);
    const minMatch = raw.match(/(\d+(?:\.\d+)?)\s*m/);
    if (!hourMatch && !minMatch) {
      return { ok: false, error: "Try 45, 1h 30m, or 1.5" };
    }
    if (hourMatch) minutes += Math.round(Number(hourMatch[1]) * 60);
    if (minMatch) minutes += Math.round(Number(minMatch[1]));
  }

  if (!Number.isFinite(minutes) || minutes < 1) {
    return { ok: false, error: "Duration must be at least 1 minute" };
  }

  return {
    ok: true,
    minutes,
    warnLong: minutes > EIGHT_HOURS,
  };
}
