"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import {
  DashboardSkeleton,
  SkillDetailSkeleton,
  SkillsListSkeleton,
} from "@/components/shared/page-skeletons";
import { useTrackerStore } from "@/store/tracker-store";

/** Ensures the mock store is seeded once on the client. */
export function TrackerProvider({ children }: { children: ReactNode }) {
  const hydrate = useTrackerStore((s) => s.hydrate);
  const hydrated = useTrackerStore((s) => s.hydrated);
  const pathname = usePathname();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) {
    if (pathname?.startsWith("/skills/") && pathname !== "/skills") {
      return <SkillDetailSkeleton />;
    }
    if (pathname === "/skills") {
      return <SkillsListSkeleton />;
    }
    return <DashboardSkeleton />;
  }

  return children;
}
