import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

type StreakBadgeProps = {
  days: number;
  status?: "active" | "at-risk" | "broken";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function StreakBadge({
  days,
  status = "active",
  size = "md",
  className,
}: StreakBadgeProps) {
  const label =
    days === 1 ? "1-day streak" : days === 0 ? "No streak" : `${days}-day streak`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
        status === "active" && "text-streak",
        status === "at-risk" && "text-warning",
        status === "broken" && "text-text-tertiary",
        className,
      )}
      title={
        status === "at-risk"
          ? "Streak at risk — practice today to keep it alive"
          : undefined
      }
    >
      <Flame
        className={cn(
          size === "sm" && "size-3.5",
          size === "md" && "size-4",
          size === "lg" && "size-5",
          status === "broken" && "opacity-40",
          status === "at-risk" && "opacity-70",
        )}
        aria-hidden
      />
      <span>{label}</span>
    </span>
  );
}
