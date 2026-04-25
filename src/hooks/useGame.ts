import { useCallback, useEffect, useRef } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { StorageService } from '../services/db';
import { GridLogic } from '../logic/gridLogic';
import type { Puzzle } from '../models/puzzle';
import * as state from './gameState';

export function useGame() {
  const [grid, setGrid] = useAtom(state.gridAtom);
  const [isLoading, setIsLoading] = useAtom(state.isLoadingAtom);
  const [isWon, setIsWon] = useAtom(state.isWonAtom);
  const [currentPuzzle, setCurrentPuzzle] = useAtom(state.currentPuzzleAtom);
  const [elapsedTime, setElapsedTime] = useAtom(state.elapsedTimeAtom);
  
  const [hintCooldown, setHintCooldown] = useAtom(state.hintCooldownAtom);
  const [conflictCooldown, setConflictCooldown] = useAtom(state.conflictCooldownAtom);
  const setConflictingCells = useSetAtom(state.conflictingCellsAtom);
  
  const [selectedRow, setSelectedRow] = useAtom(state.selectedRowAtom);
  const [selectedCol, setSelectedCol] = useAtom(state.selectedColAtom);
  const [isNoteMode, setIsNoteMode] = useAtom(state.isNoteModeAtom);
  const [history, setHistory] = useAtom(state.historyAtom);
  const setFeedbackMessage = useSetAtom(state.feedbackMessageAtom);

  const canUndo = useAtomValue(state.canUndoAtom);
  const isHintActive = useAtomValue(state.isHintActiveAtom);
  const isConflictCheckActive = useAtomValue(state.isConflictCheckActiveAtom);
  const conflictingCells = useAtomValue(state.conflictingCellsAtom);
  const completedNumbers = useAtomValue(state.completedNumbersAtom);
  const feedbackMessage = useAtomValue(state.feedbackMessageAtom);

  // Timers
  const timerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);
  const conflictTimerRef = useRef<number | null>(null);

  // Sync state refs to avoid stale closures in setTimeout/setInterval if needed
  const stateRef = useRef({ grid, isWon, currentPuzzle, elapsedTime });
  useEffect(() => {
    stateRef.current = { grid, isWon, currentPuzzle, elapsedTime };
  }, [grid, isWon, currentPuzzle, elapsedTime]);

  const saveGame = useCallback(async () => {
    const { currentPuzzle: p, isWon: w, grid: g, elapsedTime: t } = stateRef.current;
    if (!p || w || GridLogic.isComplete(g)) return;

    await StorageService.saveGame({
      puzzle: p,
      grid: g,
      elapsedTimeSeconds: t,
      lastPlayed: new Date().toISOString()
    });
  }, []);

  const resumeTimer = useCallback(() => {
    if (stateRef.current.isWon) return;
    if (timerRef.current !== null) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setElapsedTime(prev => {
        const next = prev + 1;
        if (next % 10 === 0) {
          void saveGame();
        }
        return next;
      });
    }, 1000);
  }, [setElapsedTime, saveGame]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    void saveGame();
  }, [saveGame]);

  const handleWin = useCallback(async () => {
    setIsWon(true);
    if (timerRef.current !== null) clearInterval(timerRef.current);
    if (hintTimerRef.current !== null) clearInterval(hintTimerRef.current);
    if (conflictTimerRef.current !== null) clearInterval(conflictTimerRef.current);

    await StorageService.deleteSavedGame();
    const { currentPuzzle: p, elapsedTime: t } = stateRef.current;
    if (p) {
      await StorageService.completeLevel(p.id, t * 1000);
    }
  }, [setIsWon]);

  const restartGameInternal = useCallback((puzzle: Puzzle) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hintTimerRef.current) clearInterval(hintTimerRef.current);
    if (conflictTimerRef.current) clearInterval(conflictTimerRef.current);

    setHintCooldown(0);
    setConflictCooldown(0);
    setConflictingCells(new Set());
    
    setIsLoading(true);
    setIsWon(false);
    setHistory([]);
    setElapsedTime(0);
    
    // Parse Initial string to grid
    const initialGrid = GridLogic.fromIntList(
      Array.from({ length: 9 }).map((_, r) => 
        Array.from({ length: 9 }).map((_, c) => {
          const char = puzzle.initialBoard[r * 9 + c];
          return parseInt(char, 10) || 0;
        })
      )
    );
    
    setGrid(initialGrid);
    setIsLoading(false);
  }, [setHintCooldown, setConflictCooldown, setConflictingCells, setIsLoading, setIsWon, setHistory, setElapsedTime, setGrid]);

  const startPuzzle = useCallback((puzzle: Puzzle) => {
    setCurrentPuzzle(puzzle);
    restartGameInternal(puzzle);
    // Timeout needed to let state update before saving
    setTimeout(() => { void saveGame(); }, 0);
  }, [setCurrentPuzzle, restartGameInternal, saveGame]);

  const restartGame = useCallback(() => {
    const p = stateRef.current.currentPuzzle;
    if (p) {
      void StorageService.deleteSavedGame();
      restartGameInternal(p);
      setTimeout(() => {
        void saveGame();
        resumeTimer();
      }, 0);
    }
  }, [restartGameInternal, saveGame, resumeTimer]);

  const loadSavedGame = useCallback(async () => {
    setIsLoading(true);
    const savedState = await StorageService.loadGame();
    
    if (savedState) {
      if (GridLogic.isComplete(savedState.grid)) {
        await StorageService.deleteSavedGame();
        setIsLoading(false);
        return;
      }

      setCurrentPuzzle(savedState.puzzle);
      setGrid(savedState.grid);
      setElapsedTime(savedState.elapsedTimeSeconds);
      setIsWon(false);
    }
    setIsLoading(false);
  }, [setIsLoading, setCurrentPuzzle, setGrid, setElapsedTime, setIsWon]);

  const selectCell = useCallback((row: number, col: number) => {
    setSelectedRow(row);
    setSelectedCol(col);
    setFeedbackMessage(null);
  }, [setSelectedRow, setSelectedCol, setFeedbackMessage]);

  const toggleNoteMode = useCallback(() => {
    setIsNoteMode(prev => !prev);
  }, [setIsNoteMode]);

  const undo = useCallback(() => {
    if (stateRef.current.isWon) return;
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const lastState = newHistory.pop();
      if (!lastState) return prev;
      setGrid(lastState);
      setTimeout(() => { void saveGame(); }, 0);
      return newHistory;
    });
  }, [setHistory, setGrid, saveGame]);

  const recordHistory = useCallback(() => {
    setHistory(prev => [...prev, stateRef.current.grid]);
  }, [setHistory]);

  const inputNumber = useCallback((number: number) => {
    if (selectedRow === null || selectedCol === null || stateRef.current.isWon) return;
    const { grid: g } = stateRef.current;
    const cell = g.rows[selectedRow][selectedCol];
    if (cell.isFixed) return;

    recordHistory();

    if (isNoteMode) {
      const newNotes = new Set(cell.notes);
      if (newNotes.has(number)) newNotes.delete(number);
      else newNotes.add(number);
      
      setGrid(GridLogic.updateCellNotes(g, selectedRow, selectedCol, newNotes));
    } else {
      setConflictingCells(new Set());
      setFeedbackMessage(null);
      const updatedGrid = GridLogic.updateCell(g, selectedRow, selectedCol, number);
      setGrid(updatedGrid);

      if (GridLogic.isComplete(updatedGrid)) {
        void handleWin();
        return;
      }
    }
    setTimeout(() => { void saveGame(); }, 0);
  }, [selectedRow, selectedCol, isNoteMode, recordHistory, setConflictingCells, setFeedbackMessage, setGrid, handleWin, saveGame]);

  const clearCell = useCallback(() => {
    if (selectedRow === null || selectedCol === null || stateRef.current.isWon) return;
    const { grid: g } = stateRef.current;
    if (g.rows[selectedRow][selectedCol].isFixed) return;

    recordHistory();
    setConflictingCells(new Set());
    setFeedbackMessage(null);
    let updatedGrid = GridLogic.updateCell(g, selectedRow, selectedCol, null);
    updatedGrid = GridLogic.updateCellNotes(updatedGrid, selectedRow, selectedCol, new Set());
    setGrid(updatedGrid);
    setTimeout(() => { void saveGame(); }, 0);
  }, [selectedRow, selectedCol, recordHistory, setConflictingCells, setFeedbackMessage, setGrid, saveGame]);

  const startHintCooldown = useCallback(() => {
    setHintCooldown(10);
    if (hintTimerRef.current !== null) clearInterval(hintTimerRef.current);
    hintTimerRef.current = window.setInterval(() => {
      setHintCooldown(prev => {
        if (prev <= 1) {
          if (hintTimerRef.current !== null) clearInterval(hintTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [setHintCooldown]);

  const useHint = useCallback(() => {
    const { isWon: w, currentPuzzle: p, grid: g } = stateRef.current;
    if (isHintActive || w || !p) return;

    const pos = GridLogic.getRandomEmptyPosition(g);
    if (!pos) return;

    const correctValStr = p.solutionBoard[pos.r * 9 + pos.c];
    const correctVal = parseInt(correctValStr, 10);

    const updatedGrid = GridLogic.updateCell(g, pos.r, pos.c, correctVal);
    setGrid(updatedGrid);
    startHintCooldown();

    if (GridLogic.isComplete(updatedGrid)) {
      void handleWin();
    }
  }, [isHintActive, setGrid, startHintCooldown, handleWin]);

  const startConflictCooldown = useCallback(() => {
    setConflictCooldown(10);
    if (conflictTimerRef.current !== null) clearInterval(conflictTimerRef.current);
    conflictTimerRef.current = window.setInterval(() => {
      setConflictCooldown(prev => {
        if (prev <= 1) {
          if (conflictTimerRef.current !== null) {
            clearInterval(conflictTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [setConflictCooldown]);

  const checkConflicts = useCallback(() => {
    const { isWon: w, grid: g } = stateRef.current;
    if (isConflictCheckActive || w) return;

    const conflicts = GridLogic.findConflicts(g);
    setConflictingCells(conflicts);

    if (conflicts.size === 0) {
      setFeedbackMessage('No Logic Errors Detected!');
    } else {
      setFeedbackMessage(null);
    }
    startConflictCooldown();
  }, [isConflictCheckActive, setConflictingCells, setFeedbackMessage, startConflictCooldown]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hintTimerRef.current) clearInterval(hintTimerRef.current);
      if (conflictTimerRef.current) clearInterval(conflictTimerRef.current);
    };
  }, []);

  return {
    grid,
    isLoading,
    isWon,
    currentPuzzle,
    elapsedTime,
    selectedRow,
    selectedCol,
    isNoteMode,
    canUndo,
    isHintActive,
    hintCooldown,
    isConflictCheckActive,
    conflictCooldown,
    conflictingCells,
    completedNumbers,
    feedbackMessage,
    history,
    
    startPuzzle,
    restartGame,
    loadSavedGame,
    resumeTimer,
    pauseTimer,
    selectCell,
    toggleNoteMode,
    undo,
    inputNumber,
    clearCell,
    useHint,
    checkConflicts
  };
}
