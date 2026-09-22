"use client";

import { useEffect, type ReactNode } from "react";

import {
  DashboardSkeleton,
  SkillDetailSkeleton,
  SkillsListSkeleton,
} from "@/components/shared/page-skeletons";
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
  const storeMode = useTrackerStore((s) => s.mode);
  const pathname = stripGuestPrefix(
    pathnameWithoutLocale(usePathname() ?? "/"),
  );

  useEffect(() => {
    void hydrate(mode);
  }, [hydrate, mode]);

  const ready = hydrated && storeMode === mode;

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
