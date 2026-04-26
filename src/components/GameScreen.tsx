import { useEffect, useCallback, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { routeAtom } from '../router';
import type { AppRoute } from '../router';
import { useGame } from '../hooks/useGame';
import { usePuzzlePacks } from '../hooks/usePuzzlePacks';
import { SudokuBoard } from './SudokuBoard';
import { NumberPad } from './NumberPad';
import { GameControls } from './GameControls';
import { GameOptionsOverlay } from './GameOptionsOverlay';
import './GameScreen.css';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const GameScreen = () => {
  const [route, setRoute] = useAtom(routeAtom);
  const [showOptions, setShowOptions] = useState(false);
  const { getPuzzleById } = usePuzzlePacks();
  const {
    startPuzzle,
    loadSavedGame,
    resumeTimer,
    pauseTimer,
    isLoading,
    isWon,
    elapsedTime,
    currentPuzzle,
  } = useGame();

  // Determine what to load based on route
  const isResume = route.screen === 'game' && 'resumeSave' in route;
  const puzzleId = route.screen === 'game' && 'puzzleId' in route ? (route as AppRoute & { puzzleId: string }).puzzleId : null;

  // Mount-only init: use ref to prevent re-runs from unstable hook refs
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (isResume) {
      void loadSavedGame().then(() => {
        resumeTimer();
      });
    } else if (puzzleId) {
      const puzzle = getPuzzleById(puzzleId);
      if (puzzle) {
        startPuzzle(puzzle);
        resumeTimer();
      }
    }
  });

  const handleBack = useCallback(() => {
    pauseTimer();
    setRoute({ screen: 'menu' });
  }, [pauseTimer, setRoute]);

  if (isLoading) return <div className="game-screen"><p>Loading...</p></div>;

  return (
    <div className="game-screen">
      <header className="game-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>←</button>
          {currentPuzzle && (
            <span className="difficulty-badge">{currentPuzzle.difficulty.toUpperCase()}</span>
          )}
        </div>
        <h1>Sudoku</h1>
        <div className="header-right">
          <span className="timer">{formatTime(elapsedTime)}</span>
          <button className="gear-btn" onClick={() => { setShowOptions(true); }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </header>

      {isWon && (
        <div className="win-banner">
          <p>🎉 Puzzle Complete!</p>
          <p className="win-time">Time: {formatTime(elapsedTime)}</p>
          <button className="menu-return-btn" onClick={handleBack}>Back to Menu</button>
        </div>
      )}

      <main className="game-main">
        <SudokuBoard />
        <GameControls />
        <NumberPad />
      </main>

      {showOptions && <GameOptionsOverlay onClose={() => { setShowOptions(false); }} />}
    </div>
  );
};
