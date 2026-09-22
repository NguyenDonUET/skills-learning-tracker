"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { GuestSaveBanner } from "@/components/layout/guest-save-banner";
import { TopBar } from "@/components/layout/top-bar";
import { ThemePreferenceSync } from "@/components/providers/theme-preference-sync";
import { TrackerProvider } from "@/components/providers/tracker-provider";
import { usePathname } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import { isAppChromePath } from "@/lib/app-paths";

/**
 * App chrome lives here (root layout) so TopBar / store survive locale
 * switches. Pages under `[locale]` still swap; chrome does not remount.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const path = pathnameWithoutLocale(pathname);

  if (!isAppChromePath(path)) {
    return children;
  }

  return (
    <TrackerProvider>
      <ThemePreferenceSync />
      <a
        href="#main-content"
        className="bg-surface text-text-primary sr-only rounded-md px-3 py-2 text-sm font-medium shadow-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        {t("skipToContent")}
      </a>
      <TopBar />
      <GuestSaveBanner />
      <main id="main-content" className="flex flex-1 flex-col bg-bg-primary">
        {children}
      </main>
    </TrackerProvider>
  );
}
