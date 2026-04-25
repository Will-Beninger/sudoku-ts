import { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import type { Puzzle } from '../models/puzzle';
import './GameScreen.css';

const MOCK_PUZZLE: Puzzle = {
  id: 'mock-1',
  difficulty: 'easy',
  initialBoard: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  solutionBoard: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
};

export const GameScreen = () => {
  const { startPuzzle, isLoading } = useGame();

  useEffect(() => {
    // Start puzzle on mount for testing
    startPuzzle(MOCK_PUZZLE);
  }, [startPuzzle]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="game-screen">
      <header className="game-header">
        <h1>Sudoku: Always Free</h1>
      </header>
      <main className="game-main">
        <div className="board-placeholder">
          <p>Board UI goes here</p>
        </div>
      </main>
    </div>
  );
};
