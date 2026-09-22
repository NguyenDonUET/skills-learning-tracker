export type AppMode = "auth" | "guest";

export type AppLogicalPath =
  | "dashboard"
  | "skills"
  | `skills/${string}`;

/** Detect guest vs authenticated app chrome from a locale-stripped pathname. */
export function getAppMode(pathnameWithoutLocale: string): AppMode {
  if (
    pathnameWithoutLocale === "/guest" ||
    pathnameWithoutLocale.startsWith("/guest/")
  ) {
    return "guest";
  }
  return "auth";
}

/** Paths that show TopBar + TrackerProvider. */
export function isAppChromePath(pathnameWithoutLocale: string): boolean {
  const path = pathnameWithoutLocale;
  return (
    path === "/dashboard" ||
    path.startsWith("/skills") ||
    path === "/guest" ||
    path.startsWith("/guest/")
  );
}

/** Map a logical app path to the real href for the current mode. */
export function appHref(mode: AppMode, logical: AppLogicalPath): string {
  if (mode === "guest") {
    if (logical === "dashboard") return "/guest";
    return `/guest/${logical}`;
  }
  if (logical === "dashboard") return "/dashboard";
  return `/${logical}`;
}

/** Strip `/guest` prefix so skeleton routing can reuse auth checks. */
export function stripGuestPrefix(pathnameWithoutLocale: string): string {
  if (pathnameWithoutLocale === "/guest") return "/dashboard";
  if (pathnameWithoutLocale.startsWith("/guest/")) {
    return pathnameWithoutLocale.slice("/guest".length) || "/dashboard";
  }
  return pathnameWithoutLocale;
}
