"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
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
import { Textarea } from "@/components/ui/textarea";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { todayDateString } from "@/lib/dates";
import { parseDuration, type DurationParseError } from "@/lib/duration";
import { formatDuration } from "@/lib/format";
import { useTrackerStore } from "@/store/tracker-store";
import type { Session } from "@/types/skill";

type LogSessionDialogProps = {
  triggerClassName?: string;
  fab?: boolean;
  /** Prefill when editing */
  session?: Session | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultSkillId?: string;
};

const PRESET_VALUES = [
  { key: "preset15" as const, value: "15" },
  { key: "preset30" as const, value: "30" },
  { key: "preset45" as const, value: "45" },
  { key: "preset1h" as const, value: "1h" },
];

const DURATION_ERROR_KEY: Record<DurationParseError, "enterDuration" | "tryFormat" | "durationMin"> = {
  empty: "enterDuration",
  format: "tryFormat",
  min: "durationMin",
};

export function LogSessionDialog({
  triggerClassName,
  fab = false,
  session = null,
  open: controlledOpen,
  onOpenChange,
  defaultSkillId,
}: LogSessionDialogProps) {
  const t = useTranslations("Session");
  const skills = useTrackerStore((s) => s.skills);
  const sessions = useTrackerStore((s) => s.sessions);
  const addSession = useTrackerStore((s) => s.addSession);
  const updateSession = useTrackerStore((s) => s.updateSession);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const lastSkillId = useMemo(() => {
    const sorted = [...sessions].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return sorted[0]?.skillId ?? skills[0]?.id ?? "";
  }, [sessions, skills]);

  const [skillId, setSkillId] = useState("");
  const [duration, setDuration] = useState("30");
  const [date, setDate] = useState(todayDateString());
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnLong, setWarnLong] = useState(false);

  const parsedDuration = useMemo(() => parseDuration(duration), [duration]);
  const durationPreview =
    parsedDuration.ok ? formatDuration(parsedDuration.minutes) : null;

  const selectedSkill = useMemo(
    () => skills.find((s) => s.id === skillId) ?? null,
    [skills, skillId],
  );

  useEffect(() => {
    if (!open) return;
    if (session) {
      setSkillId(session.skillId);
      setDuration(String(session.durationMinutes));
      setDate(session.date);
      setNotes(session.notes ?? "");
      setShowNotes(Boolean(session.notes));
    } else {
      setSkillId(defaultSkillId || lastSkillId);
      setDuration("30");
      setDate(todayDateString());
      setNotes("");
      setShowNotes(false);
    }
    setError(null);
    setWarnLong(false);
  }, [open, session, defaultSkillId, lastSkillId]);

  function handleSave() {
    const parsed = parseDuration(duration);
    if (!parsed.ok) {
      setError(t(DURATION_ERROR_KEY[parsed.error]));
      return;
    }
    if (!skillId) {
      setError(t("pickSkill"));
      return;
    }
    if (date > todayDateString()) {
      setError(t("dateFuture"));
      return;
    }

    setWarnLong(parsed.warnLong);

    if (session) {
      updateSession(session.id, {
        skillId,
        durationMinutes: parsed.minutes,
        date,
        notes,
      });
    } else {
      addSession({
        skillId,
        durationMinutes: parsed.minutes,
        date,
        notes,
      });
    }
    setOpen(false);
  }

  const trigger = fab ? (
    <Button
      type="button"
      size="lg"
      className={
        triggerClassName ??
        "fixed right-4 bottom-4 z-50 size-14 rounded-full shadow-lg sm:hidden"
      }
      aria-label={t("logSession")}
    >
      <Plus className="size-6" />
    </Button>
  ) : (
    <Button type="button" size="lg" className={triggerClassName}>
      <Plus className="size-4" />
      {t("logSession")}
    </Button>
  );

  const isEdit = Boolean(session);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && controlledOpen === undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editSession") : t("logASession")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="session-skill">{t("skill")}</Label>
            <Combobox
              items={skills}
              value={selectedSkill}
              onValueChange={(skill) => {
                setSkillId(skill?.id ?? "");
                setError(null);
              }}
              itemToStringLabel={(skill) => skill.name}
              isItemEqualToValue={(a, b) => a.id === b.id}
              disabled={skills.length === 0}
            >
              <ComboboxInput
                id="session-skill"
                placeholder={
                  skills.length === 0 ? t("addSkillFirst") : t("searchSkills")
                }
                className="w-full"
                disabled={skills.length === 0}
              />
              <ComboboxContent>
                <ComboboxEmpty>{t("noSkillsFound")}</ComboboxEmpty>
                <ComboboxList>
                  {(skill) => (
                    <ComboboxItem key={skill.id} value={skill}>
                      <SkillColorDot color={skill.color} />
                      {skill.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration">{t("duration")}</Label>
            <div className="relative">
              <Input
                id="session-duration"
                value={duration}
                onChange={(e) => {
                  const next = e.target.value;
                  setDuration(next);
                  setError(null);
                  const parsed = parseDuration(next);
                  setWarnLong(parsed.ok && parsed.warnLong);
                }}
                placeholder={t("durationPlaceholder")}
                autoComplete="off"
                aria-describedby="session-duration-hint"
                className="pr-16"
              />
              <span
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs font-medium text-text-tertiary tabular-nums"
                aria-live="polite"
              >
                {durationPreview ?? t("min")}
              </span>
            </div>
            <p id="session-duration-hint" className="text-xs text-text-tertiary">
              {t.rich("durationHint", {
                h: (chunks) => (
                  <span className="font-medium text-text-secondary">
                    {chunks}
                  </span>
                ),
                decimal: (chunks) => (
                  <span className="font-medium text-text-secondary">
                    {chunks}
                  </span>
                ),
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_VALUES.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  size="sm"
                  variant={duration === p.value ? "default" : "outline"}
                  onClick={() => {
                    setDuration(p.value);
                    setError(null);
                    setWarnLong(false);
                  }}
                >
                  {t(p.key)}
                </Button>
              ))}
            </div>
            {warnLong ? (
              <p className="text-xs text-warning">{t("warnLong")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-date">{t("date")}</Label>
            <DatePicker
              id="session-date"
              value={date}
              max={todayDateString()}
              onChange={setDate}
              placeholder={t("pickDate")}
            />
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="text-accent inline-flex h-11 items-center gap-1 text-sm font-medium"
              onClick={() => setShowNotes((v) => !v)}
            >
              <ChevronDown
                className={`size-4 transition-transform ${showNotes ? "rotate-180" : ""}`}
              />
              {showNotes ? t("hideNotes") : t("addNotes")}
            </button>
            {showNotes ? (
              <Textarea
                id="session-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
                rows={3}
              />
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={skills.length === 0}>
            {isEdit ? t("saveChanges") : t("saveSession")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
