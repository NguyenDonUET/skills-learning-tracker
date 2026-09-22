"use client";

import { create } from "zustand";
import { toast } from "sonner";

import type { AppMode } from "@/lib/app-paths";
import { todayDateString } from "@/lib/dates";
import { SKILL_COLORS, shiftSampleData } from "@/lib/stats";
import * as api from "@/lib/tracker-api";
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
  mode: AppMode | null;
  skills: Skill[];
  sessions: Session[];
  hydrated: boolean;
  hydrateError: string | null;
  /** Theme from DB for signed-in users (guest uses localStorage only). */
  remoteTheme: string | null;
  hydrate: (mode: AppMode) => Promise<void>;
  addSkill: (input: CreateSkillInput) => Promise<Skill>;
  updateSkill: (id: string, input: UpdateSkillInput) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addSession: (input: CreateSessionInput) => Promise<Session>;
  updateSession: (id: string, input: UpdateSessionInput) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
};

const seed = () => shiftSampleData(todayDateString());

function isGuest(mode: AppMode | null) {
  return mode === "guest";
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  mode: null,
  skills: [],
  sessions: [],
  hydrated: false,
  hydrateError: null,
  remoteTheme: null,

  hydrate: async (mode) => {
    const current = get();
    if (current.hydrated && current.mode === mode) return;

    set({
      mode,
      hydrated: false,
      hydrateError: null,
      skills: [],
      sessions: [],
      remoteTheme: null,
    });

    if (isGuest(mode)) {
      const data = seed();
      set({
        skills: data.skills,
        sessions: data.sessions,
        hydrated: true,
      });
      return;
    }

    try {
      const summary = await api.fetchSummary();
      set({
        skills: summary.skills,
        sessions: summary.sessions,
        remoteTheme: summary.preferences.theme,
        hydrated: true,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load data";
      set({ hydrateError: message, hydrated: true, skills: [], sessions: [] });
      toast.error(message);
    }
  },

  addSkill: async (input) => {
    const mode = get().mode;

    if (isGuest(mode)) {
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
    }

    try {
      const skill = await api.createSkill({
        name: input.name.trim(),
        color: input.color,
        goal: input.goal ?? null,
      });
      set((s) => ({ skills: [...s.skills, skill] }));
      return skill;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create skill";
      toast.error(message);
      throw error;
    }
  },

  updateSkill: async (id, input) => {
    const mode = get().mode;

    if (isGuest(mode)) {
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
      return;
    }

    const previous = get().skills;
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

    try {
      const skill = await api.patchSkill(id, input);
      set((s) => ({
        skills: s.skills.map((item) => (item.id === id ? skill : item)),
      }));
    } catch (error) {
      set({ skills: previous });
      const message =
        error instanceof Error ? error.message : "Could not update skill";
      toast.error(message);
      throw error;
    }
  },

  deleteSkill: async (id) => {
    const mode = get().mode;
    const previousSkills = get().skills;
    const previousSessions = get().sessions;

    set((s) => ({
      skills: s.skills.filter((skill) => skill.id !== id),
      sessions: s.sessions.filter((session) => session.skillId !== id),
    }));

    if (isGuest(mode)) return;

    try {
      await api.removeSkill(id);
    } catch (error) {
      set({ skills: previousSkills, sessions: previousSessions });
      const message =
        error instanceof Error ? error.message : "Could not delete skill";
      toast.error(message);
      throw error;
    }
  },

  addSession: async (input) => {
    const mode = get().mode;
    const optimistic: Session = {
      id: uid("s"),
      skillId: input.skillId,
      durationMinutes: input.durationMinutes,
      date: input.date ?? todayDateString(),
      notes: input.notes?.trim() ? input.notes.trim() : null,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ sessions: [...s.sessions, optimistic] }));

    if (isGuest(mode)) {
      return optimistic;
    }

    try {
      const session = await api.createSession({
        skillId: input.skillId,
        durationMinutes: input.durationMinutes,
        date: input.date,
        notes: input.notes,
      });
      set((s) => ({
        sessions: s.sessions.map((item) =>
          item.id === optimistic.id ? session : item,
        ),
      }));
      return session;
    } catch (error) {
      set((s) => ({
        sessions: s.sessions.filter((item) => item.id !== optimistic.id),
      }));
      const message =
        error instanceof Error ? error.message : "Could not save session";
      toast.error(message);
      throw error;
    }
  },

  updateSession: async (id, input) => {
    const mode = get().mode;
    const previous = get().sessions;

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

    if (isGuest(mode)) return;

    try {
      const session = await api.patchSession(id, input);
      set((s) => ({
        sessions: s.sessions.map((item) => (item.id === id ? session : item)),
      }));
    } catch (error) {
      set({ sessions: previous });
      const message =
        error instanceof Error ? error.message : "Could not update session";
      toast.error(message);
      throw error;
    }
  },

  deleteSession: async (id) => {
    const mode = get().mode;
    const previous = get().sessions;

    set((s) => ({
      sessions: s.sessions.filter((session) => session.id !== id),
    }));

    if (isGuest(mode)) return;

    try {
      await api.removeSession(id);
    } catch (error) {
      set({ sessions: previous });
      const message =
        error instanceof Error ? error.message : "Could not delete session";
      toast.error(message);
      throw error;
    }
  },
}));
