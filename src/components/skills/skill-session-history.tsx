"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { LogSessionDialog } from "@/components/dashboard/log-session-dialog";
import { DeleteSessionButton } from "@/components/shared/delete-session-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDuration, formatShortDate } from "@/lib/format";
import { useTrackerStore } from "@/store/tracker-store";
import type { Session } from "@/types/skill";

type SkillSessionHistoryProps = {
  sessions: Session[];
  skillName: string;
};

export function SkillSessionHistory({
  sessions,
  skillName,
}: SkillSessionHistoryProps) {
  const t = useTranslations("History");
  const locale = useLocale();
  const deleteSession = useTrackerStore((s) => s.deleteSession);
  const [editId, setEditId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [sessions],
  );

  const editSession = sessions.find((s) => s.id === editId) ?? null;

  return (
    <section
      aria-label={t("aria")}
      className="bg-surface flex flex-col rounded-xl border border-border-subtle p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          {t("title")}
        </h2>
        <span className="text-xs text-text-tertiary">
          {t("total", { count: sorted.length })}
        </span>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          className="py-6"
          title={t("emptyTitle")}
          description={t("emptyDescription", { skillName })}
        />
      ) : (
        <ul className="divide-border-subtle flex max-h-[28rem] flex-col divide-y overflow-y-auto">
          {sorted.map((session) => (
            <li
              key={session.id}
              className="flex gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="text-sm font-medium text-text-primary">
                    {formatShortDate(session.date, locale)}
                  </p>
                  <p className="text-xs tabular-nums text-text-tertiary">
                    {formatDuration(session.durationMinutes)}
                  </p>
                </div>
                {session.notes ? (
                  <p className="mt-0.5 line-clamp-2 text-sm text-text-secondary">
                    {session.notes}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-text-tertiary italic">
                    {t("noNotes")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-11 sm:size-8"
                  aria-label={t("editSession")}
                  onClick={() => setEditId(session.id)}
                >
                  <Pencil className="size-4" />
                </Button>
                <DeleteSessionButton
                  label={t("deleteSession")}
                  onDelete={() => deleteSession(session.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <LogSessionDialog
        session={editSession}
        open={Boolean(editId)}
        onOpenChange={(next) => {
          if (!next) setEditId(null);
        }}
      />
    </section>
  );
}
