"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { LogSessionDialog } from "@/components/dashboard/log-session-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { Button } from "@/components/ui/button";
import { formatDuration, formatShortDate } from "@/lib/format";
import { useTrackerStore } from "@/store/tracker-store";
import type { RecentSessionItem } from "@/types/skill";

type RecentSessionsProps = {
  sessions: RecentSessionItem[];
};

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const t = useTranslations("Recent");
  const locale = useLocale();
  const allSessions = useTrackerStore((s) => s.sessions);
  const deleteSession = useTrackerStore((s) => s.deleteSession);

  const [editId, setEditId] = useState<string | null>(null);

  const editSession = allSessions.find((s) => s.id === editId) ?? null;

  return (
    <section
      aria-label={t("aria")}
      className="bg-surface shadow-sm flex flex-col rounded-xl border border-border-subtle p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          {t("title")}
        </h2>
        <span className="text-xs text-text-tertiary">{t("last5")}</span>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          className="py-6"
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <ul className="divide-border-subtle flex flex-col divide-y">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex gap-3 py-3 first:pt-0 last:pb-0"
            >
              <SkillColorDot
                color={session.skillColor}
                className="mt-1.5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="text-sm font-medium text-text-primary">
                    {session.skillName}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {formatShortDate(session.date, locale)} ·{" "}
                    {formatDuration(session.durationMinutes)}
                  </p>
                </div>
                {session.notes ? (
                  <p className="mt-0.5 line-clamp-1 text-sm text-text-secondary">
                    {session.notes}
                  </p>
                ) : null}
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-11 text-error sm:size-8"
                  aria-label={t("deleteSession")}
                  onClick={() => deleteSession(session.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
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
