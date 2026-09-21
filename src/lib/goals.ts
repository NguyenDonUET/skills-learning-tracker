import { daysBetween, weekRangeContaining } from "@/lib/dates";
import type { Session, Skill, SkillGoal } from "@/types/skill";

export function totalMinutesForSkill(
  sessions: Session[],
  skillId: string,
): number {
  return sessions
    .filter((s) => s.skillId === skillId)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function weeklyMinutesForSkill(
  sessions: Session[],
  skillId: string,
  today: string,
): number {
  const { start, end } = weekRangeContaining(today);
  return sessions
    .filter(
      (s) =>
        s.skillId === skillId && s.date >= start && s.date <= end,
    )
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

/** 0–1 progress, or null when no goal. */
export function goalProgress(
  skill: Skill,
  sessions: Session[],
  today: string,
): number | null {
  const goal: SkillGoal = skill.goal;
  if (!goal) return null;

  const minutes =
    goal.type === "weekly"
      ? weeklyMinutesForSkill(sessions, skill.id, today)
      : totalMinutesForSkill(sessions, skill.id);

  const hours = minutes / 60;
  if (goal.targetHours <= 0) return 0;
  return Math.min(1, hours / goal.targetHours);
}

export type GoalPaceStatus = "ahead" | "on-track" | "behind" | "complete";

export type GoalPaceMessage =
  | "weeklyComplete"
  | "totalComplete"
  | "ahead"
  | "behind"
  | "onTrack"
  | "remainingStart"
  | "remainingPace";

export type GoalPace = {
  status: GoalPaceStatus;
  message: GoalPaceMessage;
  loggedHours: number;
  targetHours: number;
  remainingHours: number;
  daysNeeded: number | null;
};

/**
 * Pace vs goal: weekly uses day-of-week expected share; total is simple remaining.
 * UI copy is resolved via i18n from `message` + numeric fields.
 */
export function goalPace(
  skill: Skill,
  sessions: Session[],
  today: string,
): GoalPace | null {
  const goal = skill.goal;
  if (!goal) return null;

  const loggedMinutes =
    goal.type === "weekly"
      ? weeklyMinutesForSkill(sessions, skill.id, today)
      : totalMinutesForSkill(sessions, skill.id);
  const loggedHours = Math.round((loggedMinutes / 60) * 100) / 100;
  const targetHours = goal.targetHours;
  const remainingHours = Math.max(
    0,
    Math.round((targetHours - loggedHours) * 100) / 100,
  );

  if (loggedHours >= targetHours) {
    return {
      status: "complete",
      message: goal.type === "weekly" ? "weeklyComplete" : "totalComplete",
      loggedHours,
      targetHours,
      remainingHours: 0,
      daysNeeded: null,
    };
  }

  if (goal.type === "weekly") {
    const day = new Date(`${today}T12:00:00`).getDay();
    const daysElapsed = day === 0 ? 7 : day; // Mon=1 … Sun=7
    const expected = (targetHours * daysElapsed) / 7;
    const delta = loggedHours - expected;

    if (delta >= 0.5) {
      return {
        status: "ahead",
        message: "ahead",
        loggedHours,
        targetHours,
        remainingHours,
        daysNeeded: null,
      };
    }
    if (delta <= -0.5) {
      return {
        status: "behind",
        message: "behind",
        loggedHours,
        targetHours,
        remainingHours,
        daysNeeded: null,
      };
    }
    return {
      status: "on-track",
      message: "onTrack",
      loggedHours,
      targetHours,
      remainingHours,
      daysNeeded: null,
    };
  }

  const created = skill.createdAt.slice(0, 10);
  const daysActive = Math.max(1, daysBetween(created, today) + 1);
  const rate = loggedHours / daysActive;
  const remaining = targetHours - loggedHours;
  const daysNeeded = rate > 0 ? Math.ceil(remaining / rate) : null;

  return {
    status: rate > 0 ? "on-track" : "behind",
    message: daysNeeded == null ? "remainingStart" : "remainingPace",
    loggedHours,
    targetHours,
    remainingHours,
    daysNeeded,
  };
}
