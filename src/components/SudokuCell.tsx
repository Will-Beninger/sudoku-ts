import React from 'react';
import type { SudokuCell as CellModel } from '../models/cell';
import './SudokuCell.css';

interface SudokuCellProps {
  cell: CellModel;
  row: number;
  col: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isConflict: boolean;
  onSelect: (row: number, col: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isHighlighted,
  isConflict,
  onSelect,
}) => {
  const classes = ['sudoku-cell'];
  
  if (isSelected) classes.push('selected');
  else if (isHighlighted) classes.push('highlighted');
  
  if (isConflict) classes.push('conflict');
  
  if (cell.isFixed) classes.push('fixed');
  else classes.push('user-input');

  // Borders for 3x3 blocks
  if (col % 3 === 2 && col !== 8) classes.push('border-right-thick');
  if (row % 3 === 2 && row !== 8) classes.push('border-bottom-thick');

  const handleClick = () => { onSelect(row, col); };

  return (
    <div className={classes.join(' ')} onClick={handleClick}>
      {cell.value ? (
        <span className="cell-value">{cell.value}</span>
      ) : cell.notes.size > 0 ? (
        <div className="cell-notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="note-number">
              {cell.notes.has(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
