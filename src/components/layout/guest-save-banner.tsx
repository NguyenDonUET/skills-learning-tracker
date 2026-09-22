"use client";

import { SignInButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAppMode } from "@/hooks/use-app-mode";

/** Gentle prompt shown only in guest mode — data is not saved. */
export function GuestSaveBanner() {
  const { isGuest } = useAppMode();
  const t = useTranslations("Guest");

  if (!isGuest) return null;

  return (
    <div className="border-border-subtle border-b bg-accent-subtle/60">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <p className="text-sm text-text-secondary">{t("savePrompt")}</p>
        <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
          <Button size="sm" variant="outline">
            {t("signInToSave")}
          </Button>
        </SignInButton>
      </div>
    </div>
  );
}
