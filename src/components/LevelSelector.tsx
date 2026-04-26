import { useState } from 'react';
import { useAtom } from 'jotai';
import { routeAtom } from '../router';
import { usePuzzlePacks } from '../hooks/usePuzzlePacks';
import type { Difficulty } from '../models/puzzle';
import './LevelSelector.css';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#4caf50',
  medium: '#ff9800',
  hard: '#f44336',
};

export const LevelSelector = () => {
  const [, setRoute] = useAtom(routeAtom);
  const { packs, isLoading, error, savedPuzzleId, completedPuzzleIds } = usePuzzlePacks();
  const [expandedPack, setExpandedPack] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="level-selector">
        <header className="ls-header">
          <button className="ls-back" onClick={() => { setRoute({ screen: 'menu' }); }}>←</button>
          <h1>Select Level</h1>
        </header>
        <div className="ls-loading">Loading puzzles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="level-selector">
        <header className="ls-header">
          <button className="ls-back" onClick={() => { setRoute({ screen: 'menu' }); }}>←</button>
          <h1>Select Level</h1>
        </header>
        <div className="ls-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="level-selector">
      <header className="ls-header">
        <button className="ls-back" onClick={() => { setRoute({ screen: 'menu' }); }}>←</button>
        <h1>Select Level</h1>
      </header>

      <div className="ls-packs">
        {packs.map((pack) => {
          const difficulty = pack.puzzles[0]?.difficulty ?? 'easy';
          const isExpanded = expandedPack === pack.id;

          return (
            <div key={pack.id} className="ls-pack">
              <button
                className={`ls-pack-header ${isExpanded ? 'expanded' : ''}`}
                onClick={() => { setExpandedPack(isExpanded ? null : pack.id); }}
              >
                <span className="ls-pack-name">{pack.name}</span>
                <span className="ls-pack-chevron">{isExpanded ? '▾' : '▸'}</span>
              </button>

              {isExpanded && (
                <div className="ls-puzzle-list">
                  <div
                    className="ls-difficulty-badge"
                    style={{ color: DIFFICULTY_COLORS[difficulty] }}
                  >
                    {DIFFICULTY_LABELS[difficulty]}
                  </div>

                  {pack.puzzles.map((puzzle, index) => {
                    const isInProgress = savedPuzzleId === puzzle.id;
                    const isCompleted = completedPuzzleIds.has(puzzle.id);

                    return (
                      <button
                        key={puzzle.id}
                        className="ls-puzzle-item"
                        onClick={() => { setRoute({ screen: 'game', puzzleId: puzzle.id }); }}
                      >
                        <span
                          className={`ls-puzzle-num ${isInProgress ? 'in-progress' : isCompleted ? 'completed' : ''}`}
                        >
                          {isInProgress ? '▶' : (index + 1)}
                        </span>
                        <span className="ls-puzzle-name">Puzzle {puzzle.id}</span>
                        {isInProgress && <span className="ls-badge ls-badge-progress">In Progress</span>}
                        {isCompleted && <span className="ls-badge ls-badge-complete">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
