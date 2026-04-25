import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'jotai';
import type { ReactNode } from 'react';
import { useGame } from '../hooks/useGame';
import type { Puzzle } from '../models/puzzle';

const MOCK_PUZZLE: Puzzle = {
  id: 'test-puzzle',
  difficulty: 'easy',
  initialBoard: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  solutionBoard: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
};

function wrapper({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}

describe('useGame', () => {
  beforeEach(() => {
    // Each test gets a fresh Jotai store via the Provider wrapper
  });

  it('startPuzzle populates the grid and resets state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.startPuzzle(MOCK_PUZZLE);
    });

    // Grid should have the initial board parsed
    expect(result.current.grid.rows[0][0].value).toBe(5);
    expect(result.current.grid.rows[0][0].isFixed).toBe(true);
    expect(result.current.grid.rows[0][2].value).toBeNull(); // 0 in initial
    expect(result.current.isWon).toBe(false);
    expect(result.current.elapsedTime).toBe(0);
  });

  it('inputNumber updates a non-fixed cell', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => { result.current.startPuzzle(MOCK_PUZZLE); });
    act(() => { result.current.selectCell(0, 2); }); // row 0, col 2 is empty (0)
    act(() => { result.current.inputNumber(4); });

    expect(result.current.grid.rows[0][2].value).toBe(4);
  });

  it('inputNumber does not modify a fixed cell', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => { result.current.startPuzzle(MOCK_PUZZLE); });
    act(() => { result.current.selectCell(0, 0); }); // row 0, col 0 is fixed (5)
    act(() => { result.current.inputNumber(9); });

    expect(result.current.grid.rows[0][0].value).toBe(5); // unchanged
  });

  it('clearCell removes value from non-fixed cell', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => { result.current.startPuzzle(MOCK_PUZZLE); });
    act(() => { result.current.selectCell(0, 2); });
    act(() => { result.current.inputNumber(4); });
    expect(result.current.grid.rows[0][2].value).toBe(4);

    act(() => { result.current.clearCell(); });
    expect(result.current.grid.rows[0][2].value).toBeNull();
  });

  it('undo restores previous grid state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => { result.current.startPuzzle(MOCK_PUZZLE); });
    act(() => { result.current.selectCell(0, 2); });
    act(() => { result.current.inputNumber(4); });
    expect(result.current.grid.rows[0][2].value).toBe(4);
    expect(result.current.canUndo).toBe(true);

    act(() => { result.current.undo(); });
    expect(result.current.grid.rows[0][2].value).toBeNull();
  });

  it('toggleNoteMode switches note input on and off', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.isNoteMode).toBe(false);
    act(() => { result.current.toggleNoteMode(); });
    expect(result.current.isNoteMode).toBe(true);
    act(() => { result.current.toggleNoteMode(); });
    expect(result.current.isNoteMode).toBe(false);
  });

  it('note mode input adds notes to cell instead of value', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => { result.current.startPuzzle(MOCK_PUZZLE); });
    act(() => { result.current.toggleNoteMode(); });
    act(() => { result.current.selectCell(0, 2); });
    act(() => { result.current.inputNumber(1); });
    act(() => { result.current.inputNumber(4); });

    const cell = result.current.grid.rows[0][2];
    expect(cell.value).toBeNull(); // value should remain null in note mode
    expect(cell.notes.has(1)).toBe(true);
    expect(cell.notes.has(4)).toBe(true);
  });
});
