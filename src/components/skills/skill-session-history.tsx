"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { LogSessionDialog } from "@/components/dashboard/log-session-dialog";
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
      aria-label="Session history"
      className="bg-surface flex flex-col rounded-xl border border-border-subtle p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          Session history
        </h2>
        <span className="text-xs text-text-tertiary">
          {sorted.length} total
        </span>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          className="py-6"
          title="No sessions logged yet"
          description={`Start practicing ${skillName} and log your first session.`}
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
                    {formatShortDate(session.date)}
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
                    No notes
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-11 sm:size-8"
                  aria-label="Edit session"
                  onClick={() => setEditId(session.id)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-11 text-error sm:size-8"
                  aria-label="Delete session"
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
