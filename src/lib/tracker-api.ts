import type { Session, Skill, SkillGoal } from "@/types/skill";

export type TrackerPreferences = {
  theme: string;
};

export type SummaryResponse = {
  skills: Skill[];
  sessions: Session[];
  preferences: TrackerPreferences;
  empty: boolean;
};

export class TrackerApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "TrackerApiError";
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;
  if (!response.ok) {
    throw new TrackerApiError(
      response.status,
      data.error ?? `Request failed (${response.status})`,
    );
  }
  return data;
}

export async function fetchSummary(): Promise<SummaryResponse> {
  const res = await fetch("/api/summary");
  return parseJson<SummaryResponse>(res);
}

export async function createSkill(input: {
  name: string;
  color?: string;
  goal?: SkillGoal;
}): Promise<Skill> {
  const res = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ skill: Skill }>(res);
  return data.skill;
}

export async function patchSkill(
  id: string,
  input: { name?: string; color?: string; goal?: SkillGoal },
): Promise<Skill> {
  const res = await fetch(`/api/skills/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ skill: Skill }>(res);
  return data.skill;
}

export async function removeSkill(id: string): Promise<void> {
  const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
  await parseJson(res);
}

export async function createSession(input: {
  skillId: string;
  durationMinutes: number;
  date?: string;
  notes?: string | null;
}): Promise<Session> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ session: Session }>(res);
  return data.session;
}

export async function patchSession(
  id: string,
  input: {
    skillId?: string;
    durationMinutes?: number;
    date?: string;
    notes?: string | null;
  },
): Promise<Session> {
  const res = await fetch(`/api/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ session: Session }>(res);
  return data.session;
}

export async function removeSession(id: string): Promise<void> {
  const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
  await parseJson(res);
}

export async function patchPreferences(theme: string): Promise<TrackerPreferences> {
  const res = await fetch("/api/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  });
  const data = await parseJson<{ preferences: TrackerPreferences }>(res);
  return data.preferences;
}
