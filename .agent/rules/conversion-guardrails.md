---
trigger: always_on
---

# Conversion Guardrails: Flutter to TypeScript

## 1. UI Mapping
- **Widget-to-Component:** Map Flutter `StatelessWidget` to React Functional Components.
- **Layout:** Convert `Column`/`Row` to Tailwind `flex-col`/`flex-row`.
- **Pixel Perfection:** Do not guess styles. Inspect the Dart `ThemeData` and create a `tailwind.config.ts` that matches the original color palette and spacing.

## 2. Logic Mapping
- **Asynchrony:** Map `Future` to `Promise` and `Stream` to `Observable` (or custom hooks).
- **State:** Replace `Provider`/`Riverpod` with `Jotai` or `Zustand` atoms.
- **Storage:** All `sqflite` operations must be converted to `Dexie.js` calls.

## 3. Autonomous Execution
- **Refactoring:** If you find a more idiomatic TypeScript way to write a Dart function, you are authorized to refactor, provided you document the change in `walkthrough.md`.