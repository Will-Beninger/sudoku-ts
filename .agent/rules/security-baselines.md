---
trigger: always_on
---

# Security & Threat Prevention

- **Secrets:** Never write hardcoded keys. If you find them in Dart, move them to a `.env.local` file immediately.
- **Sanitization:** Use `zod` for all form validation. Do not trust browser storage (IndexedDB) without schema validation.
- **GH-Pages:** Ensure the `gh-pages` branch deployment script strips all source maps and development metadata.