import type { SudokuGrid } from '../models/grid';

export const GridLogic = {
  emptyGrid(): SudokuGrid {
    return {
      rows: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => ({
          value: null,
          isFixed: false,
          isValid: true,
          notes: new Set<number>()
        }))
      )
    };
  },

  fromIntList(input: number[][]): SudokuGrid {
    return {
      rows: input.map(row =>
        row.map(val => ({
          value: val === 0 ? null : val,
          isFixed: val !== 0,
          isValid: true,
          notes: new Set<number>()
        }))
      )
    };
  },

  updateCell(grid: SudokuGrid, row: number, col: number, value: number | null): SudokuGrid {
    const newRows = grid.rows.map(r => [...r]);
    const oldCell = newRows[row][col];
    newRows[row][col] = {
      ...oldCell,
      value
    };
    return { rows: newRows };
  },

  updateCellNotes(grid: SudokuGrid, row: number, col: number, notes: Set<number>): SudokuGrid {
    const newRows = grid.rows.map(r => [...r]);
    newRows[row][col] = {
      ...newRows[row][col],
      notes
    };
    return { rows: newRows };
  },

  isValidMove(grid: SudokuGrid, row: number, col: number, value: number): boolean {
    const rows = grid.rows;

    // Check Row
    for (let c = 0; c < 9; c++) {
      if (c === col) continue;
      if (rows[row][c].value === value) return false;
    }

    // Check Column
    for (let r = 0; r < 9; r++) {
      if (r === row) continue;
      if (rows[r][col].value === value) return false;
    }

    // Check 3x3 Box
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;

    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
      for (let c = boxColStart; c < boxColStart + 3; c++) {
        if (r === row && c === col) continue;
        if (rows[r][c].value === value) return false;
      }
    }

    return true;
  },

  isComplete(grid: SudokuGrid): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = grid.rows[r][c].value;
        if (val === null) return false;
        if (!this.isValidMove(grid, r, c, val)) return false;
      }
    }
    return true;
  },

  getRandomEmptyPosition(grid: SudokuGrid): { r: number; c: number } | null {
    const emptyPositions: { r: number; c: number }[] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid.rows[r][c].value === null) {
          emptyPositions.push({ r, c });
        }
      }
    }
    if (emptyPositions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    return emptyPositions[randomIndex];
  },

  findConflicts(grid: SudokuGrid): Set<string> {
    const conflictingCells = new Set<string>();
    const rows = grid.rows;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = rows[r][c];
        if (cell.value === null) continue;

        let hasConflict = false;

        // Row
        for (let k = 0; k < 9; k++) {
          if (k === c) continue;
          if (rows[r][k].value === cell.value) {
            hasConflict = true;
            break;
          }
        }

        // Col
        if (!hasConflict) {
          for (let k = 0; k < 9; k++) {
            if (k === r) continue;
            if (rows[k][c].value === cell.value) {
              hasConflict = true;
              break;
            }
          }
        }

        // Box
        if (!hasConflict) {
          const boxRow = Math.floor(r / 3) * 3;
          const boxCol = Math.floor(c / 3) * 3;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const br = boxRow + i;
              const bc = boxCol + j;
              if (br === r && bc === c) continue;
              if (rows[br][bc].value === cell.value) {
                hasConflict = true;
                break;
              }
            }
            if (hasConflict) break;
          }
        }

        if (hasConflict && !cell.isFixed) {
          conflictingCells.add(`${r.toString()},${c.toString()}`);
        }
      }
    }

    return conflictingCells;
  },

  getCompletedNumbers(grid: SudokuGrid): Set<number> {
    const counts = new Map<number, number>();
    for (const row of grid.rows) {
      for (const cell of row) {
        if (cell.value !== null) {
          counts.set(cell.value, (counts.get(cell.value) ?? 0) + 1);
        }
      }
    }
    const completed = new Set<number>();
    for (const [val, count] of counts.entries()) {
      if (count >= 9) completed.add(val);
    }
    return completed;
  }
};
