"use client";

import { useMemo, useState } from "react";

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
import type { HeatmapData, HeatmapLevel } from "@/lib/heatmap";
import { cn } from "@/lib/utils";

const ALL_SKILLS = "all";

type SkillFilterOption = {
  id: string;
  name: string;
  color?: string;
};

const ALL_OPTION: SkillFilterOption = {
  id: ALL_SKILLS,
  name: "All skills",
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
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const activeDay = useMemo(
    () => data.days.find((d) => d.date === activeDate) ?? null,
    [data.days, activeDate],
  );

  const filterItems = useMemo(
    () => [ALL_OPTION, ...skills],
    [skills],
  );

  const selectedFilter = useMemo(
    () =>
      filterItems.find((s) => s.id === (skillFilter ?? ALL_SKILLS)) ??
      ALL_OPTION,
    [filterItems, skillFilter],
  );

  return (
    <section
      aria-label="Practice activity"
      className="bg-surface flex flex-col gap-5 rounded-xl border border-border p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-text-primary">
          Practice Activity
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
                placeholder="All skills"
                aria-label="Filter by skill"
                className="w-44"
              />
              <ComboboxContent>
                <ComboboxEmpty>No skills found.</ComboboxEmpty>
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
            Last {data.weeks} weeks
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid w-full max-w-md gap-1"
          style={{
            gridTemplateColumns: `repeat(${data.weeks}, minmax(0, 1fr))`,
            gridTemplateRows: "repeat(7, auto)",
            gridAutoFlow: "column",
          }}
          role="list"
          aria-label="Heatmap of practice activity"
        >
          {data.days.map((day) => (
            <HeatmapCell
              key={day.date}
              role="listitem"
              level={day.level}
              isFuture={day.isFuture}
              isToday={day.isToday}
              onClick={() =>
                setActiveDate((prev) => (prev === day.date ? null : day.date))
              }
              title={`${day.date}: ${formatDuration(day.totalMinutes)}`}
              aria-label={
                day.isFuture
                  ? `${day.date}, future`
                  : `${day.date}, ${formatDuration(day.totalMinutes)}, ${day.sessionCount} sessions`
              }
            />
          ))}
        </div>
      </div>

      {activeDay && !activeDay.isFuture ? (
        <div className="bg-bg-secondary rounded-lg border border-border-subtle px-4 py-3 text-sm">
          <p className="font-medium text-text-primary">
            {formatShortDate(activeDay.date)}
          </p>
          <p className="mt-1 text-text-secondary">
            {activeDay.sessionCount === 0
              ? "No practice"
              : `${formatDuration(activeDay.totalMinutes)} · ${activeDay.sessionCount} session${activeDay.sessionCount === 1 ? "" : "s"}`}
          </p>
          {activeDay.skillNames.length > 0 ? (
            <p className="mt-0.5 text-text-tertiary">
              {activeDay.skillNames.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-1.5 text-xs text-text-tertiary">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as HeatmapLevel[]).map((level) => (
          <span
            key={level}
            className={cn(
              "size-2.5 rounded-xs",
              HEATMAP_LEVEL_CLASS[level],
            )}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
