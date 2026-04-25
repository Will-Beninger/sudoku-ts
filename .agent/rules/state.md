---
trigger: always_on
---

# State & Integration Guardrails

## The Global State (state.json)
- Maintain `state.json` as your "long-term memory." 
- At the start of a session, read `state.json` to understand the current "Context Map."
- At the end of every turn, update `state.json` with new component exports, prop types, and shared state keys.

## Integration Check
- Before creating a component, you must read the `state.json` and `src/types.ts` to verify the "Contract." 
- Do not read the full implementation of other components; trust the definitions in the state/type files.

## Conflict Resolution
- If `state.json` contradicts the filesystem, the **filesystem is the Source of Truth**. Update `state.json` immediately and continue.