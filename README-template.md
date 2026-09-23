# Skills Learning Tracker — NguyenDonUET

A personal practice tracker where you log sessions, track streaks, and visualize your learning consistency through heatmaps and progress rings.

**Live URL:** Not deployed yet. Phase 9 (Vercel + Atlas + Clerk production env) is still pending. When it ships, submit the guest experience (`/guest`), not the landing page.

A product screenshot still needs to be captured and saved as `screenshot.png` next to this file.

---

## Overview

Skills Learning Tracker is a full-stack practice journal. You create skills (guitar, Spanish, TypeScript — anything), log sessions with a duration, date, and optional notes, and see consistency as streaks, SVG progress rings, and a 52-week practice heatmap.

The landing page offers two paths: **Continue with Google** (Clerk, Google OAuth only) into a private dashboard backed by MongoDB, and **Try as Guest** into a fully populated demo. Guest data is the sample set (6 skills, 47 sessions) with dates shifted so streaks look current. It lives only in the browser session and never writes to the database. A banner invites guests to sign in if they want to keep their changes.

The interface is bilingual (English and Vietnamese via `next-intl`, routes under `/en` and `/vi`) and supports light, dark, and system theme.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Database | MongoDB via Prisma 6 |
| Authentication | Clerk — Google OAuth only |
| Hosting | Planned: Vercel (not deployed yet) |
| Styling | Tailwind CSS v4 + shadcn/ui, brand tokens (Space Grotesk + Inter, emerald palette) |
| Other | Zustand, `next-intl` (en/vi), `next-themes`, `date-fns`, Sonner toasts, pnpm |

Domain math (streaks, heatmap levels, duration parsing, goal pace) lives in pure functions under `src/lib/`. The UI reads one Zustand store. Signed-in users hydrate that store from route handlers; guests hydrate it from `data/sample-skills.json`.

---

## Design Decisions

These are the product and design choices I made where the spec left room for interpretation.

### Dashboard & Progress Visualization

**The problem I was solving:**

The dashboard is where someone checks in every day. Skills, hours, streaks, a year of heatmap, and recent logs all compete for space. The layout has to feel motivating at a glance and still work for a brand-new user with one skill and a guest exploring six skills and months of history.

**My approach:**

A bento grid, with overall stats as a strip above the cards so the combined streak and hours are visible before any single skill.

- **Featured skill** gets the largest card (about two-thirds of the first row). It is always the skill practiced most recently, falling back to the skill with the most hours if there is no session yet. I did not add a pin — “what I just did” matches a daily check-in better than a manually chosen favorite.
- **Progress** is a ring when the skill has a weekly or total-hours goal, and a large hours figure when it does not. Smaller skill cards repeat the same pattern so goals and hour-only skills can sit next to each other without a second chart type.
- **Practice Activity** is its own full-width card under the grid: 52 weeks, month labels, intensity from brand thresholds (under 30m / 60m / 90m / 90m+). A skill filter switches the heatmap between all skills and one skill. Clicking or keyboard-focusing a day shows that day’s minutes, session count, and skills.
- **Recent sessions** are the last five, in a narrower column. Full history lives on the skill detail page.
- **What to practice next** is the streak badge. Active, at-risk (practiced yesterday, not yet today), and broken are explicit. At-risk is the nudge; there is no separate “recommended skill” engine.
- **Empty dashboard** is a single empty state with Add skill, not a grid of zeroed cards.

**Why I chose this approach:**

The featured card answers “where am I with the thing I touched last?” The heatmap answers “am I consistent?” Putting both on the dashboard, and keeping the session list short, avoids a page that is either a wall of equal cards or a stats spreadsheet. Rings only appear when a goal exists, so a skill without a target is not shown as 0% progress.

**What I'd do differently:**

Let someone pin a focus skill when “most recent” is not the one they care about. Add a compact “at risk” callout when the featured skill is fine but another streak is about to break. Cap how many small cards render on the dashboard once someone has many skills, and send the rest to the Skills page.

### Session Logging UX

**The problem I was solving:**

Logging is the action people repeat most. If it takes a detour through a form page, they stop. If it only captures a duration, the journal is useless later. The flow has to finish in well under 30 seconds and still feel like something happened.

**My approach:**

- **Entry point:** a Log session button in the dashboard header on larger screens, and a floating **+** on smaller ones. The same dialog opens from a skill detail page with that skill prefilled.
- **Shape:** a shadcn dialog, not a separate route. Skill is a searchable combobox. Duration defaults to 30 minutes, with presets for 15m, 30m, 45m, and 1h, plus free text (`45`, `1h 30m`, `1.5`, `90m`). A live preview shows how the input will be stored. Sessions over 8 hours warn but still save. Minimum is 1 minute.
- **Date:** defaults to today. Past dates are allowed for backfill; future dates are not. The common case never touches the picker.
- **Notes:** collapsed behind Add notes. The last skill used is the default the next time the dialog opens.
- **After save:** the dialog shows a short celebration (checkmark, skill name, duration, and a flame when the log keeps a streak alive), the dashboard numbers count up, and the store updates optimistically. If the API fails, the change rolls back and a toast explains the error. The save button stays disabled while a request is in flight. Deletes ask for confirmation.

**Why I chose this approach:**

A dialog keeps the person on the dashboard, which is the screen that should update. Presets cover the usual session lengths; the parser covers everything else without a slider that is fiddly for odd durations. Hiding notes keeps the fast path to two fields (skill is often already selected, duration is often a preset) while still allowing a reflection.

**What I'd do differently:**

The stretch session timer is not built. A timer that fills the duration field, alongside manual entry, would help people who start practice inside the app. I would also warn when today’s log looks like a duplicate of one just saved (same skill, same duration, same date), beyond disabling the button during the request.

### Other Design Choices

- **Navigation** is a thin top bar: product name, Dashboard, Skills, language, theme, and the Clerk user button (or a guest mark). Skill detail is a destination, not a third primary nav item.
- **Guest vs account** are separate trees (`/guest` is public; `/dashboard` and `/skills` require Clerk). Guest edits stay in memory. There is no silent merge of guest data into an account.
- **Streaks** use the local calendar date (`YYYY-MM-DD`), not UTC midnight, so “today” matches the person logging the session.
- **Dark mode** follows the system until toggled, then persists in `localStorage` for guests and on the user record for signed-in accounts.
- **Language** is detected on the first visit and can be switched from the landing page and the top bar. Copy is in message catalogs, not hardcoded in components.
- **Motion** (the chosen differentiator) is gated with `prefers-reduced-motion`: rings, count-ups, heatmap stagger, and the save celebration all fall back to instant updates.

---

## Development Journey

### Initial Approach vs. Final

The plan was locked before feature work: static UI first (design system, landing, bento dashboard, domain logic on a Zustand store seeded from the sample JSON), then Clerk, then Prisma/MongoDB behind the same store, then motion.

That order held. The UI contracts (featured skill, log dialog, heatmap, skill detail) were treated as frozen once the mock store could walk through the core flows. The backend swapped the data source instead of redesigning screens.

What changed in the UI itself: the heatmap grew from a shorter window to 52 weeks, grouped by month with fixed cell sizes, and the app gained English/Vietnamese after the first static pass. Session delete briefly shipped without a confirm dialog and was put back during the polish pass.

### Decisions Reconsidered

- **Heatmap length.** An 18-week strip was the first dashboard sketch. A year reads more like a practice journal and matches the guest dataset, so the default became 52 weeks with month columns so the grid stays readable.
- **Delete confirmation.** Skipping the confirm kept the log feeling fast, and it also made accidental deletes too easy. Deletes now confirm; creates stay optimistic and quick.
- **Theme toggle hydration.** A client-only theme read flashed the wrong theme on load. The toggle waits until the client theme is known.

### What Surprised Me

Date handling was the sharp edge: streaks, “at risk,” and the heatmap all depend on a local calendar day, and the guest sample has to be shifted relative to today or the demo looks abandoned. Getting that into pure functions early meant the API could return raw sessions and the client could keep computing the same summaries.

Internationalization landed as more than string replacement. Every new dialog, empty state, and aria label had to exist in both catalogs, which slowed polish and made missing keys obvious.

Clerk route protection plus a public guest tree was fussier than the happy-path sign-in. Guest had to reuse the same screens without ever calling Prisma.

### Session Breakdown

| Session | Focus | What I Accomplished |
|---------|-------|-------------------|
| 1 | Foundation (21 Sep) | Scaffolded Next.js, Tailwind v4, shadcn, and brand tokens. Built the landing page, app shell, bento dashboard, skill CRUD, log dialog, streaks, heatmap, skill detail, and dark mode on the mock store. |
| 2 | Heatmap and language (21 Sep) | Widened the heatmap to 52 weeks, grouped cells by month, fixed theme hydration, and added English and Vietnamese with `next-intl`. |
| 3 | Auth and guest (22 Sep) | Added Clerk (Google only), protected app routes, and a public `/guest` tree with the sample journal and a save banner. |
| 4 | Persistence (22 Sep) | Added the Prisma MongoDB schema, skills/sessions API, and wired the store to the API for signed-in users while guests stayed on the sample data. |
| 5 | Motion, a11y, errors (22 Sep) | Animated rings, streaks, and the heatmap; added the save celebration and delete confirms; mapped API failures to toasts; added skip link, landmarks, page titles, and heatmap keyboard navigation. |

---

## AI Collaboration Reflection

### How I Used AI

AI implemented inside a written build plan and locked decisions (stack, dashboard rules, log-dialog behavior, one differentiator). Specs, the brand kit, and `AGENTS.md` were the context for each phase. I used it most for boilerplate that had to stay consistent: shadcn composition, Prisma models, route handlers, and `next-intl` message wiring.

Judgment stayed on the product calls the spec refused to make: what the large card is, how long the heatmap is, whether notes start open, and which differentiator to build. I also reviewed generated UI against the brand tokens and the “do not hand-roll a second Button or Dialog” rule.

### What Worked Well

One phase per pass, with the acceptance criteria and the locked decision table in the prompt, beat an open “build the tracker” instruction. Pointing at existing `src/lib` calculators and telling the agent to swap the data source — not the components — kept the authenticated and guest dashboards on one view.

Small follow-up commits (date picker width, focus the delete action, heatmap keyboard) worked better than restating the whole feature.

### What I Learned

The plan document was the real prompt. When it said “featured skill = most recently practiced” and “notes collapsed,” the implementation matched. When a later doc (`docs/user-guide.md`) lagged the code, it described a guest-only build that no longer exists. Next time I would update the user-facing doc in the same change as the feature.

I would also ask for a browser pass on the log dialog and heatmap after each UI phase, not only at the end. Motion and focus bugs showed up in interaction, not in the diff.

### Where I Pushed Back

- Stack drift. Suggestions that reached for npm, a second state library, or a custom modal were rejected in favor of pnpm, Zustand, and shadcn.
- Redesigning the dashboard mid-backend. After the mock store worked, API work was not allowed to invent a new layout.
- Motion that ignores reduced motion. Animations shipped only with an instant fallback.
- Removing delete confirmation. That shortcut was reverted once it was clear a mis-click could drop a skill’s history (cascade delete removes every session for that skill).

---

## Differentiators

### Chosen Differentiator(s)

**1. Animated Progress & Micro-Interactions**

**Why I chose this:**

The product is a daily habit. The data is simple; the feeling of logging has to carry it. Motion is also visible on the guest demo, which is what a portfolio visitor actually sees.

**How it enhances the product:**

Rings ease from the previous value to the new one. Streak and stat numbers count instead of swapping. Heatmap cells stagger in. Saving a session holds a short celebration in the dialog (check, duration, streak flame when relevant) before the dashboard settles. Skill cards lift slightly on hover. `prefers-reduced-motion` turns all of that into instant state changes.

**Implementation highlights:**

Shared pieces — `ProgressRing`, `AnimatedValue`, and a reduced-motion hook — so dashboard cards, overall stats, and the log dialog do not each invent a timer. Hover and transform utilities are under `motion-safe:` so the fallback is the default CSS, not a broken animation.

**What I learned:**

The hard part is not the keyframe. It is keeping the animation tied to a real value change (optimistic update, then rollback) and not replaying it on every render. Reduced motion has to be decided before the first frame, or the “accessible” path still flashes.

A second differentiator was not taken. The session timer stretch goal is also deferred.

---

## Self-Assessment

Ratings are my read of the current local build. The app is not deployed, and Lighthouse has not been run.

| Category | Rating | Notes |
|----------|--------|-------|
| **Works for real users** — Deployed, functional end-to-end | 3/5 | Google sign-in, MongoDB persistence, and guest mode work locally. There is no public URL yet. |
| **Data visualization quality** — Progress rings, heatmap, streak indicators, aggregate stats | 4/5 | Rings, 52-week heatmap with day detail and skill filter, streak states, and overall hours/sessions. No weekly chart beyond the skill detail trend. |
| **Design-it-yourself features** — Quality and thoughtfulness of dashboard layout and session logging UX | 4/5 | Featured-skill bento and the preset dialog are deliberate. No pinned skill and no duplicate-log warning. |
| **Design quality** — Typography, spacing, visual hierarchy, bento grid polish | 4/5 | Brand type and emerald tokens, bento hierarchy, dark mode. Still room to tighten dense skill grids. |
| **Responsive design** — Fully functional and well-designed across devices | 3/5 | Layout stacks and the log action becomes a floating button. It was designed desktop-first; small screens are usable more than polished. |
| **Performance** — Fast load, smooth animations, efficient data queries | 3/5 | Skeletons and indexed session queries are in place. No production trace or Lighthouse number yet. |
| **Accessibility** — Keyboard nav, screen reader support, contrast, heatmap alternatives | 4/5 | Skip link, landmarks, page titles, dialog focus, heatmap keyboard navigation, reduced motion, text alternatives on the ring. Not a full screen-reader audit. |
| **Edge case handling** — Empty states, errors, loading, broken streaks, timezone handling | 4/5 | Empty dashboard, API error toasts, optimistic rollback, at-risk/broken streaks, local dates, long-session warning. Guest data disappears on refresh by design. |
| **Code quality** — Clean, maintainable, well-structured | 4/5 | UI, store, and pure `src/lib` calculators are split. `docs/user-guide.md` is behind the app. |
| **Landing page** — Compelling, communicates value, visually polished | 4/5 | Value line, feature highlights, product showcase, Google and guest CTAs, language and theme controls. |
| **Guest experience** — Immediately impressive, real data, full features | 4/5 | Sample journal with shifted dates, full dashboard, skills, and detail. Changes are not saved, and the banner says so. |

### Lighthouse Scores

Not run. The site is not deployed. Re-measure on the production guest URL.

| Category | Score |
|----------|-------|
| Performance | — |
| Accessibility | — |
| Best Practices | — |
| SEO | — |

### Strengths

The guest path shows a real practice journal on the first click, using the same dashboard as a signed-in user. Streaks, rings, and the heatmap are computed in one place, so logging a session updates every surface together. Motion is noticeable and still optional.

### Areas for Improvement

Deploy and run Lighthouse. Add a screenshot. Refresh the user guide so it describes Google sign-in and persisted data. Build the session timer, a duplicate-log hint, and a pinned featured skill. Give the heatmap and skill grid a dedicated pass on a narrow viewport.

---

## Known Limitations

- **Not deployed.** No live URL, production Clerk instance check, or Lighthouse scores yet.
- **No session timer.** Duration is typed or chosen from presets.
- **Guest edits are temporary.** Refresh or a new browser drops back to the shifted sample set. Guest data does not migrate into a Google account.
- **No pinned featured skill.** The large card follows the latest session.
- **No share cards, AI insights, or high-contrast / font-size preferences.** Those were the other differentiators and were not built.
- **Deleting a skill deletes its sessions** after confirmation. There is no archive or undo.
- **Screenshot missing.** `screenshot.png` is not in the repo yet.

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/NguyenDonUET/skills-learning-tracker.git
cd skills-learning-tracker

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in MongoDB and Clerk credentials

# Generate the Prisma client and push the schema
pnpm db:generate
pnpm db:push

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). **Try as Guest** needs no credentials. **Continue with Google** needs the Clerk and MongoDB variables below.

### Environment Variables

| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_APP_URL` | Public app origin. `http://localhost:3000` locally. |
| `MONGODB_URI` | MongoDB Atlas SRV URI, including the database name. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key. |
| `CLERK_SECRET_KEY` | Clerk secret key. Server only. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in path. Default `/sign-in`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up path. Default `/sign-up`. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post-login path. Default `/dashboard`. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post-signup path. Default `/dashboard`. |

Enable Google as the only Clerk social provider, and add the app origin to the allowed redirect URLs.

---

## Acknowledgments

Built as a [Frontend Mentor Product Challenge](https://www.frontendmentor.io).
