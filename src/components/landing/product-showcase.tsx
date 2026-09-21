"use client";

import { useTranslations } from "next-intl";

import {
  HeatmapCell,
  HEATMAP_LEVEL_CLASS,
} from "@/components/shared/heatmap-cell";
import { ProgressRing } from "@/components/shared/progress-ring";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { StreakBadge } from "@/components/shared/streak-badge";
import type { HeatmapLevel } from "@/lib/heatmap";
import { cn } from "@/lib/utils";

/** Deterministic decorative pattern for the landing showcase (12 weeks × 7). */
const SHOWCASE_LEVELS: HeatmapLevel[] = [
  0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 3, 1, 0, 0, 2, 1, 0, 1, 2, 0, 0, 3, 2, 1, 0, 1, 0,
  2, 3, 1, 0, 4, 2, 1, 0, 2, 3, 4, 1, 2, 0, 3, 2, 4, 3, 1, 2, 3, 4, 2, 3, 4, 3, 2,
  1, 4, 3, 4, 2, 3, 4, 3, 4, 2, 3, 4, 4, 3, 2, 4, 3, 4, 3, 4, 2, 3, 4, 4, 3, 4, 2,
  4, 3, 4,
];

const SHOWCASE_SKILLS = [
  { name: "Spanish", color: "#059669", hours: "47.5", progress: 0.75 },
  { name: "Guitar", color: "#7C3AED", hours: "32", progress: 0.55 },
  { name: "TypeScript", color: "#2563EB", hours: "18", progress: 0.4 },
] as const;

export function ProductShowcase() {
  const t = useTranslations("Landing");

  return (
    <div
      aria-hidden
      className="bg-surface shadow-lg relative mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-border-subtle p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-accent-subtle blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-heatmap-light/40 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-text-tertiary uppercase">
              {t("showcaseFeatured")}
            </p>
            <p className="font-heading mt-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <SkillColorDot color={SHOWCASE_SKILLS[0].color} size="md" />
              Spanish
            </p>
          </div>
          <StreakBadge days={12} status="active" size="sm" />
        </div>

        <div className="flex items-center gap-6">
          <ProgressRing
            progress={SHOWCASE_SKILLS[0].progress}
            size={112}
            strokeWidth={10}
            color={SHOWCASE_SKILLS[0].color}
          >
            <div className="text-center">
              <p className="font-heading text-xl font-bold text-text-primary">
                75%
              </p>
              <p className="text-[0.65rem] text-text-tertiary">
                {t("showcaseWeeklyGoal")}
              </p>
            </div>
          </ProgressRing>

          <div className="min-w-0 flex-1 space-y-3">
            {SHOWCASE_SKILLS.slice(1).map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-text-primary">
                  <SkillColorDot color={skill.color} />
                  <span className="truncate">{skill.name}</span>
                </span>
                <span className="font-heading shrink-0 text-sm font-semibold text-text-secondary">
                  {skill.hours}h
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-text-tertiary">
            {t("showcaseActivity")}
          </p>
          <div
            className="grid w-full max-w-xs gap-1"
            style={{
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gridTemplateRows: "repeat(7, auto)",
              gridAutoFlow: "column",
            }}
          >
            {SHOWCASE_LEVELS.map((level, index) => (
              <HeatmapCell
                key={index}
                level={level}
                tabIndex={-1}
                className="pointer-events-none"
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-1.5 text-xs text-text-tertiary">
            <span>{t("less")}</span>
            {([0, 1, 2, 3, 4] as HeatmapLevel[]).map((level) => (
              <span
                key={level}
                className={cn(
                  "size-2 rounded-xs",
                  HEATMAP_LEVEL_CLASS[level],
                )}
              />
            ))}
            <span>{t("more")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
