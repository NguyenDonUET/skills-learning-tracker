"use client";

import { useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";

type StreakBadgeProps = {
  days: number;
  status?: "active" | "at-risk" | "broken";
  size?: "sm" | "md" | "lg";
  /** Included in the accessible name when the skill isn't already in the text. */
  skillName?: string;
  /** Announce day changes to assistive tech. Use on the primary dashboard streak. */
  announce?: boolean;
  className?: string;
};

export function StreakBadge({
  days,
  status = "active",
  size = "md",
  skillName,
  announce = false,
  className,
}: StreakBadgeProps) {
  const t = useTranslations("Streak");
  const shown = Math.round(useAnimatedNumber(days));
  const label =
    shown === 1 ? t("oneDay") : shown === 0 ? t("none") : t("days", { count: shown });
  const statusText =
    status === "at-risk"
      ? t("atRisk")
      : status === "broken"
        ? t("brokenStatus")
        : t("active");
  const ariaLabel = skillName
    ? t("ariaWithSkill", { skill: skillName, label, status: statusText })
    : t("aria", { label, status: statusText });

  const previous = useRef(days);
  const [pulse, setPulse] = useState(false);
  const [live, setLive] = useState("");

  useEffect(() => {
    if (days > previous.current) {
      setPulse(true);
      if (announce) setLive(ariaLabel);
      const id = window.setTimeout(() => setPulse(false), 700);
      previous.current = days;
      return () => window.clearTimeout(id);
    }
    if (announce && previous.current !== days) setLive(ariaLabel);
    previous.current = days;
  }, [announce, ariaLabel, days]);

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
      title={status === "at-risk" ? t("atRisk") : statusText}
      aria-label={ariaLabel}
    >
      <Flame
        className={cn(
          size === "sm" && "size-3.5",
          size === "md" && "size-4",
          size === "lg" && "size-5",
          status === "broken" && "opacity-40",
          status === "at-risk" && "opacity-70",
          pulse && "streak-pulse",
        )}
        aria-hidden
      />
      <span>{label}</span>
      {announce ? (
        <span className="sr-only" aria-live="polite">
          {live}
        </span>
      ) : null}
    </span>
  );
}
