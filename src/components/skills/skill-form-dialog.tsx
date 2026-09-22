"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Spinner } from "@/components/shared/spinner";
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
import { cn } from "@/lib/utils";
import { useTrackerStore } from "@/store/tracker-store";
import type { Skill, SkillGoal } from "@/types/skill";

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
  const t = useTranslations("SkillForm");
  const tCommon = useTranslations("Common");
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
  const [saving, setSaving] = useState(false);

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
    setSaving(false);
  }, [open, skill]);

  async function handleSave() {
    if (saving) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("nameRequired"));
      return;
    }

    let goal: SkillGoal = null;
    if (goalEnabled) {
      const hours = Number(goalHours);
      if (!Number.isFinite(hours) || hours <= 0) {
        setError(t("goalHoursPositive"));
        return;
      }
      goal = { type: goalType, targetHours: hours };
    }

    setSaving(true);
    try {
      if (skill) {
        await updateSkill(skill.id, { name: trimmed, color, goal });
      } else {
        await addSkill({ name: trimmed, color, goal });
      }
      setOpen(false);
    } catch {
      // Store already toasted; keep dialog open for retry
    } finally {
      setSaving(false);
    }
  }

  const isEdit = Boolean(skill);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (saving) return;
        setOpen(next);
      }}
    >
      {trigger && controlledOpen === undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <fieldset
          disabled={saving}
          className="flex flex-col gap-4 border-0 p-0 py-1"
        >
          <div className="space-y-2">
            <Label htmlFor="skill-name">{t("name")}</Label>
            <Input
              id="skill-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("color")}</Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={t("colorAria", { color: c })}
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
              {t("setGoal")}
            </label>
            {goalEnabled ? (
              <div className="flex flex-wrap gap-3">
                <Select
                  value={goalType}
                  onValueChange={(value) =>
                    setGoalType(value as "weekly" | "total")
                  }
                >
                  <SelectTrigger className="w-40" aria-label={t("goalType")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">{t("hoursPerWeek")}</SelectItem>
                    <SelectItem value="total">{t("totalHours")}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  step={0.5}
                  className="w-28"
                  value={goalHours}
                  onChange={(e) => setGoalHours(e.target.value)}
                  aria-label={t("targetHours")}
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
        </fieldset>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            aria-busy={saving}
          >
            {saving ? <Spinner /> : null}
            {saving
              ? tCommon("saving")
              : isEdit
                ? t("saveChanges")
                : t("addSkill")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
