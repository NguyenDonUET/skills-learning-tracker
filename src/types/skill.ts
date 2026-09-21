export type SkillGoal = {
  type: "weekly" | "total";
  targetHours: number;
} | null;

export type Skill = {
  id: string;
  name: string;
  color: string;
  goal: SkillGoal;
  createdAt: string;
};

export type Session = {
  id: string;
  skillId: string;
  durationMinutes: number;
  date: string;
  notes: string | null;
  createdAt: string;
};

export type SkillSummary = {
  skill: Skill;
  totalHours: number;
  sessionCount: number;
  currentStreak: number;
  longestStreak: number;
  /** 0–1 progress toward goal when a goal exists */
  goalProgress: number | null;
  streakStatus: "active" | "at-risk" | "broken";
};

export type RecentSessionItem = {
  id: string;
  skillName: string;
  skillColor: string;
  durationMinutes: number;
  date: string;
  notes: string | null;
};
