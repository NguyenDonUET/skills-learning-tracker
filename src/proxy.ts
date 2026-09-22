import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const localePattern = routing.locales.join("|");

/** Authenticated app routes — guest lives under `/guest` and stays public. */
const isProtectedRoute = createRouteMatcher([
  `/(${localePattern})/dashboard(.*)`,
  `/(${localePattern})/skills(.*)`,
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  // Keep Clerk on /api for auth(), but never locale-prefix API routes
  // (next-intl would otherwise rewrite /api/skills → /en/api/skills → 404).
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
