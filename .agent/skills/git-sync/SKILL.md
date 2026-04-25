---
name: git-sync
description: Manages the full lifecycle from local commit to live deployment verification.
---

# Instructions
1. **Local Pre-check:** Run `pnpm run build` and `pnpm test`.
2. **Commit & Push:** Stage changes, commit, and push to `main`.
3. **Monitor CI/CD:** - Execute `gh run watch`. This will block the agent until the GitHub Action completes.
   - If the run fails, use `gh run view --log` to diagnose the failure and fix it locally.
4. **Live Verification:**
   - Once the run is successful, wait 30 seconds for GitHub Pages propagation.
   - Execute `npx playwright test --config=playwright.live.config.ts`.
5. **Final Handshake:** Only mark the task as "Completed" in `implementation_plan.md` if the live URL returns a 200 status and passes the smoke test.