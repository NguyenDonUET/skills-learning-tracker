import { addDays, weekRangeContaining } from "@/lib/dates";
import type { Session } from "@/types/skill";

export type WeekBucket = {
  weekStart: string;
  weekEnd: string;
  label: string;
  hours: number;
  minutes: number;
};

/** Last N Monday-start weeks ending with the week that contains `today`. */
export function weeklyHoursTrend(
  sessions: Session[],
  skillId: string,
  weeks = 8,
  today: string,
  locale = "en",
): WeekBucket[] {
  const { start: thisWeekStart } = weekRangeContaining(today);
  const buckets: WeekBucket[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = addDays(thisWeekStart, -7 * i);
    const weekEnd = addDays(weekStart, 6);
    const minutes = sessions
      .filter(
        (s) =>
          s.skillId === skillId && s.date >= weekStart && s.date <= weekEnd,
      )
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    const startDate = new Date(`${weekStart}T12:00:00`);
    const label = startDate.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });

    buckets.push({
      weekStart,
      weekEnd,
      label,
      minutes,
      hours: Math.round((minutes / 60) * 100) / 100,
    });
  }

  return buckets;
}

export function averageSessionMinutes(
  sessions: Session[],
  skillId: string,
): number | null {
  const skillSessions = sessions.filter((s) => s.skillId === skillId);
  if (skillSessions.length === 0) return null;
  const total = skillSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  return Math.round(total / skillSessions.length);
}
