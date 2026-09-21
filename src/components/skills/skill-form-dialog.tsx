"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKILL_COLORS } from "@/lib/stats";
import { useTrackerStore } from "@/store/tracker-store";
import type { Skill, SkillGoal } from "@/types/skill";
import { cn } from "@/lib/utils";

type SkillFormDialogProps = {
  skill?: Skill | null;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SkillFormDialog({
  skill = null,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: SkillFormDialogProps) {
  const addSkill = useTrackerStore((s) => s.addSkill);
  const updateSkill = useTrackerStore((s) => s.updateSkill);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(SKILL_COLORS[0]);
  const [goalEnabled, setGoalEnabled] = useState(false);
  const [goalType, setGoalType] = useState<"weekly" | "total">("weekly");
  const [goalHours, setGoalHours] = useState("5");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (skill) {
      setName(skill.name);
      setColor(skill.color);
      setGoalEnabled(Boolean(skill.goal));
      setGoalType(skill.goal?.type ?? "weekly");
      setGoalHours(String(skill.goal?.targetHours ?? 5));
    } else {
      setName("");
      setColor(SKILL_COLORS[0]);
      setGoalEnabled(false);
      setGoalType("weekly");
      setGoalHours("5");
    }
    setError(null);
  }, [open, skill]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }

    let goal: SkillGoal = null;
    if (goalEnabled) {
      const hours = Number(goalHours);
      if (!Number.isFinite(hours) || hours <= 0) {
        setError("Goal hours must be a positive number");
        return;
      }
      goal = { type: goalType, targetHours: hours };
    }

    if (skill) {
      updateSkill(skill.id, { name: trimmed, color, goal });
    } else {
      addSkill({ name: trimmed, color, goal });
    }
    setOpen(false);
  }

  const isEdit = Boolean(skill);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && controlledOpen === undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit skill" : "Add a skill"}</DialogTitle>
          <DialogDescription>
            Track anything you&apos;re practicing — languages, instruments, code.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Name</Label>
            <Input
              id="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Spanish, Guitar, TypeScript…"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-9 rounded-full border-2 transition-transform",
                    color === c
                      ? "border-text-primary scale-110"
                      : "border-transparent",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={goalEnabled}
                onChange={(e) => setGoalEnabled(e.target.checked)}
                className="size-4 accent-[var(--color-accent)]"
              />
              Set a practice goal
            </label>
            {goalEnabled ? (
              <div className="flex flex-wrap gap-3">
                <Select
                  value={goalType}
                  onValueChange={(value) =>
                    setGoalType(value as "weekly" | "total")
                  }
                >
                  <SelectTrigger className="w-40" aria-label="Goal type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Hours / week</SelectItem>
                    <SelectItem value="total">Total hours</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  step={0.5}
                  className="w-28"
                  value={goalHours}
                  onChange={(e) => setGoalHours(e.target.value)}
                  aria-label="Target hours"
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            {isEdit ? "Save changes" : "Add skill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
