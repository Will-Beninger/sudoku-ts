export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

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
