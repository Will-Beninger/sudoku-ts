---
trigger: always_on
---

# Rule: Global State Tracking

1. **The Source of Truth:** Maintain a `state.json` file in the root directory.
2. **Persistence:** Before ending any turn, update `state.json` with:
    - **Current Component:** The file currently being worked on.
    - **Known Constants:** Any API endpoints, theme colors, or logic flags discovered in the Dart source.
    - **Unresolved Dependencies:** Components referenced in the code but not yet built.
3. **Session Start:** At the beginning of every new session, your first action must be to read `state.json` to re-synchronize your internal state.