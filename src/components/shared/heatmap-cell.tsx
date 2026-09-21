import type { ComponentProps } from "react";

import type { HeatmapLevel } from "@/lib/heatmap";
import { cn } from "@/lib/utils";

export const HEATMAP_LEVEL_CLASS: Record<HeatmapLevel, string> = {
  0: "bg-heatmap-empty",
  1: "bg-heatmap-light",
  2: "bg-heatmap-medium",
  3: "bg-heatmap-heavy",
  4: "bg-heatmap-max",
};

type HeatmapCellProps = {
  level: HeatmapLevel;
  isFuture?: boolean;
  isToday?: boolean;
  /** Fixed contribution-graph size vs fluid fill. */
  size?: "sm" | "fluid";
  className?: string;
} & Omit<ComponentProps<"button">, "type">;

export function HeatmapCell({
  level,
  isFuture = false,
  isToday = false,
  size = "fluid",
  className,
  disabled,
  ...props
}: HeatmapCellProps) {
  return (
    <button
      type="button"
      disabled={disabled ?? isFuture}
      className={cn(
        "rounded-[3px] transition-opacity",
        size === "sm" ? "size-3 shrink-0" : "aspect-square w-full",
        isFuture
          ? "cursor-default bg-heatmap-empty/40"
          : HEATMAP_LEVEL_CLASS[level],
        isToday &&
          (size === "sm"
            ? "ring-1 ring-accent ring-offset-1 ring-offset-surface"
            : "ring-2 ring-accent ring-offset-1 ring-offset-surface"),
        !isFuture &&
          "hover:opacity-80 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}
