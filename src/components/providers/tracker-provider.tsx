"use client";

import { useEffect, type ReactNode } from "react";

import {
  DashboardSkeleton,
  SkillDetailSkeleton,
  SkillsListSkeleton,
} from "@/components/shared/page-skeletons";
import { usePathname } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import { stripGuestPrefix } from "@/lib/app-paths";
import { useTrackerStore } from "@/store/tracker-store";

/** Ensures the mock store is seeded once on the client. */
export function TrackerProvider({ children }: { children: ReactNode }) {
  const hydrate = useTrackerStore((s) => s.hydrate);
  const hydrated = useTrackerStore((s) => s.hydrated);
  const pathname = stripGuestPrefix(
    pathnameWithoutLocale(usePathname() ?? "/"),
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
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
