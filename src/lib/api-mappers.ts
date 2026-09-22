import type { Session as DbSession, Skill as DbSkill } from "@prisma/client";

import type { Session, Skill, SkillGoal } from "@/types/skill";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function toSkillGoal(
  goalType: string | null,
  goalTargetHours: number | null,
): SkillGoal {
  if (
    (goalType === "weekly" || goalType === "total") &&
    goalTargetHours != null &&
    goalTargetHours > 0
  ) {
    return { type: goalType, targetHours: goalTargetHours };
  }
  return null;
}

export function toApiSkill(skill: DbSkill): Skill {
  return {
    id: skill.id,
    name: skill.name,
    color: skill.color,
    goal: toSkillGoal(skill.goalType, skill.goalTargetHours),
    createdAt: skill.createdAt.toISOString(),
  };
}

export function toApiSession(session: DbSession): Session {
  return {
    id: session.id,
    skillId: session.skillId,
    durationMinutes: session.durationMinutes,
    date: session.date,
    notes: session.notes,
    createdAt: session.createdAt.toISOString(),
  };
}

export function parseGoalInput(goal: unknown): {
  goalType: string | null;
  goalTargetHours: number | null;
} {
  if (goal === null) {
    return { goalType: null, goalTargetHours: null };
  }
  if (
    typeof goal === "object" &&
    goal !== null &&
    "type" in goal &&
    "targetHours" in goal
  ) {
    const type = (goal as { type: unknown }).type;
    const targetHours = Number((goal as { targetHours: unknown }).targetHours);
    if (
      (type === "weekly" || type === "total") &&
      Number.isFinite(targetHours) &&
      targetHours > 0
    ) {
      return { goalType: type, goalTargetHours: targetHours };
    }
  }
  throw new Error("Invalid goal");
}

export function isValidDateString(date: string): boolean {
  if (!DATE_RE.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export function isValidDuration(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes >= 1;
}
