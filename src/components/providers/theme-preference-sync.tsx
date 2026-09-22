"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import { patchPreferences } from "@/lib/tracker-api";
import { useTrackerStore } from "@/store/tracker-store";

/**
 * Syncs theme for signed-in users: apply DB preference once on hydrate,
 * then PATCH /api/preferences when the user toggles theme.
 */
export function ThemePreferenceSync() {
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const remoteTheme = useTrackerStore((s) => s.remoteTheme);
  const mode = useTrackerStore((s) => s.mode);
  const appliedRemote = useRef<string | null>(null);
  const skipNextWrite = useRef(false);

  // Apply server preference once when auth data loads
  useEffect(() => {
    if (!isSignedIn || mode !== "auth" || !remoteTheme) return;
    if (appliedRemote.current === remoteTheme) return;
    if (theme === remoteTheme) {
      appliedRemote.current = remoteTheme;
      return;
    }
    skipNextWrite.current = true;
    appliedRemote.current = remoteTheme;
    setTheme(remoteTheme);
  }, [isSignedIn, mode, remoteTheme, setTheme, theme]);

  // Persist local theme changes for signed-in users
  useEffect(() => {
    if (!isSignedIn || mode !== "auth") return;
    if (!theme || theme === "system") return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    if (appliedRemote.current === null) return;
    if (theme === appliedRemote.current) return;

    const handle = window.setTimeout(() => {
      void patchPreferences(theme)
        .then((prefs) => {
          appliedRemote.current = prefs.theme;
          useTrackerStore.setState({ remoteTheme: prefs.theme });
        })
        .catch(() => {
          // Non-blocking — local theme still applies via next-themes
        });
    }, 400);

    return () => window.clearTimeout(handle);
  }, [isSignedIn, mode, theme]);

  return null;
}
