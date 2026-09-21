import { addDays, daysBetween, shiftIsoTimestamp, todayDateString } from "@/lib/dates";
import { goalProgress } from "@/lib/goals";
import { computeStreak } from "@/lib/streaks";
import type {
  RecentSessionItem,
  Session,
  Skill,
  SkillSummary,
} from "@/types/skill";

import sample from "../../data/sample-skills.json";

const SAMPLE_ANCHOR = "2026-03-19";

export type SeedData = {
  skills: Skill[];
  sessions: Session[];
};

export function shiftSampleData(today = todayDateString()): SeedData {
  const offset = daysBetween(SAMPLE_ANCHOR, today);
  const skills = sample.skills.map((s) => ({
    ...s,
    goal: s.goal as Skill["goal"],
    createdAt: shiftIsoTimestamp(s.createdAt, offset),
  }));
  const sessions = sample.sessions.map((s) => ({
    ...s,
    date: addDays(s.date, offset),
    createdAt: shiftIsoTimestamp(s.createdAt, offset),
  }));
  return { skills, sessions };
}

export function buildSkillSummaries(
  skills: Skill[],
  sessions: Session[],
  today = todayDateString(),
): SkillSummary[] {
  return skills.map((skill) => {
    const skillSessions = sessions.filter((s) => s.skillId === skill.id);
    const totalMinutes = skillSessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0,
    );
    const streak = computeStreak(
      skillSessions.map((s) => s.date),
      today,
    );
    return {
      skill,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      sessionCount: skillSessions.length,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      goalProgress: goalProgress(skill, sessions, today),
      streakStatus: streak.status,
    };
  });
}

export function pickFeaturedSkill(summaries: SkillSummary[], sessions: Session[]): SkillSummary | null {
  if (summaries.length === 0) return null;
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.createdAt.localeCompare(a.createdAt);
  });
  const latest = sortedSessions[0];
  if (latest) {
    const match = summaries.find((s) => s.skill.id === latest.skillId);
    if (match) return match;
  }
  return [...summaries].sort((a, b) => b.totalHours - a.totalHours)[0] ?? null;
}

export function buildOverallStats(
  sessions: Session[],
  today = todayDateString(),
) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const streak = computeStreak(
    sessions.map((s) => s.date),
    today,
  );
  return {
    totalHours: Math.round((totalMinutes / 60) * 100) / 100,
    sessionCount: sessions.length,
    currentStreak: streak.current,
    streakStatus: streak.status,
  };
}

export function buildRecentSessions(
  skills: Skill[],
  sessions: Session[],
  limit = 5,
): RecentSessionItem[] {
  const byId = Object.fromEntries(skills.map((s) => [s.id, s]));
  return [...sessions]
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      skillName: byId[s.skillId]?.name ?? "Unknown",
      skillColor: byId[s.skillId]?.color ?? "#059669",
      durationMinutes: s.durationMinutes,
      date: s.date,
      notes: s.notes,
    }));
}

export const SKILL_COLORS = [
  "#059669",
  "#8B5CF6",
  "#3178C6",
  "#EF4444",
  "#F97316",
  "#EC4899",
  "#0EA5E9",
  "#EAB308",
] as const;
