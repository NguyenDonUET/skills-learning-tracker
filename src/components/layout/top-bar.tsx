"use client";

import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, usePathname } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import { cn } from "@/lib/utils";

export function TopBar() {
  const t = useTranslations("Nav");
  const pathname = pathnameWithoutLocale(usePathname() ?? "/");

  const navLinks = [
    { href: "/dashboard" as const, label: t("dashboard") },
    { href: "/skills" as const, label: t("skills") },
  ];

  return (
    <header className="border-border-subtle sticky top-0 z-40 border-b bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <Link
            href="/dashboard"
            className="font-heading hidden shrink-0 text-base font-semibold text-text-primary sm:inline"
          >
            {t("brand")}
          </Link>
          <nav className="flex items-center gap-1" aria-label={t("main")}>
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center rounded-md px-2.5 text-sm font-medium sm:px-3",
                    active
                      ? "bg-accent-subtle text-accent"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Avatar className="size-9">
            <AvatarFallback className="bg-accent-subtle text-sm font-medium text-accent">
              G
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
