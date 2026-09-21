import { cn } from "@/lib/utils";
import type { WeekBucket } from "@/lib/trends";

type SkillTrendsProps = {
  weeks: WeekBucket[];
  accentColor: string;
  className?: string;
};

export function SkillTrends({ weeks, accentColor, className }: SkillTrendsProps) {
  const maxHours = Math.max(...weeks.map((w) => w.hours), 0.1);

  return (
    <section
      aria-label="Weekly practice trend"
      className={cn(
        "bg-surface flex flex-col gap-4 rounded-xl border border-border-subtle p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <div>
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          Weekly trend
        </h2>
        <p className="mt-0.5 text-sm text-text-tertiary">
          Hours practiced per week (last {weeks.length} weeks)
        </p>
      </div>

      <div className="flex h-36 items-end gap-1.5 sm:gap-2" role="img" aria-label="Bar chart of weekly hours">
        {weeks.map((week) => {
          const heightPct = Math.max(week.hours === 0 ? 4 : 8, (week.hours / maxHours) * 100);
          return (
            <div
              key={week.weekStart}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
            >
              <span className="text-[0.65rem] tabular-nums text-text-tertiary">
                {week.hours > 0 ? week.hours : ""}
              </span>
              <div
                className="w-full max-w-8 rounded-sm"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: accentColor,
                  opacity: week.hours === 0 ? 0.25 : 1,
                }}
                title={`${week.label}: ${week.hours}h`}
              />
              <span className="truncate text-[0.65rem] text-text-tertiary">
                {week.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
