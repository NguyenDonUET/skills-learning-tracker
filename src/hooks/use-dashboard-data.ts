"use client";

import { useMemo } from "react";

import { todayDateString } from "@/lib/dates";
import { buildHeatmap, HEATMAP_WEEKS } from "@/lib/heatmap";
import {
  buildOverallStats,
  buildRecentSessions,
  buildSkillSummaries,
  pickFeaturedSkill,
} from "@/lib/stats";
import { useTrackerStore } from "@/store/tracker-store";

export function useDashboardData() {
  const skills = useTrackerStore((s) => s.skills);
  const sessions = useTrackerStore((s) => s.sessions);

  return useMemo(() => {
    const today = todayDateString();
    const summaries = buildSkillSummaries(skills, sessions, today);
    const featured = pickFeaturedSkill(summaries, sessions);
    const others = featured
      ? summaries.filter((s) => s.skill.id !== featured.skill.id)
      : summaries;
    const overall = buildOverallStats(sessions, today);
    const recentSessions = buildRecentSessions(skills, sessions, 5);
    const skillNameById = Object.fromEntries(skills.map((s) => [s.id, s.name]));
    const heatmap = buildHeatmap(sessions, skillNameById, {
      weeks: HEATMAP_WEEKS,
      today,
    });

    return {
      skills,
      sessions,
      summaries,
      featured,
      others,
      overall,
      recentSessions,
      heatmap,
      empty: skills.length === 0,
    };
  }, [skills, sessions]);
}
