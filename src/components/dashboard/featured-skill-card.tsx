"use client";

import { useTranslations } from "next-intl";

import { ProgressRing } from "@/components/shared/progress-ring";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { StreakBadge } from "@/components/shared/streak-badge";
import { Link } from "@/i18n/navigation";
import type { SkillSummary } from "@/types/skill";
import { formatHours } from "@/lib/format";

type FeaturedSkillCardProps = {
  summary: SkillSummary;
};

export function FeaturedSkillCard({ summary }: FeaturedSkillCardProps) {
  const t = useTranslations("Dashboard");
  const { skill, totalHours, currentStreak, streakStatus, goalProgress, sessionCount } =
    summary;
  const percent =
    goalProgress != null ? Math.round(goalProgress * 100) : null;

  return (
    <article className="bg-surface shadow-md flex h-full flex-col gap-6 rounded-xl border border-border-subtle p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-text-tertiary uppercase">
            {t("featuredSkill")}
          </p>
          <h2 className="font-heading mt-1 flex items-center gap-2 text-xl font-semibold text-text-primary">
            <SkillColorDot color={skill.color} size="md" />
            <Link
              href={`/skills/${skill.id}`}
              className="truncate hover:underline"
            >
              {skill.name}
            </Link>
          </h2>
        </div>
        <StreakBadge days={currentStreak} status={streakStatus} size="md" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
        {goalProgress != null ? (
          <ProgressRing
            progress={goalProgress}
            size={140}
            strokeWidth={12}
            color={skill.color}
          >
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-text-primary">
                {percent}%
              </p>
              <p className="text-xs text-text-tertiary">
                {skill.goal?.type === "weekly" ? t("ofWeeklyGoal") : t("ofGoal")}
              </p>
            </div>
          </ProgressRing>
        ) : (
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-text-primary">
              {formatHours(totalHours)}
            </p>
            <p className="text-sm text-text-secondary">{t("totalHours")}</p>
          </div>
        )}

        <dl className="grid w-full max-w-xs grid-cols-2 gap-4 sm:w-auto">
          <div>
            <dt className="text-xs text-text-tertiary">{t("hours")}</dt>
            <dd className="font-heading text-2xl font-bold text-text-primary">
              {formatHours(totalHours)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-tertiary">{t("sessions")}</dt>
            <dd className="font-heading text-2xl font-bold text-text-primary">
              {sessionCount}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
