"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { FeaturedSkillCard } from "@/components/dashboard/featured-skill-card";
import { LogSessionDialog } from "@/components/dashboard/log-session-dialog";
import { OverallStats } from "@/components/dashboard/overall-stats";
import { PracticeHeatmap } from "@/components/dashboard/practice-heatmap";
import { RecentSessions } from "@/components/dashboard/recent-sessions";
import { SkillCard } from "@/components/dashboard/skill-card";
import { SkillFormDialog } from "@/components/skills/skill-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { todayDateString } from "@/lib/dates";
import { buildHeatmap } from "@/lib/heatmap";

export function DashboardView() {
  const t = useTranslations("Dashboard");
  const {
    skills,
    sessions,
    featured,
    others,
    overall,
    recentSessions,
    heatmap,
    empty,
  } = useDashboardData();

  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  const filteredHeatmap = useMemo(() => {
    if (!skillFilter) return heatmap;
    const skillNameById = Object.fromEntries(skills.map((s) => [s.id, s.name]));
    return buildHeatmap(sessions, skillNameById, {
      weeks: 18,
      today: todayDateString(),
      skillId: skillFilter,
    });
  }, [heatmap, skillFilter, skills, sessions]);

  if (empty) {
    return (
      <div className="mx-auto flex w-full max-w-page flex-col px-4 py-8 sm:px-6">
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <SkillFormDialog
              trigger={
                <Button size="lg">
                  <Plus className="size-4" />
                  {t("addSkill")}
                </Button>
              }
            />
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>
        </div>
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          <SkillFormDialog
            trigger={
              <Button type="button" variant="outline" size="lg">
                <Plus className="size-4" />
                {t("addSkill")}
              </Button>
            }
          />
          <LogSessionDialog />
        </div>
      </div>

      <OverallStats {...overall} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        {featured ? (
          <div className="md:col-span-2 lg:col-span-4 lg:row-span-2">
            <FeaturedSkillCard summary={featured} />
          </div>
        ) : null}

        {others.slice(0, 2).map((summary) => (
          <div key={summary.skill.id} className="lg:col-span-2">
            <SkillCard summary={summary} />
          </div>
        ))}

        {others.slice(2).map((summary) => (
          <div key={summary.skill.id} className="md:col-span-1 lg:col-span-2">
            <SkillCard summary={summary} />
          </div>
        ))}
      </div>

      <PracticeHeatmap
        data={filteredHeatmap}
        skills={skills.map((s) => ({
          id: s.id,
          name: s.name,
          color: s.color,
        }))}
        skillFilter={skillFilter}
        onSkillFilterChange={setSkillFilter}
      />

      <div className="max-w-2xl">
        <RecentSessions sessions={recentSessions} />
      </div>

      <LogSessionDialog fab />
    </div>
  );
}
