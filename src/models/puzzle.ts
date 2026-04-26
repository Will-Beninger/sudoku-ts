export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: string;
  initialBoard: string;
  solutionBoard: string;
  difficulty: Difficulty;
}

export interface PuzzlePack {
  id: string;
  name: string;
  puzzles: Puzzle[];
}

/** Shape of individual puzzle entries in the JSON files */
export interface RawPuzzleJson {
  id: string;
  initial: string;
  solution: string;
  difficulty: string;
}

/** Shape of the top-level JSON pack file */
export interface RawPuzzlePackJson {
  packId: string;
  name: string;
  version: number;
  puzzles: RawPuzzleJson[];
}
