"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { prefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type ProgressRingProps = {
  /** 0–1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  /** Accessible name, e.g. "Spanish progress: 75% of goal". */
  label?: string;
  children?: ReactNode;
};

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  color = "var(--color-progress)",
  className,
  label,
  children,
}: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const [value, setValue] = useState(clamped);
  const [motion, setMotion] = useState(false);
  const intro = useRef(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      intro.current = true;
      setMotion(false);
      setValue(clamped);
      return;
    }

    if (!intro.current) {
      intro.current = true;
      setMotion(false);
      setValue(0);
      const id = requestAnimationFrame(() => {
        setMotion(true);
        setValue(clamped);
      });
      return () => cancelAnimationFrame(id);
    }

    setMotion(true);
    setValue(clamped);
  }, [clamped]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const shown = Math.min(1, Math.max(0, value));
  const offset = circumference * (1 - shown);
  const percent = Math.round(clamped * 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
      aria-valuenow={label ? percent : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: motion
              ? "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
