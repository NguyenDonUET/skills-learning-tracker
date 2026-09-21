"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  HeatmapCell,
  HEATMAP_LEVEL_CLASS,
} from "@/components/shared/heatmap-cell";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { formatDuration, formatShortDate } from "@/lib/format";
import {
  formatHeatmapMonthLabel,
  groupHeatmapByMonth,
  type HeatmapData,
  type HeatmapLevel,
} from "@/lib/heatmap";
import { cn } from "@/lib/utils";

const ALL_SKILLS = "all";

type SkillFilterOption = {
  id: string;
  name: string;
  color?: string;
};

type PracticeHeatmapProps = {
  data: HeatmapData;
  skillFilter?: string | null;
  skills?: SkillFilterOption[];
  onSkillFilterChange?: (skillId: string | null) => void;
};

export function PracticeHeatmap({
  data,
  skillFilter = null,
  skills = [],
  onSkillFilterChange,
}: PracticeHeatmapProps) {
  const t = useTranslations("Heatmap");
  const locale = useLocale();
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const allOption: SkillFilterOption = useMemo(
    () => ({ id: ALL_SKILLS, name: t("allSkills") }),
    [t],
  );

  const activeDay = useMemo(
    () => data.days.find((d) => d.date === activeDate) ?? null,
    [data.days, activeDate],
  );

  const monthGroups = useMemo(
    () => groupHeatmapByMonth(data.days),
    [data.days],
  );

  const filterItems = useMemo(
    () => [allOption, ...skills],
    [allOption, skills],
  );

  const selectedFilter = useMemo(
    () =>
      filterItems.find((s) => s.id === (skillFilter ?? ALL_SKILLS)) ??
      allOption,
    [filterItems, skillFilter, allOption],
  );

  return (
    <section
      aria-label={t("aria")}
      className="bg-surface flex flex-col gap-5 rounded-xl border border-border p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-text-primary">
          {t("title")}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {skills.length > 0 && onSkillFilterChange ? (
            <Combobox
              items={filterItems}
              value={selectedFilter}
              onValueChange={(skill) => {
                if (!skill || skill.id === ALL_SKILLS) {
                  onSkillFilterChange(null);
                  return;
                }
                onSkillFilterChange(skill.id);
              }}
              itemToStringLabel={(skill) => skill.name}
              isItemEqualToValue={(a, b) => a.id === b.id}
            >
              <ComboboxInput
                placeholder={t("allSkills")}
                aria-label={t("filterBySkill")}
                className="w-44"
              />
              <ComboboxContent>
                <ComboboxEmpty>{t("noSkillsFound")}</ComboboxEmpty>
                <ComboboxList>
                  {(skill) => (
                    <ComboboxItem key={skill.id} value={skill}>
                      {skill.color ? (
                        <SkillColorDot color={skill.color} />
                      ) : null}
                      {skill.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          ) : null}
          <p className="shrink-0 text-sm text-text-tertiary">
            {data.weeks >= 48
              ? t("pastYear")
              : t("lastWeeks", { weeks: data.weeks })}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          className="inline-flex flex-col gap-3"
          role="list"
          aria-label={t("gridAria")}
        >
          <div className="flex gap-3">
            {monthGroups.map((group) => (
              <div
                key={group.monthKey}
                className="flex flex-col items-stretch gap-2"
              >
                <div className="flex gap-1">
                  {group.weeks.map((week) => (
                    <div
                      key={week[0]?.date ?? group.monthKey}
                      className="flex flex-col gap-1"
                    >
                      {week.map((day) => (
                        <HeatmapCell
                          key={day.date}
                          role="listitem"
                          size="sm"
                          level={day.level}
                          isFuture={day.isFuture}
                          isToday={day.isToday}
                          onClick={() =>
                            setActiveDate((prev) =>
                              prev === day.date ? null : day.date,
                            )
                          }
                          title={`${day.date}: ${formatDuration(day.totalMinutes)}`}
                          aria-label={
                            day.isFuture
                              ? t("future", { date: day.date })
                              : t("dayAria", {
                                  date: day.date,
                                  duration: formatDuration(day.totalMinutes),
                                  count: day.sessionCount,
                                })
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <span className="text-center text-xs text-text-tertiary">
                  {formatHeatmapMonthLabel(group.monthKey, locale)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1.5 text-xs text-text-tertiary">
            <span>{t("less")}</span>
            {([0, 1, 2, 3, 4] as HeatmapLevel[]).map((level) => (
              <span
                key={level}
                className={cn("size-2.5 rounded-[3px]", HEATMAP_LEVEL_CLASS[level])}
              />
            ))}
            <span>{t("more")}</span>
          </div>
        </div>
      </div>

      {activeDay && !activeDay.isFuture ? (
        <div className="bg-bg-secondary rounded-lg border border-border-subtle px-4 py-3 text-sm">
          <p className="font-medium text-text-primary">
            {formatShortDate(activeDay.date, locale)}
          </p>
          <p className="mt-1 text-text-secondary">
            {activeDay.sessionCount === 0
              ? t("noPractice")
              : t("practiceSummary", {
                  duration: formatDuration(activeDay.totalMinutes),
                  count: activeDay.sessionCount,
                  sessionLabel:
                    activeDay.sessionCount === 1
                      ? t("session")
                      : t("sessions"),
                })}
          </p>
          {activeDay.skillNames.length > 0 ? (
            <p className="mt-0.5 text-text-tertiary">
              {activeDay.skillNames.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
