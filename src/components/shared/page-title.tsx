"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/** Unique document title for the current view. */
export function PageTitle({ title }: { title: string }) {
  const t = useTranslations("Meta");
  const full = `${title} — ${t("title")}`;

  useEffect(() => {
    const apply = () => {
      if (document.title !== full) document.title = full;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [full]);

  return null;
}
