import { useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import type { Puzzle } from '../models/puzzle';
import { SudokuBoard } from './SudokuBoard';
import { NumberPad } from './NumberPad';
import { GameControls } from './GameControls';
import './GameScreen.css';

const MOCK_PUZZLE: Puzzle = {
  id: 'mock-1',
  difficulty: 'easy',
  initialBoard: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  solutionBoard: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const GameScreen = () => {
  const { startPuzzle, isLoading, elapsedTime, resumeTimer } = useGame();

  useEffect(() => {
    startPuzzle(MOCK_PUZZLE);
    resumeTimer(); // start timer for mock puzzle
  }, [startPuzzle, resumeTimer]);

  if (isLoading) return <div className="game-screen"><p>Loading...</p></div>;

  return (
    <div className="game-screen">
      <header className="game-header">
        <div className="header-left">
          <span className="difficulty-badge">{MOCK_PUZZLE.difficulty.toUpperCase()}</span>
        </div>
        <h1>Sudoku</h1>
        <div className="header-right">
          <span className="timer">{formatTime(elapsedTime)}</span>
        </div>
      </header>
      <main className="game-main">
        <SudokuBoard />
        <GameControls />
        <NumberPad />
      </main>
    </div>
  );
};
