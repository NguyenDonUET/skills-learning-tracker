"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { SkillDetailView } from "@/components/skills/skill-detail-view";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function SkillDetailPage() {
  const params = useParams<{ id: string }>();
  const { summaries } = useDashboardData();
  const summary = summaries.find((s) => s.skill.id === params.id);

  if (!summary) {
    return (
      <div className="mx-auto flex w-full max-w-detail flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <p className="text-text-secondary">Skill not found.</p>
        <Button asChild variant="outline">
          <Link href="/skills">Back to skills</Link>
        </Button>
      </div>
    );
  }

  return <SkillDetailView summary={summary} />;
}
