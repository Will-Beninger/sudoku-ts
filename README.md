# Sudoku-TS: Web-Native Migration

A high-performance, web-native Sudoku application built with TypeScript and React. This project represents a migration from an existing Flutter/Dart WASM implementation to a DOM-based architecture for better accessibility, performance, and device support.

## Project Architecture
- **Frontend:** TypeScript + React (Vite)
- **Styling:** Tailwind CSS
- **Local Persistence:** Dexie.js (IndexedDB)
- **Execution Engine:** Antigravity Autonomous Agent

## Directory Structure
- `.agent/`: Autonomous agent logic (rules, skills, and workflows).
- `src/`: TypeScript source code.
- `implementation_plan.md`: The living roadmap for the migration process.
- `AGENTS.md`: Core behavioral instructions for the agent.

## Local Setup
1. **Install dependencies:**
   ```powershell
   pnpm install