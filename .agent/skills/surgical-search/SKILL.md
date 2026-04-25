---
name: surgical-search
description: Locates specific logic in ../sudoku using PowerShell.
---

# Instructions
1. Run: `Select-String -Path "../sudoku/**/*.dart" -Pattern "<term>"` to find the file.
2. Run: `Get-Content <file> | Select-Object -First 50` (or similar) to extract only the block you need.
3. Cache the file path and relevant snippet in `state.json` so you don't have to search for it again.

# Constraints
- Never read more than 1 file or 100 lines per turn.
- If the search returns multiple files, pick the most likely candidate and update the state.