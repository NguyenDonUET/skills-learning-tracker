"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  const t = useTranslations("Loading");

  return (
    <div
      className="mx-auto flex w-full max-w-page flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8"
      aria-busy
      aria-label={t("dashboard")}
    >
      <div className="flex justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Skeleton className="h-56 rounded-xl md:col-span-2 lg:col-span-3" />
        <Skeleton className="h-56 rounded-xl md:col-span-2 lg:col-span-3" />
        <Skeleton className="h-32 rounded-xl lg:col-span-2" />
        <Skeleton className="h-32 rounded-xl lg:col-span-2" />
        <Skeleton className="h-32 rounded-xl lg:col-span-2" />
      </div>

      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-40 max-w-2xl rounded-xl" />
    </div>
  );
}

export function SkillsListSkeleton() {
  const t = useTranslations("Loading");

  return (
    <div
      className="mx-auto flex w-full max-w-page flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8"
      aria-busy
      aria-label={t("skills")}
    >
      <div className="flex justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SkillDetailSkeleton() {
  const t = useTranslations("Loading");

  return (
    <div
      className="mx-auto flex w-full max-w-detail flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8"
      aria-busy
      aria-label={t("skill")}
    >
      <Skeleton className="h-5 w-40" />
      <div className="flex justify-between gap-4">
        <Skeleton className="h-9 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-36 rounded-xl" />
    </div>
  );
}
