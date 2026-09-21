import { cn } from "@/lib/utils";

type SkillColorDotProps = {
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const SIZE_CLASS = {
  sm: "size-2.5",
  md: "size-3",
  lg: "size-3.5",
} as const;

export function SkillColorDot({
  color,
  size = "sm",
  className,
  label,
}: SkillColorDotProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        SIZE_CLASS[size],
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
