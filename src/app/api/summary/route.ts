import { jsonError, requireDbUser } from "@/lib/api-auth";
import { toApiSession, toApiSkill } from "@/lib/api-mappers";
import { todayDateString } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { buildHeatmap, HEATMAP_WEEKS } from "@/lib/heatmap";
import {
  buildOverallStats,
  buildRecentSessions,
  buildSkillSummaries,
  pickFeaturedSkill,
} from "@/lib/stats";

/**
 * Dashboard summary: skills + sessions for the signed-in user, with
 * precomputed featured/overall/recent/heatmap payloads for the UI.
 */
export async function GET() {
  try {
    const user = await requireDbUser();

    const [dbSkills, dbSessions] = await Promise.all([
      prisma.skill.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      }),
      prisma.session.findMany({
        where: { userId: user.id },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    const skills = dbSkills.map(toApiSkill);
    const sessions = dbSessions.map(toApiSession);
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

    return Response.json({
      skills,
      sessions,
      summaries,
      featured,
      others,
      overall,
      recentSessions,
      heatmap,
      empty: skills.length === 0,
      preferences: { theme: user.theme },
    });
  } catch (error) {
    return jsonError(error);
  }
}
