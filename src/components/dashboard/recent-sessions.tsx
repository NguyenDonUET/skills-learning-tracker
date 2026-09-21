"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { LogSessionDialog } from "@/components/dashboard/log-session-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDuration, formatShortDate } from "@/lib/format";
import { useTrackerStore } from "@/store/tracker-store";
import type { RecentSessionItem } from "@/types/skill";

type RecentSessionsProps = {
  sessions: RecentSessionItem[];
};

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const allSessions = useTrackerStore((s) => s.sessions);
  const deleteSession = useTrackerStore((s) => s.deleteSession);

  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const editSession = allSessions.find((s) => s.id === editId) ?? null;

  return (
    <section
      aria-label="Recent sessions"
      className="bg-surface shadow-sm flex flex-col rounded-xl border border-border-subtle p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          Recent sessions
        </h2>
        <span className="text-xs text-text-tertiary">Last 5</span>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          className="py-6"
          title="No sessions yet"
          description="Log your first practice session to get started."
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
                    {formatShortDate(session.date)} ·{" "}
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
                  onClick={() => setDeleteId(session.id)}
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

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(next) => {
          if (!next) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the session from your log. Streaks and hours will
              update immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteId) deleteSession(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
