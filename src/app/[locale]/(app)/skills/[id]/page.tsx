"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { SkillDetailView } from "@/components/skills/skill-detail-view";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function SkillDetailPage() {
  const t = useTranslations("Skills");
  const params = useParams<{ id: string }>();
  const { summaries } = useDashboardData();
  const summary = summaries.find((s) => s.skill.id === params.id);

  if (!summary) {
    return (
      <div className="mx-auto flex w-full max-w-detail flex-col items-start gap-4 px-4 py-16 sm:px-6">
        <p className="text-text-secondary">{t("notFound")}</p>
        <Button asChild variant="outline">
          <Link href="/skills">{t("backToSkills")}</Link>
        </Button>
      </div>
    );
  }

  return <SkillDetailView summary={summary} />;
}
