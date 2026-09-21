"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { pathnameWithoutLocale } from "@/i18n/pathname";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const nextPathname = useNextPathname();
  const router = useRouter();

  const href = pathnameWithoutLocale(nextPathname ?? "/");
  const activeIndex = Math.max(0, routing.locales.indexOf(locale as AppLocale));

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "relative inline-grid h-9 grid-cols-2 items-center rounded-full bg-bg-secondary p-0.5",
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-surface absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {routing.locales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            className={cn(
              "relative z-10 inline-flex h-full min-w-9 items-center justify-center rounded-full px-2.5 text-xs font-semibold tracking-wide uppercase",
              active
                ? "text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            )}
            onClick={() => {
              if (active) return;
              router.replace(href, { locale: code as AppLocale });
            }}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
