"use client";

import type { ReactNode } from "react";

import { TopBar } from "@/components/layout/top-bar";
import { TrackerProvider } from "@/components/providers/tracker-provider";
import { usePathname } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import { isAppChromePath } from "@/lib/app-paths";

/**
 * App chrome lives here (root layout) so TopBar / store survive locale
 * switches. Pages under `[locale]` still swap; chrome does not remount.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const path = pathnameWithoutLocale(pathname);

  if (!isAppChromePath(path)) {
    return children;
  }

  return (
    <TrackerProvider>
      <TopBar />
      <div className="flex flex-1 flex-col bg-bg-primary">{children}</div>
    </TrackerProvider>
  );
}
