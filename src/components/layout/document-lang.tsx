"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Keep `<html lang>` in sync when locale changes without remounting root layout. */
export function DocumentLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
