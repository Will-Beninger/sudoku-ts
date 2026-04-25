---
name: git-sync
description: Manages the automated Git cycle: branch, commit, squash, merge, and push.
---

# Goal
Ensure every completed task is safely merged into `main` and pushed to GitHub without manual intervention.

# Instructions
1. **Verification:** Run `pnpm run lint` and `pnpm test`.
2. **Commit:** `git add .` then `git commit -m "auto: progress update for <task-id>"`
3. **Squash & Merge:** - `git checkout main`
   - `git merge --squash <feature-branch>`
   - `git commit -m "completed: <task-description>"`
4. **Push:** `git push origin main`

# Constraints
- Do not push if `pnpm test` returns a non-zero exit code.
- If a merge conflict occurs, pause and alert the user.