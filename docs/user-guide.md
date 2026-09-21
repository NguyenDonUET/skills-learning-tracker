# Skills Learning Tracker — User Guide

See every hour you’ve invested in becoming better. This guide explains how to use the app day to day.

> **Current build note:** The app runs in **guest / demo mode**. You get a full dashboard pre-loaded with sample skills and sessions. Changes you make stay in this browser session (they reset if you refresh or clear site data). Google sign-in and cloud save are coming in a later release.

---

## Getting started

1. Open the landing page.
2. Choose **Try as Guest** (or **Continue with Google** — same demo destination for now).
3. You’ll land on the **Dashboard** with sample practice data already filled in so you can explore immediately.

Use the top bar to move between **Dashboard** and **Skills**, toggle **light / dark mode**, or return to the dashboard via the product name.

---

## Dashboard

Your home base. At a glance you’ll see:

| Area | What it shows |
|------|----------------|
| **Featured skill** | The skill you practiced most recently — with a progress ring (if it has a goal), hours, and streak |
| **Other skill cards** | Compact stats for the rest of your skills |
| **Overall stats** | Combined hours, sessions, and streak across everything |
| **Practice Activity** | Heatmap of the last 18 weeks |
| **Recent sessions** | Your last 5 logs, with edit / delete |

### Log a session

1. Click **Log session** (or the floating **+** button on smaller screens).
2. Pick a **skill** (type to search).
3. Enter **duration** (see [Duration formats](#duration-formats) below).
4. Confirm the **date** (defaults to today; past dates are allowed).
5. Optionally open **Add notes** for a short reflection.
6. Click **Save session**.

The dashboard updates right away — hours, streaks, and the heatmap refresh immediately.

### Practice Activity heatmap

- Each square is one day. Darker green = more practice that day.
- Click a square to see that day’s total time, session count, and which skills you practiced.
- Use the skill filter to show activity for **one skill** or **All skills**.

---

## Duration formats

Bare numbers are **minutes**. You can also use hours explicitly.

| You type | Means |
|----------|--------|
| `45` | 45 minutes |
| `60` | 60 minutes (1 hour) |
| `1h` | 1 hour |
| `1h 30m` | 1 hour 30 minutes |
| `1.5` | 1.5 hours (90 minutes) |
| `90m` | 90 minutes |

Quick presets under the field: **15m**, **30m**, **45m**, **1h**.

A live preview on the right of the field shows how your input will be saved (e.g. `60` → `1h`). You’ll get a gentle warning if a session is longer than 8 hours — you can still save it.

---

## Skills

Open **Skills** from the top bar to manage everything you’re tracking.

### Add a skill

1. Click **Add skill**.
2. Enter a **name** (e.g. Spanish, Guitar, TypeScript).
3. Pick a **color** so cards and lists stay easy to scan.
4. Optionally enable a **goal**:
   - **Hours / week** — e.g. 5 hours every week
   - **Total hours** — e.g. 100 hours overall
5. Save.

### Edit or delete

On the Skills page (or a skill’s detail page), use **Edit** to change name, color, or goal. **Delete** asks for confirmation — deleting a skill also removes all of its sessions.

---

## Skill detail

Click any skill name (from the dashboard or Skills list) to open its detail page.

You’ll find:

- **Stats** — total hours, session count, current & longest streak, average session length
- **Goal progress** (if set) — ring, hours logged vs target, and whether you’re ahead, on track, or behind
- **Heatmap** — practice for this skill only
- **Weekly trend** — hours per week over the last 8 weeks
- **Session history** — full list (newest first), with edit and delete

From here you can also **Edit skill** or **Log session** for that skill.

---

## Streaks

Streaks count consecutive calendar days with at least one practice session (per skill, and overall on the dashboard).

| Status | Meaning |
|--------|---------|
| **Active** | You’ve practiced today (or your streak is intact) |
| **At risk** | You practiced yesterday but not yet today — log a session to keep it going |
| **Broken / none** | No current streak |

A broken streak simply resets — it’s a fresh start, not a failure.

---

## Dark mode

Use the moon / sun button in the top bar (or on the landing page) to switch themes. Your choice is remembered in this browser. If you haven’t chosen yet, the app follows your system preference.

---

## Tips for a good practice loop

1. **Log soon after you practice** — while notes are still fresh.
2. **Use presets** when sessions are usually 15 / 30 / 45 / 60 minutes.
3. **Set a weekly goal** on skills you want to stay consistent with; check the detail page to see if you’re on pace.
4. **Glance at the heatmap** weekly — empty stretches are easier to notice than raw hour totals.
5. **Keep notes short** — one or two sentences about what clicked or what’s next.

---

## FAQ

**Do I need an account?**  
Not for the current demo. Guest mode is enough to explore. Sign-in to save data across devices will arrive with Google authentication.

**Will my data persist?**  
In the current build, data lives in this browser session only. Refreshing may reset to the sample set. Cloud persistence is planned.

**Can I log practice for a past day?**  
Yes — change the date in the log form. Future dates aren’t allowed.

**What happens when I delete a skill?**  
That skill and all of its sessions are removed permanently (after you confirm).

**Why does “Continue with Google” open the dashboard?**  
Google sign-in isn’t wired yet; both landing buttons take you into the guest demo so you can try the product.

---

## Need help while exploring?

- Empty dashboard → **Add skill**, then **Log session**.
- Empty skill detail → log a first session from that page.
- Heatmap looks empty for a filter → try **All skills**, or pick a skill you’ve practiced recently.
