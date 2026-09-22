"use client";

import { Flame, Clock, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";

import { AnimatedValue } from "@/components/shared/animated-value";
import { StreakBadge } from "@/components/shared/streak-badge";
import { formatHours } from "@/lib/format";

type OverallStatsProps = {
  totalHours: number;
  sessionCount: number;
  currentStreak: number;
  streakStatus: "active" | "at-risk" | "broken";
};

export function OverallStats({
  totalHours,
  sessionCount,
  currentStreak,
  streakStatus,
}: OverallStatsProps) {
  const t = useTranslations("Dashboard");

  return (
    <section
      aria-label={t("overallProgress")}
      className="bg-surface shadow-sm grid grid-cols-3 gap-3 rounded-xl border border-border-subtle p-4 sm:gap-6 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary">
          <Flame className="size-3.5 text-streak" aria-hidden />
          {t("streak")}
        </span>
        <StreakBadge
          days={currentStreak}
          status={streakStatus}
          size="lg"
          announce
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary">
          <Clock className="size-3.5" aria-hidden />
          {t("totalHoursLabel")}
        </span>
        <p className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
          <AnimatedValue value={totalHours} format={formatHours} />
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary">
          <ListChecks className="size-3.5" aria-hidden />
          {t("sessions")}
        </span>
        <p className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
          <AnimatedValue value={sessionCount} />
        </p>
      </div>
    </section>
  );
}
