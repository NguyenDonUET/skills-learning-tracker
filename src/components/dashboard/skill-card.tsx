"use client";

import { useTranslations } from "next-intl";

import { AnimatedValue } from "@/components/shared/animated-value";
import { ProgressRing } from "@/components/shared/progress-ring";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { StreakBadge } from "@/components/shared/streak-badge";
import { useAppMode } from "@/hooks/use-app-mode";
import { Link } from "@/i18n/navigation";
import { formatHours } from "@/lib/format";
import type { SkillSummary } from "@/types/skill";

type SkillCardProps = {
  summary: SkillSummary;
};

export function SkillCard({ summary }: SkillCardProps) {
  const t = useTranslations("Dashboard");
  const { href } = useAppMode();
  const { skill, totalHours, currentStreak, streakStatus, goalProgress } = summary;

  return (
    <article className="bg-surface shadow-sm hover:shadow-md motion-safe:hover:z-10 motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.015] flex h-full flex-col gap-4 rounded-xl border border-border-subtle p-5 motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-out">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading flex min-w-0 items-center gap-2 text-lg font-medium text-text-primary">
          <SkillColorDot color={skill.color} />
          <Link
            href={href(`skills/${skill.id}`)}
            className="truncate hover:underline"
          >
            {skill.name}
          </Link>
        </h3>
      </div>

      <div className="flex flex-1 items-center gap-4">
        {goalProgress != null ? (
          <ProgressRing
            progress={goalProgress}
            size={72}
            strokeWidth={7}
            color={skill.color}
            label={t("progressAria", {
              name: skill.name,
              percent: Math.round(goalProgress * 100),
            })}
          >
            <span className="font-heading text-sm font-semibold text-text-primary">
              <AnimatedValue
                value={goalProgress * 100}
                format={(next) => `${Math.round(next)}%`}
              />
            </span>
          </ProgressRing>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-heading text-2xl font-bold text-text-primary">
            <AnimatedValue value={totalHours} format={formatHours} />
            <span className="ml-1 text-sm font-medium text-text-tertiary">
              {t("hrs")}
            </span>
          </p>
          <StreakBadge
            days={currentStreak}
            status={streakStatus}
            size="sm"
            skillName={skill.name}
          />
        </div>
      </div>
    </article>
  );
}
