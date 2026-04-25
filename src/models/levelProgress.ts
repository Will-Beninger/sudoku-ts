export interface LevelProgress {
  puzzleId: string; // Primary key
  completed: boolean;
  bestTimeMs: number | null;
}

export interface AppStats {
  id: number; // Single record (e.g., id=1)
  gamesWon: number;
}
