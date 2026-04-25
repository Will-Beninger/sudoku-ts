import React from 'react';
import { useGame } from '../hooks/useGame';
import './GameControls.css';

export const GameControls: React.FC = () => {
  const {
    isNoteMode,
    toggleNoteMode,
    clearCell,
    undo,
    canUndo,
    useHint,
    hintCooldown,
  } = useGame();

  return (
    <div className="game-controls">
      <button 
        className="control-btn" 
        onClick={undo} 
        disabled={!canUndo}
        type="button"
      >
        <span className="control-icon">↩</span>
        <span className="control-label">Undo</span>
      </button>

      <button 
        className="control-btn" 
        onClick={clearCell}
        type="button"
      >
        <span className="control-icon">⌫</span>
        <span className="control-label">Erase</span>
      </button>

      <button 
        className={`control-btn ${isNoteMode ? 'active' : ''}`} 
        onClick={toggleNoteMode}
        type="button"
      >
        <span className="control-icon">✎</span>
        <span className="control-label">{isNoteMode ? 'Notes On' : 'Notes Off'}</span>
      </button>

      <button 
        className="control-btn" 
        onClick={useHint} 
        disabled={hintCooldown > 0}
        type="button"
      >
        <span className="control-icon">💡</span>
        <span className="control-label">
          {hintCooldown > 0 ? `Wait ${String(hintCooldown)}s` : 'Hint'}
        </span>
      </button>
    </div>
  );
};
