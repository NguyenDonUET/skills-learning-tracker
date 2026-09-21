import { ProgressRing } from "@/components/shared/progress-ring";
import type { GoalPace } from "@/lib/goals";
import { formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";

type SkillGoalCardProps = {
  pace: GoalPace;
  progress: number;
  color: string;
  goalType: "weekly" | "total";
};

const STATUS_CLASS: Record<GoalPace["status"], string> = {
  ahead: "text-success",
  "on-track": "text-accent",
  behind: "text-warning",
  complete: "text-success",
};

export function SkillGoalCard({
  pace,
  progress,
  color,
  goalType,
}: SkillGoalCardProps) {
  const percent = Math.round(progress * 100);

  return (
    <section
      aria-label="Goal progress"
      className="bg-surface flex flex-col gap-4 rounded-xl border border-border-subtle p-5 shadow-sm sm:flex-row sm:items-center sm:gap-8 sm:p-6"
    >
      <ProgressRing progress={progress} size={112} strokeWidth={10} color={color}>
        <div className="text-center">
          <p className="font-heading text-xl font-bold text-text-primary">
            {percent}%
          </p>
          <p className="text-[0.65rem] text-text-tertiary">
            {goalType === "weekly" ? "this week" : "of goal"}
          </p>
        </div>
      </ProgressRing>

      <div className="min-w-0 flex-1 space-y-2">
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          {goalType === "weekly" ? "Weekly goal" : "Total hours goal"}
        </h2>
        <p className="font-heading text-2xl font-bold text-text-primary">
          {formatHours(pace.loggedHours)}
          <span className="text-base font-medium text-text-tertiary">
            {" "}
            / {formatHours(pace.targetHours)}h
          </span>
        </p>
        <p className={cn("text-sm font-medium", STATUS_CLASS[pace.status])}>
          {pace.label}
        </p>
      </div>
    </section>
  );
}
