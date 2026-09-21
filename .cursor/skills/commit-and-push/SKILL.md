---
name: commit-and-push
description: Review code changes, group them into logical commits, write clear commit messages, run a production build check, and push to the remote repository. Use whenever the user asks to "commit", "commit and push", "save changes to git", or similar.
---

# Commit & Push Skill

## Goal

Take the current working-tree changes, split them into **small, logically coherent commits**, write clear commit messages, verify the production build, and push to the remote branch.

## Step 1 — Inspect the changes

1. Run `git status` to see all modified / added / deleted / untracked files.
2. Run `git diff` (and `git diff --staged` if anything is already staged) to understand _what_ changed, not just _which files_.
3. If there are untracked files, check whether they should be included (skip build artifacts, `.env`, `node_modules`, logs, etc. — respect `.gitignore`; do not force-add ignored files unless explicitly asked).

## Step 2 — Group changes into logical commits

Do NOT default to one giant commit. Look at the diff and cluster changes by:

- **Feature / module** — changes to the same feature or component go together.
- **Type of change** — separate refactors, bug fixes, new features, formatting/style-only changes, config changes, and dependency bumps into different commits.
- **Dependency order** — if change B depends on change A (e.g. a new util function + its usage), commit A before B, or combine them if splitting would leave the repo in a broken/non-building state at either commit.

Rules of thumb:

- Each commit should leave the codebase in a working (buildable/runnable) state whenever possible.
- Unrelated changes (e.g. a typo fix in an unrelated file + a new feature) must NOT be in the same commit.
- If there's only one small, cohesive change, one commit is fine — don't split artificially just to hit a number.
- Prefer several small, reviewable commits over one large one when the diff touches multiple concerns.

## Step 3 — Stage and commit each group

For each logical group:

1. Stage only the relevant files/hunks:
   - Whole files: `git add path/to/file1 path/to/file2`
   - Partial changes within a file (when a file has multiple unrelated changes): `git add -p path/to/file` and select only the relevant hunks.
2. Write a commit message using **Conventional Commits** style:
   ```
   <type>(<scope>): <short summary, imperative mood, ≤50 chars>

   <optional body: what changed and why, wrapped at ~72 chars>
   ```
   Common types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`, `build`, `ci`.
3. Commit: `git commit -m "<subject>" -m "<body>"` (omit the second `-m` if no body is needed).
4. Repeat for the next group until all changes are committed.

## Step 4 — Build check (required before push)

Run the production build and **do not push** until it succeeds:

```bash
pnpm run build
```

- This runs `tsc -b && vite build` (typecheck + Vite bundle). Fix any TypeScript or build errors before continuing.
- If the build fails, fix the errors, amend or add a follow-up commit as appropriate, and re-run the build until it passes.
- Skip this step only if the user explicitly says to push without a build check.

## Step 5 — Review before pushing

1. Run `git log --oneline -n <number of new commits>` to show the commits that were just created.
2. Run `git status` to confirm the working tree is clean (nothing left unstaged/uncommitted unintentionally).
3. Briefly summarize the commits made (list of subject lines) so the user can sanity-check before pushing.

## Step 6 — Push

1. Determine the current branch: `git branch --show-current`.
2. Push: `git push origin <branch>` (or `git push -u origin <branch>` if the branch has no upstream yet).
3. If the push is rejected (non-fast-forward), do NOT force-push automatically — report the situation to the user and ask whether to `git pull --rebase` first or handle it manually.

## Safety notes

- Never use `git push --force` or `git reset --hard` without explicit user confirmation.
- Never commit secrets, `.env` files, credentials, or large binaries — flag them to the user instead of committing.
- If a diff is large or ambiguous, ask the user for clarification on intent rather than guessing the grouping.
- Always show the planned commit breakdown (groups + messages) before actually running `git commit`, unless the user has said to just proceed automatically.
- Never push when `pnpm run build` is failing (see Step 4).
