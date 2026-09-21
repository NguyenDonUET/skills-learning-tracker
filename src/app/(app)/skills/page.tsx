"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { SkillFormDialog } from "@/components/skills/skill-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SkillColorDot } from "@/components/shared/skill-color-dot";
import { StreakBadge } from "@/components/shared/streak-badge";
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
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { formatHours } from "@/lib/format";
import { useTrackerStore } from "@/store/tracker-store";
import type { Skill } from "@/types/skill";

export default function SkillsPage() {
  const { summaries } = useDashboardData();
  const deleteSkill = useTrackerStore((s) => s.deleteSkill);

  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
            Skills
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage the skills you&apos;re tracking.
          </p>
        </div>
        <SkillFormDialog
          trigger={
            <Button size="lg">
              <Plus className="size-4" />
              Add skill
            </Button>
          }
        />
      </div>

      {summaries.length === 0 ? (
        <EmptyState
          className="bg-surface rounded-xl border border-border-subtle"
          title="No skills yet"
          description="Add your first skill to start tracking."
          action={
            <SkillFormDialog
              trigger={
                <Button size="lg">
                  <Plus className="size-4" />
                  Add skill
                </Button>
              }
            />
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary) => (
            <li
              key={summary.skill.id}
              className="bg-surface shadow-sm flex flex-col gap-3 rounded-xl border border-border-subtle p-5"
            >
              <div className="flex items-start gap-3">
                <Link
                  href={`/skills/${summary.skill.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <SkillColorDot color={summary.skill.color} size="md" />
                  <div className="min-w-0">
                    <p className="font-heading truncate text-lg font-medium text-text-primary">
                      {summary.skill.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {formatHours(summary.totalHours)} hrs ·{" "}
                      {summary.sessionCount} sessions
                    </p>
                  </div>
                </Link>
                <StreakBadge
                  days={summary.currentStreak}
                  status={summary.streakStatus}
                  size="sm"
                />
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-11 flex-1 sm:min-h-8"
                  onClick={() => setEditSkill(summary.skill)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-error min-h-11 flex-1 sm:min-h-8"
                  onClick={() => setDeleteTarget(summary.skill)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SkillFormDialog
        skill={editSkill}
        open={Boolean(editSkill)}
        onOpenChange={(next) => {
          if (!next) setEditSkill(null);
        }}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the skill and all of its sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleteTarget) deleteSkill(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete skill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
