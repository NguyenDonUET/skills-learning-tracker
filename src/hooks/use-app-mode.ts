"use client";

import { usePathname } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import {
  appHref,
  getAppMode,
  type AppLogicalPath,
  type AppMode,
} from "@/lib/app-paths";

export function useAppMode(): {
  mode: AppMode;
  isGuest: boolean;
  href: (logical: AppLogicalPath) => string;
} {
  const pathname = pathnameWithoutLocale(usePathname() ?? "/");
  const mode = getAppMode(pathname);

  return {
    mode,
    isGuest: mode === "guest",
    href: (logical) => appHref(mode, logical),
  };
}
