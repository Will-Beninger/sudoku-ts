import { describe, it, expect, beforeEach } from 'vitest';
import { GridLogic } from '../logic/gridLogic';
import type { SudokuGrid } from '../models/grid';

describe('GridLogic', () => {
  describe('emptyGrid', () => {
    it('creates a 9x9 grid of null non-fixed cells', () => {
      const grid = GridLogic.emptyGrid();
      expect(grid.rows).toHaveLength(9);
      for (const row of grid.rows) {
        expect(row).toHaveLength(9);
        for (const cell of row) {
          expect(cell.value).toBeNull();
          expect(cell.isFixed).toBe(false);
          expect(cell.isValid).toBe(true);
          expect(cell.notes).toBeInstanceOf(Set);
          expect(cell.notes.size).toBe(0);
        }
      }
    });
  });

  describe('fromIntList', () => {
    it('maps non-zero values as fixed, zero as null', () => {
      const input = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
      input[0][0] = 5;
      input[4][4] = 9;

      const grid = GridLogic.fromIntList(input);
      expect(grid.rows[0][0].value).toBe(5);
      expect(grid.rows[0][0].isFixed).toBe(true);
      expect(grid.rows[4][4].value).toBe(9);
      expect(grid.rows[4][4].isFixed).toBe(true);
      expect(grid.rows[0][1].value).toBeNull();
      expect(grid.rows[0][1].isFixed).toBe(false);
    });
  });

  describe('updateCell', () => {
    it('returns a new grid with updated value without mutating original', () => {
      const grid = GridLogic.emptyGrid();
      const updated = GridLogic.updateCell(grid, 0, 0, 5);

      expect(updated.rows[0][0].value).toBe(5);
      expect(grid.rows[0][0].value).toBeNull(); // original unchanged
    });

    it('can set a value back to null', () => {
      const grid = GridLogic.updateCell(GridLogic.emptyGrid(), 0, 0, 5);
      const cleared = GridLogic.updateCell(grid, 0, 0, null);
      expect(cleared.rows[0][0].value).toBeNull();
    });
  });

  describe('updateCellNotes', () => {
    it('returns a new grid with updated notes without mutating original', () => {
      const grid = GridLogic.emptyGrid();
      const notes = new Set([1, 3, 7]);
      const updated = GridLogic.updateCellNotes(grid, 2, 3, notes);

      expect(updated.rows[2][3].notes).toEqual(notes);
      expect(grid.rows[2][3].notes.size).toBe(0); // original unchanged
    });
  });

  describe('isValidMove', () => {
    let grid: SudokuGrid;

    beforeEach(() => {
      grid = GridLogic.emptyGrid();
      grid = GridLogic.updateCell(grid, 0, 0, 5);
    });

    it('rejects duplicate in same row', () => {
      expect(GridLogic.isValidMove(grid, 0, 5, 5)).toBe(false);
    });

    it('rejects duplicate in same column', () => {
      expect(GridLogic.isValidMove(grid, 5, 0, 5)).toBe(false);
    });

    it('rejects duplicate in same 3x3 box', () => {
      expect(GridLogic.isValidMove(grid, 1, 1, 5)).toBe(false);
    });

    it('allows valid placement', () => {
      expect(GridLogic.isValidMove(grid, 3, 3, 5)).toBe(true);
    });

    it('allows same value at cell position (self-check)', () => {
      expect(GridLogic.isValidMove(grid, 0, 0, 5)).toBe(true);
    });
  });

  describe('isComplete', () => {
    it('returns false for empty grid', () => {
      expect(GridLogic.isComplete(GridLogic.emptyGrid())).toBe(false);
    });

    it('returns true for a valid complete board', () => {
      const solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];
      const grid = GridLogic.fromIntList(solution);
      expect(GridLogic.isComplete(grid)).toBe(true);
    });

    it('returns false for board with conflict', () => {
      const bad = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 1));
      const grid = GridLogic.fromIntList(bad);
      expect(GridLogic.isComplete(grid)).toBe(false);
    });
  });

  describe('getRandomEmptyPosition', () => {
    it('returns null for a full board', () => {
      const full = Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => ((r * 3 + Math.floor(r / 3) + c) % 9) + 1)
      );
      // Note: this won't be a valid sudoku but all cells are non-null
      const grid = GridLogic.fromIntList(full);
      expect(GridLogic.getRandomEmptyPosition(grid)).toBeNull();
    });

    it('returns a valid position for a partially filled board', () => {
      const grid = GridLogic.emptyGrid();
      const pos = GridLogic.getRandomEmptyPosition(grid);
      expect(pos).not.toBeNull();
      if (pos === null) return; // type-narrow for strict mode
      expect(pos.r).toBeGreaterThanOrEqual(0);
      expect(pos.r).toBeLessThan(9);
      expect(pos.c).toBeGreaterThanOrEqual(0);
      expect(pos.c).toBeLessThan(9);
    });
  });

  describe('findConflicts', () => {
    it('returns empty set for valid grid', () => {
      const grid = GridLogic.updateCell(GridLogic.emptyGrid(), 0, 0, 5);
      expect(GridLogic.findConflicts(grid).size).toBe(0);
    });

    it('detects row conflicts for non-fixed cells', () => {
      let grid = GridLogic.emptyGrid();
      // Place 5 at (0,0) as fixed via fromIntList
      const input = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
      input[0][0] = 5;
      grid = GridLogic.fromIntList(input);
      // Place another 5 at (0,5) as non-fixed
      grid = GridLogic.updateCell(grid, 0, 5, 5);

      const conflicts = GridLogic.findConflicts(grid);
      expect(conflicts.has('0,5')).toBe(true);
      // Fixed cells should NOT be in the conflict set
      expect(conflicts.has('0,0')).toBe(false);
    });
  });

  describe('getCompletedNumbers', () => {
    it('returns empty set for empty grid', () => {
      expect(GridLogic.getCompletedNumbers(GridLogic.emptyGrid()).size).toBe(0);
    });

    it('returns number when it appears 9 times', () => {
      let grid = GridLogic.emptyGrid();
      for (let r = 0; r < 9; r++) {
        grid = GridLogic.updateCell(grid, r, 0, 5);
      }
      const completed = GridLogic.getCompletedNumbers(grid);
      expect(completed.has(5)).toBe(true);
      expect(completed.size).toBe(1);
    });
  });
});
