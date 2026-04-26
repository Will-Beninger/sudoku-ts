import React from 'react';
import { useGame } from '../hooks/useGame';
import { useSettings } from '../hooks/useSettings';
import { SudokuCell } from './SudokuCell';
import './SudokuBoard.css';

export const SudokuBoard: React.FC = () => {
  const { grid, selectedRow, selectedCol, conflictingCells, selectCell } = useGame();
  const { settings } = useSettings();

  const selectedValue =
    selectedRow !== null && selectedCol !== null
      ? grid.rows[selectedRow][selectedCol].value
      : null;

  return (
    <div className="sudoku-board-container">
      <div className="sudoku-board">
        {grid.rows.map((row, rIndex) => (
          <div key={rIndex} className="sudoku-row">
            {row.map((cell, cIndex) => {
              const isSelected = rIndex === selectedRow && cIndex === selectedCol;
              
              let isHighlighted = false;
              if (selectedRow !== null && selectedCol !== null) {
                const sameRow = rIndex === selectedRow;
                const sameCol = cIndex === selectedCol;
                const sameBlock =
                  Math.floor(rIndex / 3) === Math.floor(selectedRow / 3) &&
                  Math.floor(cIndex / 3) === Math.floor(selectedCol / 3);
                const sameValue =
                  selectedValue !== null && cell.value === selectedValue;
                  
                isHighlighted = 
                  (settings.highlightRowCol && (sameRow || sameCol || sameBlock)) ||
                  (settings.highlightSameNumber && sameValue);
              }

              const isConflict = conflictingCells.has(`${String(rIndex)}-${String(cIndex)}`);

              return (
                <SudokuCell
                  key={`${String(rIndex)}-${String(cIndex)}`}
                  row={rIndex}
                  col={cIndex}
                  cell={cell}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  isConflict={isConflict}
                  onSelect={selectCell}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
