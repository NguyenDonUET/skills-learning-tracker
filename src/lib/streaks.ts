import { addDays, todayDateString } from "@/lib/dates";

export type StreakStatus = "active" | "at-risk" | "broken";

export type StreakResult = {
  current: number;
  longest: number;
  status: StreakStatus;
};

function uniqueSortedDates(dates: string[]): string[] {
  return [...new Set(dates)].sort();
}

function longestRun(sortedAsc: string[]): number {
  if (sortedAsc.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = sortedAsc[i - 1];
    const curr = sortedAsc[i];
    if (addDays(prev, 1) === curr) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  return best;
}

/**
 * Current streak: consecutive days ending today (if practiced today)
 * or yesterday (at-risk). Broken if neither today nor yesterday has practice.
 */
export function computeStreak(
  practiceDates: string[],
  today = todayDateString(),
): StreakResult {
  const sorted = uniqueSortedDates(practiceDates);
  const longest = longestRun(sorted);
  const set = new Set(sorted);
  const yesterday = addDays(today, -1);

  const practicedToday = set.has(today);
  const practicedYesterday = set.has(yesterday);

  if (!practicedToday && !practicedYesterday) {
    return { current: 0, longest, status: "broken" };
  }

  let cursor = practicedToday ? today : yesterday;
  let current = 0;
  while (set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const status: StreakStatus = practicedToday
    ? "active"
    : current > 0
      ? "at-risk"
      : "broken";

  return { current, longest, status };
}
