"use client";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";

type AnimatedValueProps = {
  value: number;
  format?: (value: number) => string;
  className?: string;
};

export function AnimatedValue({
  value,
  format = (next) => String(Math.round(next)),
  className,
}: AnimatedValueProps) {
  const animated = useAnimatedNumber(value);

  return (
    <span className={cn("tabular-nums", className)}>{format(animated)}</span>
  );
}
