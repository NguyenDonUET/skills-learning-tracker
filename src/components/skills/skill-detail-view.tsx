"use client";

import { useMemo } from "react";
import { Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { PracticeHeatmap } from "@/components/dashboard/practice-heatmap";
import { LogSessionDialog } from "@/components/dashboard/log-session-dialog";
import { SkillFormDialog } from "@/components/skills/skill-form-dialog";
import { SkillGoalCard } from "@/components/skills/skill-goal-card";
import { SkillSessionHistory } from "@/components/skills/skill-session-history";
import { SkillTrends } from "@/components/skills/skill-trends";
import { EmptyState } from "@/components/shared/empty-state";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { StreakBadge } from "@/components/shared/streak-badge";
import { Button } from "@/components/ui/button";
import { useAppMode } from "@/hooks/use-app-mode";
import { Link } from "@/i18n/navigation";
import { todayDateString } from "@/lib/dates";
import { formatDuration, formatHours } from "@/lib/format";
import { goalPace } from "@/lib/goals";
import { buildHeatmap, HEATMAP_WEEKS } from "@/lib/heatmap";
import { averageSessionMinutes, weeklyHoursTrend } from "@/lib/trends";
import { useTrackerStore } from "@/store/tracker-store";
import type { SkillSummary } from "@/types/skill";

type SkillDetailViewProps = {
  summary: SkillSummary;
};

export function SkillDetailView({ summary }: SkillDetailViewProps) {
  const t = useTranslations("Skills");
  const locale = useLocale();
  const { href } = useAppMode();
  const sessions = useTrackerStore((s) => s.sessions);
  const { skill } = summary;
  const today = todayDateString();

  const skillSessions = useMemo(
    () => sessions.filter((s) => s.skillId === skill.id),
    [sessions, skill.id],
  );

  const heatmap = useMemo(
    () =>
      buildHeatmap(
        skillSessions,
        { [skill.id]: skill.name },
        { weeks: HEATMAP_WEEKS, today, skillId: skill.id },
      ),
    [skillSessions, skill.id, skill.name, today],
  );

  const pace = useMemo(
    () => goalPace(skill, sessions, today),
    [skill, sessions, today],
  );

  const trends = useMemo(
    () => weeklyHoursTrend(sessions, skill.id, 8, today, locale),
    [sessions, skill.id, today, locale],
  );

  const avgMinutes = useMemo(
    () => averageSessionMinutes(sessions, skill.id),
    [sessions, skill.id],
  );

  return (
    <div className="mx-auto flex w-full max-w-detail flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button variant="ghost" asChild className="w-fit px-0">
        <Link href={href("dashboard")}>{t("backToDashboard")}</Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <SkillColorDot color={skill.color} size="lg" />
            <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
              {skill.name}
            </h1>
            <StreakBadge
              days={summary.currentStreak}
              status={summary.streakStatus}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <SkillFormDialog
            skill={skill}
            trigger={
              <Button type="button" variant="outline" size="lg">
                <Pencil className="size-4" />
                {t("editSkill")}
              </Button>
            }
          />
          <LogSessionDialog
            defaultSkillId={skill.id}
            triggerClassName="min-h-11"
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label={t("statHours")} value={formatHours(summary.totalHours)} />
        <Stat label={t("statSessions")} value={String(summary.sessionCount)} />
        <Stat
          label={t("statCurrentStreak")}
          value={String(summary.currentStreak)}
        />
        <Stat
          label={t("statLongestStreak")}
          value={String(summary.longestStreak)}
        />
        <Stat
          label={t("statAvgSession")}
          value={avgMinutes == null ? "—" : formatDuration(avgMinutes)}
        />
      </dl>

      {pace && summary.goalProgress != null && skill.goal ? (
        <SkillGoalCard
          pace={pace}
          progress={summary.goalProgress}
          color={skill.color}
          goalType={skill.goal.type}
        />
      ) : null}

      {skillSessions.length === 0 ? (
        <EmptyState
          className="bg-surface rounded-xl border border-border-subtle"
          title={t("emptySessionsTitle")}
          description={t("emptySessionsDescription")}
          action={
            <LogSessionDialog
              defaultSkillId={skill.id}
              triggerClassName="min-h-11"
            />
          }
        />
      ) : (
        <>
          <PracticeHeatmap data={heatmap} />
          <SkillTrends weeks={trends} accentColor={skill.color} />
          <SkillSessionHistory
            sessions={skillSessions}
            skillName={skill.name}
          />
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-xl border border-border-subtle px-4 py-3 shadow-sm">
      <dt className="text-xs text-text-tertiary">{label}</dt>
      <dd className="font-heading mt-1 text-xl font-bold text-text-primary">
        {value}
      </dd>
    </div>
  );
}
