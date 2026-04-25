---
name: git-sync
description: Automated Git lifecycle with mandatory Production Build & Smoke Test.
---

# Goal
To prevent broken code from reaching gh-pages by enforcing a local production-build check.

# Instructions
1. **Static Check:** Run `pnpm run lint` and `pnpm run test`.
2. **Build Check:** Run `pnpm run build`. If this fails, stop and fix the code.
3. **Runtime Check (Smoke Test):**
   - Start the preview server: `pnpm run preview &` (or use a background process).
   - Use Playwright to verify the root element exists:
     `npx playwright test --grep "smoke"`
   - Kill the preview server.
4. **Git Cycle:** - If Green: `git add .`, `git commit -m "verified build: <task>"`, `git push origin main`.
   - If Red: Revert changes or fix immediately. Never push a failed build.

# Constraints
- **Zero-Tolerance:** Any "blank screen" or console error during the Build Check is a blocker.
- **Branching:** Always work on a `dev-` branch and only merge to `main` after the Runtime Check passes.