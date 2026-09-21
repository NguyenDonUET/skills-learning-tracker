import { addDays, parseLocalDate, todayDateString } from "@/lib/dates";

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export type HeatmapDay = {
  date: string;
  totalMinutes: number;
  sessionCount: number;
  skillIds: string[];
  skillNames: string[];
  level: HeatmapLevel;
  isFuture: boolean;
  isToday: boolean;
};

export type HeatmapData = {
  weeks: number;
  days: HeatmapDay[];
  startDate: string;
  endDate: string;
};

export type HeatmapMonthGroup = {
  /** YYYY-MM of the month this column group represents */
  monthKey: string;
  weeks: HeatmapDay[][];
};

/** Default window — ~1 year, matching contribution-graph layouts. */
export const HEATMAP_WEEKS = 52;

/** Brand kit thresholds + max for 90m+ days. */
export function minutesToLevel(minutes: number): HeatmapLevel {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 90) return 3;
  return 4;
}

type SessionLike = {
  date: string;
  durationMinutes: number;
  skillId: string;
};

/**
 * N-week GitHub-style heatmap (columns = weeks Sun→Sat, last column includes today).
 */
export function buildHeatmap(
  sessions: SessionLike[],
  skillNameById: Record<string, string>,
  options?: {
    weeks?: number;
    today?: string;
    skillId?: string | null;
  },
): HeatmapData {
  const weeks = options?.weeks ?? HEATMAP_WEEKS;
  const today = options?.today ?? todayDateString();
  const skillFilter = options?.skillId ?? null;

  const filtered = skillFilter
    ? sessions.filter((s) => s.skillId === skillFilter)
    : sessions;

  type Agg = {
    totalMinutes: number;
    sessionCount: number;
    skillIds: Set<string>;
  };
  const byDate = new Map<string, Agg>();

  for (const s of filtered) {
    const existing = byDate.get(s.date) ?? {
      totalMinutes: 0,
      sessionCount: 0,
      skillIds: new Set<string>(),
    };
    existing.totalMinutes += s.durationMinutes;
    existing.sessionCount += 1;
    existing.skillIds.add(s.skillId);
    byDate.set(s.date, existing);
  }

  const todayDow = new Date(`${today}T12:00:00`).getDay();
  const thisWeekSunday = addDays(today, -todayDow);
  const gridStart = addDays(thisWeekSunday, -(weeks - 1) * 7);

  const days: HeatmapDay[] = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      const agg = byDate.get(date);
      const isFuture = date > today;
      const skillIds = agg ? [...agg.skillIds] : [];
      days.push({
        date,
        totalMinutes: agg?.totalMinutes ?? 0,
        sessionCount: agg?.sessionCount ?? 0,
        skillIds,
        skillNames: skillIds.map((id) => skillNameById[id] ?? id),
        level: isFuture ? 0 : minutesToLevel(agg?.totalMinutes ?? 0),
        isFuture,
        isToday: date === today,
      });
    }
  }

  return {
    weeks,
    days,
    startDate: gridStart,
    endDate: today,
  };
}

/** Split flat day list into Sunday-start week columns. */
export function chunkHeatmapWeeks(days: HeatmapDay[]): HeatmapDay[][] {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

/**
 * Group week columns by month (Thursday’s month — same convention as GitHub),
 * so adjacent months can be spaced with a larger gap.
 */
export function groupHeatmapByMonth(days: HeatmapDay[]): HeatmapMonthGroup[] {
  const weeks = chunkHeatmapWeeks(days);
  const groups: HeatmapMonthGroup[] = [];

  for (const week of weeks) {
    const anchor = week[4] ?? week[week.length - 1];
    if (!anchor) continue;
    const monthKey = anchor.date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.monthKey === monthKey) {
      last.weeks.push(week);
    } else {
      groups.push({ monthKey, weeks: [week] });
    }
  }

  return groups;
}

export function formatHeatmapMonthLabel(
  monthKey: string,
  locale?: string,
): string {
  const date = parseLocalDate(`${monthKey}-01`);
  return date.toLocaleDateString(locale, { month: "short" });
}
