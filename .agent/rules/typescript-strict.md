# TypeScript & Code Quality Rules

- **Strict Mode:** Always ensure `tsconfig.json` has `"strict": true`.
- **No 'any':** The use of `any` is a breaking error. Use `unknown` or define a proper Interface.
- **Relational Data:** When implementing storage, use `Dexie.js` (IndexedDB) and ensure every model has a corresponding TypeScript interface in `src/models/`.
- **DRY Logic:** If logic is repeated twice, abstract it into a custom Hook in `src/hooks/`.
- **File Naming:** Use PascalCase for React components (e.g., `DataChart.tsx`) and camelCase for logic files.