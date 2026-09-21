"use client";

import { create } from "zustand";

import { todayDateString } from "@/lib/dates";
import {
  SKILL_COLORS,
  shiftSampleData,
} from "@/lib/stats";
import type { Session, Skill, SkillGoal } from "@/types/skill";

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

type CreateSkillInput = {
  name: string;
  color?: string;
  goal?: SkillGoal;
};

type UpdateSkillInput = {
  name?: string;
  color?: string;
  goal?: SkillGoal;
};

type CreateSessionInput = {
  skillId: string;
  durationMinutes: number;
  date?: string;
  notes?: string | null;
};

type UpdateSessionInput = {
  skillId?: string;
  durationMinutes?: number;
  date?: string;
  notes?: string | null;
};

type TrackerState = {
  skills: Skill[];
  sessions: Session[];
  hydrated: boolean;
  hydrate: () => void;
  addSkill: (input: CreateSkillInput) => Skill;
  updateSkill: (id: string, input: UpdateSkillInput) => void;
  deleteSkill: (id: string) => void;
  addSession: (input: CreateSessionInput) => Session;
  updateSession: (id: string, input: UpdateSessionInput) => void;
  deleteSession: (id: string) => void;
};

const seed = () => shiftSampleData(todayDateString());

export const useTrackerStore = create<TrackerState>((set, get) => ({
  skills: [],
  sessions: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const data = seed();
    set({ skills: data.skills, sessions: data.sessions, hydrated: true });
  },

  addSkill: (input) => {
    const used = new Set(get().skills.map((s) => s.color));
    const color =
      input.color ??
      SKILL_COLORS.find((c) => !used.has(c)) ??
      SKILL_COLORS[0];
    const skill: Skill = {
      id: uid("skill"),
      name: input.name.trim(),
      color,
      goal: input.goal ?? null,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ skills: [...s.skills, skill] }));
    return skill;
  },

  updateSkill: (id, input) => {
    set((s) => ({
      skills: s.skills.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              name: input.name?.trim() ?? skill.name,
              color: input.color ?? skill.color,
              goal: input.goal === undefined ? skill.goal : input.goal,
            }
          : skill,
      ),
    }));
  },

  deleteSkill: (id) => {
    set((s) => ({
      skills: s.skills.filter((skill) => skill.id !== id),
      sessions: s.sessions.filter((session) => session.skillId !== id),
    }));
  },

  addSession: (input) => {
    const session: Session = {
      id: uid("s"),
      skillId: input.skillId,
      durationMinutes: input.durationMinutes,
      date: input.date ?? todayDateString(),
      notes: input.notes?.trim() ? input.notes.trim() : null,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ sessions: [...s.sessions, session] }));
    return session;
  },

  updateSession: (id, input) => {
    set((s) => ({
      sessions: s.sessions.map((session) =>
        session.id === id
          ? {
              ...session,
              skillId: input.skillId ?? session.skillId,
              durationMinutes:
                input.durationMinutes ?? session.durationMinutes,
              date: input.date ?? session.date,
              notes:
                input.notes === undefined
                  ? session.notes
                  : input.notes?.trim()
                    ? input.notes.trim()
                    : null,
            }
          : session,
      ),
    }));
  },

  deleteSession: (id) => {
    set((s) => ({
      sessions: s.sessions.filter((session) => session.id !== id),
    }));
  },
}));
