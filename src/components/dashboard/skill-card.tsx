import Link from "next/link";

import { ProgressRing } from "@/components/shared/progress-ring";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { StreakBadge } from "@/components/shared/streak-badge";
import { formatHours } from "@/lib/format";
import type { SkillSummary } from "@/types/skill";

type SkillCardProps = {
  summary: SkillSummary;
};

export function SkillCard({ summary }: SkillCardProps) {
  const { skill, totalHours, currentStreak, streakStatus, goalProgress } = summary;

  return (
    <article className="bg-surface shadow-sm hover:shadow-md flex h-full flex-col gap-4 rounded-xl border border-border-subtle p-5 transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading flex min-w-0 items-center gap-2 text-lg font-medium text-text-primary">
          <SkillColorDot color={skill.color} />
          <Link href={`/skills/${skill.id}`} className="truncate hover:underline">
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
          >
            <span className="font-heading text-sm font-semibold text-text-primary">
              {Math.round(goalProgress * 100)}%
            </span>
          </ProgressRing>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-heading text-2xl font-bold text-text-primary">
            {formatHours(totalHours)}
            <span className="ml-1 text-sm font-medium text-text-tertiary">
              hrs
            </span>
          </p>
          <StreakBadge days={currentStreak} status={streakStatus} size="sm" />
        </div>
      </div>
    </article>
  );
}
