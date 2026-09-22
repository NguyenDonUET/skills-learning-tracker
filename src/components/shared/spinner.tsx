import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** Inline spinner for buttons / pending API actions. */
export function Spinner({
  className,
  label,
}: {
  className?: string;
  /** Accessible name when used alone (icon buttons). */
  label?: string;
}) {
  return (
    <Loader2
      className={cn("size-4 animate-spin", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "status" : undefined}
    />
  );
}
