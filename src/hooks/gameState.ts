import { atom } from 'jotai';
import type { Puzzle } from '../models/puzzle';
import type { SudokuGrid } from '../models/grid';
import { GridLogic } from '../logic/gridLogic';

export const gridAtom = atom<SudokuGrid>(GridLogic.emptyGrid());
export const isLoadingAtom = atom<boolean>(false);
export const isWonAtom = atom<boolean>(false);
export const currentPuzzleAtom = atom<Puzzle | null>(null);

// Timer
export const elapsedTimeAtom = atom<number>(0);

// Hints & Conflicts
export const hintCooldownAtom = atom<number>(0);
export const conflictCooldownAtom = atom<number>(0);
export const conflictingCellsAtom = atom<Set<string>>(new Set<string>());

// Selection
export const selectedRowAtom = atom<number | null>(null);
export const selectedColAtom = atom<number | null>(null);

// Modes and History
export const isNoteModeAtom = atom<boolean>(false);
export const historyAtom = atom<SudokuGrid[]>([]);

export const feedbackMessageAtom = atom<string | null>(null);

// Derived States
export const canUndoAtom = atom((get) => get(historyAtom).length > 0);
export const isHintActiveAtom = atom((get) => get(hintCooldownAtom) > 0);
export const isConflictCheckActiveAtom = atom((get) => get(conflictCooldownAtom) > 0);
export const completedNumbersAtom = atom((get) => GridLogic.getCompletedNumbers(get(gridAtom)));
