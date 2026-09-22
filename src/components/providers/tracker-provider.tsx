"use client";

import { useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/shared/empty-state";
import {
  DashboardSkeleton,
  SkillDetailSkeleton,
  SkillsListSkeleton,
} from "@/components/shared/page-skeletons";
import { Button } from "@/components/ui/button";
import { useAppMode } from "@/hooks/use-app-mode";
import { usePathname } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import { stripGuestPrefix } from "@/lib/app-paths";
import { useTrackerStore } from "@/store/tracker-store";

/** Hydrates guest mock data or auth API data for app chrome routes. */
export function TrackerProvider({ children }: { children: ReactNode }) {
  const { mode } = useAppMode();
  const hydrate = useTrackerStore((s) => s.hydrate);
  const hydrated = useTrackerStore((s) => s.hydrated);
  const hydrateError = useTrackerStore((s) => s.hydrateError);
  const storeMode = useTrackerStore((s) => s.mode);
  const pathname = stripGuestPrefix(
    pathnameWithoutLocale(usePathname() ?? "/"),
  );

  useEffect(() => {
    void hydrate(mode);
  }, [hydrate, mode]);

  const ready = hydrated && storeMode === mode;

  if (ready && hydrateError) {
    return (
      <LoadError
        onRetry={() => {
          useTrackerStore.setState({ hydrated: false, hydrateError: null });
          void hydrate(mode);
        }}
      />
    );
  }

  if (!ready) {
    if (pathname.startsWith("/skills/") && pathname !== "/skills") {
      return <SkillDetailSkeleton />;
    }
    if (pathname === "/skills") {
      return <SkillsListSkeleton />;
    }
    return <DashboardSkeleton />;
  }

  return children;
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("Common");

  return (
        <div role="alert" className="mx-auto flex w-full max-w-page flex-col px-4 py-8">
      <EmptyState
        title={t("loadErrorTitle")}
        description={t("loadErrorDescription")}
        action={
          <Button type="button" size="lg" onClick={onRetry}>
            {t("retry")}
          </Button>
        }
      />
    </div>
  );
}
