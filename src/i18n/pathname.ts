import { routing } from "@/i18n/routing";

/**
 * Strip a leading `/en` or `/vi` segment. next-intl's `usePathname` can briefly
 * return an unstripped path when the URL locale updates before `useLocale()`.
 */
export function pathnameWithoutLocale(pathname: string): string {
  const path = pathname || "/";
  for (const locale of routing.locales) {
    if (path === `/${locale}` || path === `/${locale}/`) return "/";
    if (path.startsWith(`/${locale}/`)) {
      return path.slice(locale.length + 1) || "/";
    }
  }
  return path;
}
