import type { SudokuGrid } from './grid';
import type { Puzzle } from './puzzle';

export interface GameState {
  id?: number; // Primary key for Dexie (optional for new inserts)
  puzzle: Puzzle;
  grid: SudokuGrid;
  elapsedTimeSeconds: number;
  lastPlayed: string; // ISO 8601 Date string
}
