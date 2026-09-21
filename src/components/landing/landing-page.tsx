import Link from "next/link";
import {
  Flame,
  Layers,
  NotebookPen,
  Target,
} from "lucide-react";

import { ProductShowcase } from "@/components/landing/product-showcase";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Flame,
    title: "Streaks that keep you honest",
    description:
      "Current and longest streaks per skill — plus a gentle nudge when today's practice is still open.",
  },
  {
    icon: Target,
    title: "Progress you can see",
    description:
      "Progress rings for weekly or total goals, hours-first when you're just exploring a skill.",
  },
  {
    icon: Layers,
    title: "Every skill in one place",
    description:
      "Juggle Spanish, guitar, and TypeScript on a single bento dashboard without hopping apps.",
  },
  {
    icon: NotebookPen,
    title: "Log a session in seconds",
    description:
      "Duration presets, flexible time input, optional notes — then watch the dashboard update instantly.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="bg-bg-primary relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,_var(--color-accent-subtle)_0%,_transparent_65%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-page items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-text-primary"
        >
          Skills Learning Tracker
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">Try as Guest</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Continue with Google</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="mx-auto grid w-full max-w-page items-center gap-12 px-6 pt-8 pb-16 lg:grid-cols-2 lg:gap-16 lg:pt-14 lg:pb-24">
          <div className="flex flex-col items-start text-left">
            <p className="font-heading mb-4 text-sm font-semibold tracking-wide text-accent uppercase">
              Skills Learning Tracker
            </p>
            <h1 className="font-heading max-w-xl text-3xl font-bold leading-tight text-text-primary">
              See every hour you&apos;ve invested in becoming better.
            </h1>
            <p className="mt-5 max-w-md text-base text-text-secondary sm:text-lg">
              Log practice, protect your streaks, and watch consistency show up
              as rings, hours, and a living heatmap — Strava for learning.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="min-h-11 px-5">
                <Link href="/dashboard">Continue with Google</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-h-11 px-5"
              >
                <Link href="/dashboard">Try as Guest</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-text-tertiary">
              Guest mode explores the full demo. Google sign-in wires up in a
              later phase.
            </p>
          </div>

          <ProductShowcase />
        </section>

        <section
          aria-labelledby="features-heading"
          className="border-border-subtle border-t bg-bg-secondary/60"
        >
          <div className="mx-auto w-full max-w-page px-6 py-16 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="features-heading"
                className="font-heading text-2xl font-bold text-text-primary sm:text-3xl"
              >
                Built for deliberate practice
              </h2>
              <p className="mt-3 text-base text-text-secondary">
                Motivating without guilt trips — clear proof that showing up
                compounds.
              </p>
            </div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="bg-surface flex flex-col gap-3 rounded-xl border border-border-subtle p-5 shadow-sm"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-text-primary">
                    {title}
                  </h3>
                  <p className="text-sm text-text-secondary">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-page px-6 py-16 text-center lg:py-20">
          <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
            Ready to make practice visible?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-text-secondary">
            Jump into the guest dashboard with sample skills and sessions — no
            account required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="min-h-11 px-5">
              <Link href="/dashboard">Try as Guest</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-11 px-5"
            >
              <Link href="/dashboard">Continue with Google</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-border-subtle relative z-10 border-t px-6 py-6 text-center text-xs text-text-tertiary">
        Skills Learning Tracker · Frontend Mentor Product Challenge
      </footer>
    </div>
  );
}
